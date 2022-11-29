const express = require("express")
const {Router} = express
const routerUsuarios = new Router
const { createHash } = require("../utils/checkAuth");
const passport = require("passport");

const UsuarioDaoMongoDB = require("../daos/usuarios/usuariosDaoMongoDB");
const usuario = new UsuarioDaoMongoDB();

routerUsuarios.get("/registro", (req, res) => {
    res.render("pages/register.ejs");
});

routerUsuarios.post(
    "/registro",
    
    async (req, res, next) => {
        let { email, password, name, age, avatar, address } = req.body;
        let user = await usuario.getByEmail(email);
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

module.exports = routerUsuarios

