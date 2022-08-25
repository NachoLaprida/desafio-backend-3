const express = require('express')
const Contenedor = require("./contenedor");
const Comentario = require("./contenedor");
const {Router} = express
const routerProductos = Router()
const routerProductosRandom = Router()
const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io');
const { ok } = require('assert');
const PORT = process.env.PORT || 8080

const contenedor = new Contenedor('./prueba.txt')
const comentario = new Comentario('./comentarios.txt')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)



////////////////// WEB SOCKET /////////////////////
let messages = []

io.on('connection', async (socket) => {
    /*const comment = await comentario.getAll()
    socket.emit('mensaje-servidor', {
        m: "ok",
        comentarios: comment
    })
    console.log(comment)
    socket.on('mensaje-nuevo', async (req, res) => {
        await comment.save(req.body) 
        const comment = {
            m:"comentario agregado",
            comentario: comment
        }
    })
    io.sockets.emit('mensaje-servidor', comment) */

    const mensaje = {
        m: 'ok',
        messages
    }
    
    console.log('User connected', socket.id)
    
    socket.on('mensaje-nuevo', async (data) => {
        await comentario.save(data)
        messages.push(data)
        const mensaje = {
            m: 'texto agregado',
            messages
        }
        io.sockets.emit('mensaje-servidor', mensaje)
    })
    //console.log(mensaje)

    socket.on('mensaje-nuevo-producto', async (data) => {
        await contenedor.save(data)
        io.sockets.emit('mensaje-servidor-nuevo-producto', data)
    })
    socket.on('mensaje-email', (data) => {
        console.log('el email es',data)
    })

}) 

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


/////////////////////////////    EJS        ////////////////////////
//configuracion del ejs
app.set('view engine', 'ejs')
app.set('views', './views')


routerProductos.get('', async (req, res) => {
    const producto = await contenedor.getAll();
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
})


//////////////////////////////////////////////////////////////////

/* app.get('/', (req, res) => {
    res.json('Buenos dias')
}) */

///////////////// productos ////////////

routerProductos.get('/', async (req,  res) => {
    try{
        const allProducts = await contenedor.getAll() 
        res.json(allProducts)
    }
    catch(err){
        console.log(err)
    }
})

routerProductos.get('/:id', async (req, res)=> {
    const idReq = req.params.id
    //console.log('idReq', idReq)
    const produtoId = await contenedor.getById(+idReq); //consultar que hace el +
    res.json(produtoId);
})


routerProductos.post('/', async (req, res) => {
    //console.log('el req', req.body)
    const {name, price, thumbnail} = req.body
    let newProduct = {name, price, thumbnail}
    await contenedor.save(newProduct) 
    res.json({
        producto: newProduct 
    })
})
routerProductos.put('/:id', async (req, res, ) => {
    const { id } = req.params
    const  {name, price, thumbnail} = req.body
    let updateProduct = {name, price, thumbnail}
    await contenedor.updateById({id: parseInt(id), ...updateProduct})
    res.json({
        producto: updateProduct
    })       
})

routerProductos.delete('/:id', async (req, res) => {
    const { id } = req.params
    await contenedor.delete(parseInt(id))
    res.json({
        msg: 'se borro el producto' 
    })  
})

app.use('/api/productos', routerProductos) 


//////////// productosRandom /////////

/* routerProductosRandom.get('/', async (req, res) => {
    const cantidad = await contenedor.getLenght();
    const random =  Math.floor(Math.random() * cantidad ) + 1 ;
    const productRandom = await contenedor.getById(random);
    res.json(productRandom);
})

app.use('/api/productosRandom', routerProductosRandom)  */





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