const express = require('express')
const Contenedor = require("./contenedor");
const {Router} = express
const routerProductos = Router()
const routerProductosRandom = Router()

const contenedor = new Contenedor('./prueba.txt')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public/index.html'))




/* contenedor.save({ 
    name:'Remera 3', 
    price: 100, 
    thumbnail: "Ropa", 
    description:'Remera blanca'
}) */
//contenedor.getById(3)
//contenedor.getAll()

//contenedor.delete(4)

//contenedor.deleteAll()

//configuracion del ejs
app.set('view engine', 'ejs')
app.set('views', './views')


/* let productos = []
routerProductos.get('/', (req, res) => {
    
    res.render('pages/index.ejs', {
        mensaje: 'Hola ejs',
        productos: productos   
    })
})

routerProductos.post('/', async (req, res) => {
    try{
        const obj = req.body
        console.log(obj)
        await productos.push(obj)
        res.render('pages/index', {
            mensaje: 'Hola ejs',
            productos: productos   
        })
    }
    catch(err){
        console.log(err)
    }
}) */

/* routerProductos.get('/', (req, res) => {  
    res.render('pages/creador.ejs', {
        titulo: "Subir productos Adidas",
        nav:"creador"})
    })

app.post('/creador', async (req, res) => {
    const producto = await contenedor.save(req.body);
    const creado =  producto != -1
    console.log(producto)
    res.render('pages/creadorConfirmar.ejs', {     
        hayProducto: creado,
        titulo: 'Creacion de producto'
    })
}) */

routerProductos.get('/', async (req, res) => {
    const producto = await contenedor.getAll();
    res.render('pages/index.ejs', { 
        listaProductos: producto
    })
})
routerProductos.post('/', async (req, res) => {
    await contenedor.save(req.body)
    const producto = await contenedor.getAll()
    
    res.render('pages/index.ejs', {
        listaProductos: producto   /* puede ir tambien solo productos porque js lo admite */
    })
})

app.get('/', (req, res) => {
    res.json('Buenos dias')
})

///////////////// productos ////////////

/* routerProductos.get('/', async (req,  res) => {
    try{
        const allProducts = await contenedor.getAll() 
        res.json(allProducts)
    }
    catch(err){
        console.log(err)
    }
}) */

/* routerProductos.get('/:id', async (req, res)=> {
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
}) */

app.use('/api/productos', routerProductos) 


//////////// productosRandom /////////

routerProductosRandom.get('/', async (req, res) => {
    const cantidad = await contenedor.getLenght();
    const random =  Math.floor(Math.random() * cantidad ) + 1 ;
    const productRandom = await contenedor.getById(random);
    res.json(productRandom);
})

app.use('/api/productosRandom', routerProductosRandom) 



const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${server.address().port}`)
})

server.on('error', (err) => {
    console.log(err)
})


