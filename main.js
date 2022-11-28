const express = require("express");
const { Comentario } = require("./comentario");
const { ContenedorArchivo } = require("./contenedores/contenedorArchivo");
const { Router } = express;
const routerProductos = Router();
const routerUsuarios = Router();
const routerCarrito = Router();
const routerProductosTest = Router();
const routerProductosRandom = Router();
const routerRandom = Router();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT; //process.argv[2] || 8080 lo cambie para heroku
console.log(PORT);
const { faker } = require("@faker-js/faker");
const { generateProducts } = require("./utils/generadorDeProductos");
const { checkAuth, isValidPassword, createHash } = require("./utils/checkAuth");
faker.locale = "es";
const fs = require("fs");
const normalizr = require("normalizr");
const { normalize, denormalize, schema } = normalizr;
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const http = require("http");
const { fork } = require("child_process");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const numCPUs = require("os").cpus().length;
const compression = require("compression");
const logger = require("./logs/log4js");

/* const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        //console.dir(cb)
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({storage: storage}) */

//config mongo atlas
const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const resultBuffer = fs.readFileSync("./txt/comentarios.txt");
const originalComments = JSON.parse(resultBuffer.toString().trim());

//Definir los esquemas
const authorSchema = new schema.Entity("author");
const messageSchema = new schema.Entity("message");

const finalSchema = [
    {
        author: authorSchema,
        message: messageSchema,
    },
];

// ---------------------- Datos Originales ----------------
const msj = originalComments;
console.log("original ", JSON.stringify(msj).length);
//591
// ---------------------- Datos Normalizado ----------------
const normalizedComments = normalize(msj, finalSchema);
console.log("normalizado ", JSON.stringify(normalizedComments).length);
//498

// ---------------------- Datos Denormalizado ----------------
const denormalizedComments = denormalize(
    normalizedComments,
    finalSchema,
    normalizedComments.entities
);
console.log("denormalizado ", JSON.stringify(denormalizedComments).length);
//498

//desafio faker consigna 1
routerProductosTest.get("/", (req, res) => {
    const productos = generateProducts(5);
    res.render("pages/index.ejs", {
        listaProductos: productos,
    });
});

const UsuarioDaoMongoDB = require("./daos/usuarios/usuariosDaoMongoDB");
const usuario = new UsuarioDaoMongoDB();

//const CarritoDaoArchivo = require("./daos/carritos/carritoDaoArchivo")
const {CarritoDaoMongoDB} = require("./daos/carritos/carritoDaoMongoDB")
//const {CarritoDaoFirebase} = require("./daos/carritos/carritoDaoFirebase")

//const ProductoDaoArchivo = require("./daos/productos/ProductoDaoArchivo")
const {ProductosDaoMongoDB} = require("./daos/productos/productoDaoMongoDB")
//const {ProductosDaoFirebase} = require("./daos/productos/productoDaoFirebase")

/* const producto = new ProductoDaoArchivo('./txt/ecommerce.txt')
const carrito = new CarritoDaoArchivo('./txt/carrito.txt') */




/* asdadsasd */

const productoDao = new ProductosDaoMongoDB()
const carritoDao = new CarritoDaoMongoDB()

/* const producto = new ProductosDaoFirebase()
const carrito = new CarritoDaoFirebase() */

// const contenedor = new ContenedorArchivo("./txt/ecommerce.txt");
const comentario = new Comentario("./txt/comentarios.txt");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));




/* app.use(compression()) */

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/////desafio base de datos
const { optionsMariaDB } = require("./config/mariaDB");
const { optionsSQLlite } = require("./config/conexionSQLITEDB");
const knexMariaDB = require("knex")(optionsMariaDB);
const knexSqlLite = require("knex")(optionsSQLlite);
const { Container } = require("./contenedores/containerSQLDB");
const { cwd, execArgv, argv } = require("process");
/* const container = new Container(knexMariaDB, "desafioSQL"); */
const containerLite = new Container(knexSqlLite, "comentariosSQL");

//mongo atlas
app.use(
    session({
        secret: "123456",
        resave: true,
    //mongo atlas
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_ATLAS,
            mongoOptions: mongoConfig,
        }),
    //agregue para desafio passport
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 10,
        },
        rolling: true,
        saveUninitialized: false,
    })
);
//passport
app.use(passport.initialize());
app.use(passport.session());

const Users = [];

/////////////////////// passport serialize /////////////

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    let user = await usuario.getByEmail(email);
    done(null, user);
});

