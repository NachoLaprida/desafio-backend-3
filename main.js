const express = require('express')
const {Comentario} = require("./comentario")
const {ContenedorArchivo} = require("./contenedores/contenedorArchivo")
const {Router} = express
const routerProductos = Router()
const routerCarrito = Router()
const routerProductosTest = Router()
const routerProductosRandom = Router()
const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')
const PORT = process.env.PORT || 8080
const {faker} = require('@faker-js/faker')
const {generateProducts} = require('./utils/generadorDeProductos')
faker.locale = 'es'
const fs = require('fs')
const normalizr = require('normalizr')
const {normalize, denormalize, schema } = normalizr
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


const resultBuffer = fs.readFileSync('./txt/comentarios.txt');
const originalComments = JSON.parse(resultBuffer.toString().trim());


//Definir los esquemas
const authorSchema = new schema.Entity('author')
const messageSchema = new schema.Entity('message')

const finalSchema = [
	{
		author: authorSchema,
		message: messageSchema
	}
]


// ---------------------- Datos Originales ----------------
const msj = originalComments
console.log('original ',(JSON.stringify(msj).length))
//591
// ---------------------- Datos Normalizado ----------------
const normalizedComments = normalize(msj, finalSchema)
console.log('normalizado ',(JSON.stringify(normalizedComments).length))
//498

// ---------------------- Datos Denormalizado ----------------
const denormalizedComments = denormalize(normalizedComments, finalSchema, normalizedComments.entities)
console.log('denormalizado ',(JSON.stringify(denormalizedComments).length))
//498


//desafio faker consigna 1
routerProductosTest.get('/', (req, res) => {
        const productos = generateProducts(5) 
        res.render('pages/index.ejs', { 
            listaProductos: productos,
        })
})


//const CarritoDaoArchivo = require("./daos/carritos/carritoDaoArchivo")
//const {CarritoDaoMongoDB} = require("./daos/carritos/carritoDaoMongoDB")
//const {CarritoDaoFirebase} = require("./daos/carritos/carritoDaoFirebase")

//const ProductoDaoArchivo = require("./daos/productos/ProductoDaoArchivo")
//const {ProductosDaoMongoDB} = require("./daos/productos/ProductoDaoMongoDB")
//const {ProductosDaoFirebase} = require("./daos/productos/productoDaoFirebase")

/* const producto = new ProductoDaoArchivo('./txt/ecommerce.txt')
const carrito = new CarritoDaoArchivo('./txt/carrito.txt') */

/* const producto = new ProductosDaoMongoDB()
const carrito = new CarritoDaoMongoDB() */

/* const producto = new ProductosDaoFirebase()
const carrito = new CarritoDaoFirebase() */

const contenedor = new ContenedorArchivo('./txt/ecommerce.txt')
const comentario = new Comentario('./txt/comentarios.txt')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

/////desafio base de datos
const { optionsMariaDB } = require('./config/mariaDB')
const { optionsSQLlite } = require('./config/conexionSQLITEDB')
const knexMariaDB = require('knex')(optionsMariaDB)
const knexSqlLite = require('knex')(optionsSQLlite)
const {Container} = require('./contenedores/containerSQLDB')
const container = new Container(knexMariaDB, 'desafioSQL')
const containerLite = new Container(knexSqlLite, 'comentariosSQL')


//mongo atlas
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true,
    //mongo atlas
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://Nacholi:parlamento88@cluster0.8viuxhq.mongodb.net/?retryWrites=true&w=majority', mongoOptions: mongoConfig}),
    cookie: {
        maxAge: 60000
    }
    
}))

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

