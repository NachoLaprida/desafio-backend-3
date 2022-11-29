const express = require("express")
const {Router} = express
const routerProductos = new Router

const {ProductosDaoMongoDB} = require("../daos/productos/productoDaoMongoDB")
const productoDao = new ProductosDaoMongoDB()





routerProductos.get("", async (req, res) => {
    const login = req.session;
    const producto = await productoDao.getAll();
    res.render("pages/index.ejs", {
        listaProductos: producto,
        email: login.passport.user,
    });
});

routerProductos.get("/:id", async (req, res) => {
    const idReq = req.params.id;
    const productoId = await productoDao.getById(idReq);
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

routerProductos.get("/profile", async (req, res) => {
    const login = req.session;

    res.render("pages/profile.ejs",{
        email: login.passport.user
    });
});



module.exports = routerProductos