///// desafio base de datos
/* const item = [
    {
        name: "Camiseta Argentina",
        price: "17000",
        thumbnail: "https://todosobrecamisetas.com/wp-content/uploads/camiseta-adidas-argentina-2022-3.jpg"
    },
    {
        name: "Camiseta España",
        price: 17000,
        thumbnail: "https://www.intersport.es/dw/image/v2/BBWT_PRD/on/demandware.static/-/Sites-intersport-master-catalog/default/dw94c6c6be/images/iic-adidas-BR2713-713-hero-x-0001.jpg?sw=580&sh=580&sm=fit"
    },
    {
        name: "Camiseta Inglaterra",
        price: "17000",
        thumbnail: "https://todosobrecamisetas.com/wp-content/uploads/england-womens-euro-2022-nike-kits-3.jpg"
    },
    {
        name: "Camiseta Francia",
        price: 5,
        thumbnail: "http://cdn.shopify.com/s/files/1/0567/6639/8509/products/fwrwg_1200x1200.jpg?v=1658523444"
    }
] */

/* const batch = async () => {
	try {
        await knexMariaDB.schema.hasTable('desafioSQL').then(function(exists) {
            if (!exists) {
                console.log('tabla creada')
            return knexMariaDB.schema.createTable('desafioSQL', table => {
                table.increments("id")
                table.string("name")
                table.integer("price")
                table.string("thumbnail")
            });
            }
        })
		await knexMariaDB('desafioSQL').insert(item)
        console.log(`productos agregados`)
	} catch (error) {
		console.log(`error tabla ${error}`)
	}
}
//batch() */

/////////////////////// PROFILE //////////////////////////////

routerProductos.get("/profile", async (req, res) => {
    const login = req.session;

    res.render("pages/profile.ejs",{
        email: login.passport.user
    });
});

//////////////////////////////////////////////////////////////

////////////////////// CATALOGO //////////////////////////////

routerProductos.get("", async (req, res) => {
    const login = req.session;
    //console.log(`se logueo ${login.passport.user}`);
    const producto = await productoDao.getAll();

    res.render("pages/index.ejs", {
        listaProductos: producto,
        email: login.passport.user,
    });
});

routerProductos.get("/:id", async (req, res) => {
    const idReq = req.params.id;
    const productoId = await productoDao.getById(idReq); //consultar que hace el +
    res.json(productoId);
});
routerProductos.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updateProduct = req.body;
    await productoDao.updateById(id, updateProduct);

    res.json({
        producto: updateProduct,
    });
});
routerProductos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await productoDao.deleteById(id);

    res.json({
        msg: "se borro el producto",
    });
});
routerProductos.delete("/", async (req, res) => {
    const { id } = req.params;
    await productoDao.deleteAll(id);

    res.json({
        msg: "se borraron todos los productos",
    });
});

/////////////////////////////////////////////////////

////////////// CARRITO ////////////////////////////

routerCarrito.post('/', async (req, res) => {
    const login = req.session;
    let timestamp = Date.now();
    const producto = await productoDao.getById(req.body.productId);
    const carrito = await carritoDao.getByEmail(login.passport.user);

    if(carrito == null) {
        let cart = {
            timestamp,
            products: [producto],
            userEmail: login.passport.user
        }          
        let newCarrito = await carritoDao.save(cart);
    } else {
        carrito.products.push(producto);
        await carritoDao.updateById(carrito);
    }

    res.json({
        msg: 'se agrego el producto al carrito' 
    });
})
routerCarrito.delete('/:id', async (req, res) => {
    const { id } = req.params;
    //con archivo
    //await carrito.deleteById(parseInt(id))
    //con mongo o firebase
    await carritoDao.deleteById(id);
    res.json({
        msg: 'se borro el producto del carrito' 
    });  
});

routerCarrito.get('/', async (req,  res) => {
    const login = req.session;
    const carrito = await carritoDao.getByEmail(login.passport.user);
    
    res.render("pages/cart.ejs", {
        login: login.passport.user,
        Products: carrito.products
    });
})

/////////////////////////////////////////////////////////////////////

////////////////////////////// REGISTRO Y LOGIN //////////////////////

routerUsuarios.get("/registro", (req, res) => {
    res.render("pages/register.ejs");
});
routerUsuarios.post(
    "/registro",
    /* upload.single('myFile'), */
    async (req, res, next) => {
        let { email, password, name, age, avatar, address } = req.body;
        let user = await usuario.getByEmail(email);
        /* const {file} = req */
        if (user) {
            res.status(400);
            res.json();
        } else {
            await usuario.save({
                email,
                password: createHash(password),
                name,
                age,
                avatar,
                address,
            });
            /* res.send(file) */
            next()
        }
    }, 
    
    passport.authenticate("login", {
        successRedirect: "/api/productos",
        failWithError: true,
    }),
    (req, res) => {
        res.json("Bienvenido usuario");
    }
);

routerUsuarios.get("/registro/error", (req, res) => {
    res.render("pages/failRegister.ejs");
});

