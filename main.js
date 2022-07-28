const express = require('express')
const Contenedor = require("./contenedor");

const contenedor = new Contenedor('./prueba.txt')
const app = express()

/* contenedor.save({ 
    name:'Remera 3', 
    price: 100, 
    category: "Ropa", 
    description:'Remera blanca'
}) */

app.get('/', (req, res) => {
    res.send('Buenos dias')
})

app.get('/productos', async (req,  res) => {
    const allProducts = await contenedor.getAll() 
    res.send(allProducts)
})

app.get('/productosRandom', async (req, res) => {
    const cantidad = await contenedor.getLenght();
    const random =  Math.floor(Math.random() * cantidad ) + 1 ;
    const productRandom = await contenedor.getById(random);
    res.send(productRandom);
})

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${server.address().port}`)
})

server.on('error', (err) => {
    console.log(err)
})


//contenedor.getById(3)
//contenedor.getAll()

//contenedor.delete(4)

//contenedor.deleteAll()