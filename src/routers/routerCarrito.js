const express = require("express")
const {Router} = express
const routerCarrito = new Router

const {ProductosDaoMongoDB} = require("../daos/productos/productoDaoMongoDB")
const {CarritoDaoMongoDB} = require("../daos/carritos/carritoDaoMongoDB")

const productoDao = new ProductosDaoMongoDB()
const carritoDao = new CarritoDaoMongoDB()


routerCarrito.post('/', async (req, res) => {
    const login = req.session;
    let timestamp = Date.now();
    const producto = await productoDao.getById(req.body.productId);
    const carrito = await carritoDao.getByEmail(login.passport.user);
    console.log(req.body.productId)
    console.log(producto)
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

module.exports = routerCarrito