const express = require("express");
const { Router } = express;
require("dotenv").config();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const PORT = process.env.PORT; //process.argv[2] || 8080 lo cambie para heroku
const { checkAuth, isValidPassword } = require("./src/utils/checkAuth");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const {configurePassport, usePassport} = require('./src/passport/passport')

const { generateProducts } = require("./src/utils/generadorDeProductos");
const routerProductosTest = Router();
const routerRandom = Router();
console.log(PORT);
const { faker } = require("@faker-js/faker");
faker.locale = "es";
const fs = require("fs");
const normalizr = require("normalizr");
const { normalize, denormalize, schema } = normalizr;
const { fork } = require("child_process");
const logger = require("./src/logs/log4js");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//configuracion del ejs
app.set("view engine", "ejs");
app.set("views", "./src/views");


//config mongo atlas
const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const resultBuffer = fs.readFileSync("./src/txt/comentarios.txt");
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





const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const { Comentario } = require("./src/contenedores/comentario");
const comentario = new Comentario("./src/txt/comentarios.txt");
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


configurePassport(app)
usePassport()

const Users = [];


const routerInfo = require('./src/routers/routerInfo.js')
const routerUsuarios = require('./src/routers/routerRegistro-Login.js')
const routerProductos = require('./src/routers/routerIndex')
const routerCarrito = require('./src/routers/routerCarrito')
////////// Routes
app.use("/api/info", routerInfo)
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

//////////////////////////////////////////////