routerUsuarios.get("/login", (req, res) => {
    res.render("pages/login.ejs");
});
routerUsuarios.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/api/productos",
        failWithError: true,
    }),
    (req, res) => {
        res.json("Bienvenido usuario");
    }
);
routerUsuarios.get("/login/error", (req, res) => {
    res.render("pages/failLogin.ejs");
});
routerUsuarios.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
    if (err) {
        return console.log(err);
    }
    });
    res.render("pages/logout.ejs", {
        username: null,
    });
});
////////////////////////////////////////////////////////////////

////////////////////////////// INFO //////////////////////

app.get("/info", (req, res) => {
    try {
        const information = {
        cwd: process.cwd(),
        pid: process.pid,
        ppid: process.ppid,
        version: process.version,
        title: process.title,
        platform: process.platform,
        memoryUsage: process.memoryUsage().rss,
        execPath: process.execPath,
        execArgv: process.execArgv,
        numCPUs: numCPUs,
        cpuUsage: JSON.stringify(process.cpuUsage()),
        };
        res.render("pages/info.ejs", {
            cwd: information.cwd,
            pid: information.pid,
            ppid: information.ppid,
            version: information.version,
            title: information.title,
            platform: information.platform,
            memoryUsage: information.memoryUsage,
            execPath: information.execPath,
            execArgv: information.execArgv,
            numCPUs: information.numCPUs,
            cpuUsage: information.cpuUsage,
        });
    } catch (err) {
        logger.error(err);
    }
});

app.get("/infogzip", compression(), (req, res) => {
    try {
        const information = {
            cwd: process.cwd(),
            pid: process.pid,
            ppid: process.ppid,
            version: process.version,
            title: process.title,
            platform: process.platform,
            memoryUsage: process.memoryUsage().rss,
            execPath: process.execPath,
            execArgv: process.execArgv,
            numCPUs: numCPUs,
            cpuUsage: JSON.stringify(process.cpuUsage()),
        };
        res.render("pages/infogzip.ejs", {
            cwd: information.cwd,
            pid: information.pid,
            ppid: information.ppid,
            version: information.version,
            title: information.title,
            platform: information.platform,
            memoryUsage: information.memoryUsage,
            execPath: information.execPath,
            execArgv: information.execArgv,
            numCPUs: information.numCPUs,
            cpuUsage: information.cpuUsage,
        });
    } catch (err) {
        logger.error(err);
    }
});

////////////////////////////////////////////////////////////////

//////////////////// RANDOM ///////////////////////////////////

routerRandom.get("/", (req, res) => {
    try {
            let cant =
            req.query.cant !== undefined ? parseInt(req.query.cant) : 100000000;
            const computo = fork("./random.js");
            computo.send(cant);
            logger.error(`error`);
            computo.on("message", (mensaje) => {
                res.end(mensaje);
        });
    } catch (err) {
        logger.error(`error aca ${err}`);
    }
});

////////////////////////////////////////////////////////////////

///////////////////// PASSPORT ////////////////////////////////
passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
    async (req, email, password, done) => {
        let user = await usuario.getByEmail(email);
        if (!user) {
            console.log(`No existe el usuario ${email}`);
            return done(null, false);
        }
        if (!isValidPassword(user, password)) {
            console.log("Password Incorrecto");
            return done(null, false);
        }
        done(null, user);
    })
);

/////////////////////////////////

/*const comments = [
	{
		mensaje: "Hola Mundo"
	},
	{
		mensaje: "probando"
	}
]


const batchSqlite3 = async () => {
	try {
        await knexSqlLite.schema.hasTable('comentariosSQL').then(function(exists) {
            if (!exists) {
                console.log('tabla creada')
            return knexSqlLite.schema.createTable('comentariosSQL', table => {
                table.increments("id");
                table.string("mensaje");
            });
            }
        })
		await knexSqlLite('comentariosSQL').insert(comments)
        console.log(`comentario agregado`)
	} catch (error) {
		console.log(`error tabla ${error}`)
	}
};

batchSqlite3() */

////////////////// WEB SOCKET /////////////////////
let messages = [];

io.on("connection", async (socket) => {
  /////// chat ////////////////
    const mensaje = {
        m: "ok",
        messages,
    };

    console.log("User connected", socket.id);

    socket.on("mensaje-nuevo", async (data) => {
        //para sql lit
        //await containerLite.save(data)
        await comentario.save(data);
        messages.push(data);
        io.sockets.emit("mensaje-servidor", messages);
    });
  //////// catalogo //////////////

    socket.on("mensaje-nuevo-producto", async (data) => {
        await productoDao.save(data);
        io.sockets.emit("mensaje-servidor-nuevo-producto", data);
    });

  /////// email ///////////////
    socket.on("mensaje-email", (data) => {
        console.log("el email es", data);
    });
});

