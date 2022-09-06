const express = require('express')
const {Contenedor} = require("./contenedor");
const {Comentario} = require("./comentario");
const {Carrito} = require("./carrito");
const {Router} = express
const routerProductos = Router()
const routerCarrito = Router()
const routerProductosRandom = Router()
const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io');
const PORT = process.env.PORT || 8080

/////desafio base de datos
const { options } = require('./mariaDB/conexionDB')
//const { options } = require('./sqllite3/conexionDB')
const knexMariaDB = require('knex')(options)
const {Container} = require('./containerDB')
const container = new Container(knexMariaDB, 'desafioSQL')

const contenedor = new Contenedor('./ecommerce.txt')
const comentario = new Comentario('./comentarios.txt')
const carrito = new Carrito('./carrito.txt')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


///// desafio base de datos
const item = [
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
]

const batch = async () => {
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
batch()

routerProductos.get('', async (req, res) => {
    const producto = await contenedor.getAll()
    res.render('pages/index.ejs', { 
        listaProductos: producto
    })
})
routerProductos.get('/:id', async (req, res)=> {
    const idReq = req.params.id
    const productoId = await container.getById(+idReq); //consultar que hace el +
    res.json(productoId);
})
routerProductos.post('', async(req, res) => {
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
        await comentario.save(data)
        messages.push(data)
        const mensaje = {
            m: 'texto agregado',
            messages
        }
        io.sockets.emit('mensaje-servidor', mensaje)
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
        const allProducts = await contenedor.getAll() 
        res.json(allProducts)
    }
    catch(err){
        console.log(err)
    }
})

routerProductos.get('/:id', async (req, res)=> {
    const idReq = req.params.id
    console.log('idReq', )
    const productoId = await contenedor.getById(+idReq); //consultar que hace el +
    res.json(productoId);
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
}) */

////////////// Carrito ////////////////////////////





routerCarrito.post('/', async (req, res) => {
    let newCarrito = await carrito.createCart()
    res.json({
        carrito: newCarrito 
    })
})
routerCarrito.delete('/:id', async (req, res) => {
    const { id } = req.params
    await carrito.delete(parseInt(id))
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
})

/* routerCarrito.post('/:id/productos', async (req, res) => {
    const cart = await carrito.getById(id)
    cart.products.push()
    console.log(cart)
    res.json({
        
    })
}) */

////////// Routes
app.use('/api/productos', routerProductos) 
app.use('/api/carrito', routerCarrito) 








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