routerProductos.get('', async (req, res) => {
    const login = req.session
    console.log(`se logueo ${login.username}`)
    /* if (login.username && login.password){
        res.write(`<h1>Bievenido ${login.username}</h1><br>`)
        res.end("<a href=" + "/logout" + ">Cerrar Sesion</a >")
    } else{
        console.log('no te logueaste')
    } */

    const producto = await contenedor.getAll()
    res.render('pages/index.ejs', { 
        listaProductos: producto,
        username: login.username
    })
})
routerProductos.get('/logout', async (req, res) => {
    const producto = await contenedor.getAll()
    req.session.destroy(err => {
		if (err) {
			return console.log(err)
		}
	})
    res.render('pages/index.ejs', { 
        listaProductos: producto,
        username: null
    })
})

routerProductos.get('/:id', async (req, res)=> {
    const idReq = req.params.id
    const productoId = await container.getById(+idReq); //consultar que hace el +
    res.json(productoId);
})
routerProductos.post('', async(req, res) => {
    const login = req.session
    const {username, password} = req.body
    login.username = username
    login.password = password
    console.log(`seooo logueo ${login.password}`)
    

    const newProduct  = req.body
    await container.save(newProduct) 
    res.json({
        producto: newProduct 
    })
})
routerProductos.put('/:id', async (req, res, ) => {
    const { id } = req.params
    const  updateProduct = req.body
    await container.updateById( id, updateProduct)
    res.json({
        producto: updateProduct
    })       
})
routerProductos.delete('/:id', async (req, res) => {
    const { id } = req.params
    await container.deleteById(id)
    res.json({
        msg: 'se borro el producto' 
    })  
})
routerProductos.delete('/', async (req, res) => {
    const { id } = req.params
    await container.deleteAll(id)
    res.json({
        msg: 'se borraron todos los productos' 
    })  
})

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
let messages = []

io.on('connection', async (socket) => {
    /////// chat ////////////////
    const mensaje = {
        m: 'ok',
        messages
    }
    
    console.log('User connected', socket.id)
    
    socket.on('mensaje-nuevo', async (data) => {
        //para sql lit
        //await containerLite.save(data)
        await comentario.save(data)
        messages.push(data)
        io.sockets.emit('mensaje-servidor', messages)
    })
    //////// catalogo //////////////

    socket.on('mensaje-nuevo-producto', async (data) => {
        await contenedor.save(data)
        io.sockets.emit('mensaje-servidor-nuevo-producto', data)
    })

    /////// email ///////////////
    socket.on('mensaje-email', (data) => {
        console.log('el email es',data)
    })

}) |




/////////////////////////////    EJS        ////////////////////////
//configuracion del ejs
app.set('view engine', 'ejs')
app.set('views', './views')


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
})

////////////// Carrito ////////////////////////////





routerCarrito.post('/', async (req, res) => {
    let timestamp = Date.now()
        let cart = {
            timestamp,
            products: [],
        }          
    let newCarrito = await carrito.save(cart)

    res.json({
        carrito: newCarrito 
    })
})
routerCarrito.delete('/:id', async (req, res) => {
    const { id } = req.params
    //con archivo
    //await carrito.deleteById(parseInt(id))
    //con mongo o firebase
    await carrito.deleteById(id)
    res.json({
        msg: 'se borro el producto del carrito' 
    })  
})

routerCarrito.get('/:id/productos', async (req,  res) => {
    try{
        const { id } = req.params
        const cart = await carrito.getById(id)
        res.json(cart.products)
    }
    catch(err){
        console.log(err)
    }
}) */

/* routerCarrito.post('/:id/productos', async (req, res) => {
    const cart = await carrito.getById(id)
    cart.products.push()
    await carrito.save()
    res.json(cart.products)
}) */

/* routerCarrito.delete(':id/productos/:id_prod', async (req, res) => {
    try{

        res.json({

        })
    }
    catch(err){
        console.log(err)
    }
}) */

////////// Routes
app.use('/api/productos', routerProductos) 
app.use('/api/carrito', routerCarrito) 
app.use('/api/productos-test', routerProductosTest)








const server = httpServer.listen(PORT, () => {
    console.log(`Escuchando el puerto ${server.address().port}`)
})

server.on('error', (err) => {
    console.log(err)
})


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