/////////////////////////////    EJS        ////////////////////////
//configuracion del ejs
app.set("view engine", "ejs");
app.set("views", "./views");

/* routerProductos.get('', async (req, res) => {
    const producto = await contenedor.getAll()
    res.render('pages/index.ejs', { 
        listaProductos: producto
    })
})



routerProductos.post('/nuevoProducto', async (req, res) => {
    await contenedor.save(req.body)
    const ultimoProducto = await contenedor.getLastId()
    res.render('pages/nuevoProducto.ejs', {
        nuevoProducto: ultimoProducto   
    })
}) */

///////////////// Productos ////////////

/* routerProductos.get('/', async (req,  res) => {
    try{
        const allProducts = await producto.getAll() 
        res.json(allProducts)
    }
    catch(err){
        console.log(err)
    }
})

routerProductos.get('/:id', async (req, res)=> {
    const idReq = req.params.id
    //con archivo
    //const productoId = await producto.getById(+idReq)
    //con mongo y firebase
    const productoId = await producto.getById(idReq)
    res.json(productoId);
})


routerProductos.post('/', async (req, res) => {
    //console.log('el req', req.body)
    const {name, price, thumbnail} = req.body
    let newProduct = {name, price, thumbnail}
    await producto.save(newProduct) 
    res.json({
        producto: newProduct 
    })
})
routerProductos.put('/:id', async (req, res, ) => {
    const { id } = req.params
    const  {name, price, thumbnail} = req.body
    let updateProduct = {name, price, thumbnail}
    //con archivo
    //await producto.updateById({id: parseInt(id), ...updateProduct})
    //con mongo y firebase
    await producto.updateById({id:(id), ...updateProduct})
    res.json({
        producto: updateProduct
    })       
})

routerProductos.delete('/:id', async (req, res) => {
    const { id } = req.params
    //para firebase y mongo
    await producto.deleteById(id)
    //archivo
    //await producto.deleteById(parseInt(id))
    res.json({
        msg: 'se borro el producto' 
    })  
}) */


////////// Routes
app.use("/api/productos", checkAuth, routerProductos);
app.use("/api/usuarios", routerUsuarios);
app.use("/api/carrito", checkAuth, routerCarrito);
app.use("/api/productos-test", routerProductosTest);
app.use("/api/random", routerRandom);
app.use((req, res, next) => {
    logger.warn("URL requested does not exist");
    res.sendStatus("404");
});

const server = httpServer.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
});

server.on("error", (err) => {
    console.log(err);
    logger.error("no conecto con el puerto");
});

/* httpServer.listen(PORT, (err) => {
    if(err) throw Error(`Error on server listen: ${err}`)
    console.log(`Server is running on port: ${PORT}`)
}) */

//////////// productosRandom /////////

/* routerProductosRandom.get('/', async (req, res) => {
    const cantidad = await contenedor.getLenght();
    const random =  Math.floor(Math.random() * cantidad ) + 1 ;
    const productRandom = await contenedor.getById(random);
    res.json(productRandom);
})

app.use('/api/productosRandom', routerProductosRandom)  */

//////////////////////////////////////////////

/* contenedor.save({ 
    name:'Remera 3', 
    price: 100, 
    thumbnail: "Ropa"
}) */
//contenedor.getById(3)
//contenedor.getAll()

//contenedor.delete(4)

//contenedor.deleteAll()

//////////////////////////////    HANDLEBARS  ////////////////////////
/* const handlebars = require('express-handlebars')

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/pages',
        partialsDir: __dirname + '/views/partials'
        
    })
)

app.set('view engine', 'hbs')
app.set('views', './views')


routerProductos.get('/', async (req, res) => {
    const producto = await contenedor.getAll();
    const listExist = producto.length > 0
    res.render('partials/main', {
        producto: true, 
        list: producto,
        listExist
    })
})
routerProductos.post('/nuevoProducto', async (req, res) => {
    await contenedor.save(req.body)
    const ultimoProducto = await contenedor.getLastId()
    res.render('pages/nuevoProducto.pug', {
        nuevoProducto: ultimoProducto
    })
}) */

/////////////////////////////    PUG         ////////////////////////
//config del pug
/* app.set('view engine', 'pug')
app.set('views', './views')

app.get('/', (req, res) => {
    res.render('index.pug', {mensaje: 'Hola Pug'})
})

routerProductos.get('/', async (req, res) => {
    const producto = await contenedor.getAll()
    const hayP = producto.length > 0
    res.render('pages/index.pug', { 
        listaProductos: producto, 
                        hayP
    })
})
routerProductos.post('/nuevoProducto', async (req, res) => {
    await contenedor.save(req.body)
    const ultimoProducto = await contenedor.getLastId()
    res.render('pages/nuevoProducto.pug', {
        nuevoProducto: ultimoProducto
    })
}) */