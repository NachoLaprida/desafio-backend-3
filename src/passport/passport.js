const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UsuarioDaoMongoDB = require("../daos/usuarios/usuariosDaoMongoDB");
const usuario = new UsuarioDaoMongoDB();
const { isValidPassword } = require("../utils/checkAuth");

const configurePassport = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    /////////////////////// passport serialize /////////////
    passport.serializeUser((user, done) => {
    done(null, user.email);
    });

    passport.deserializeUser(async (email, done) => {
        let user = await usuario.getByEmail(email);
        done(null, user);
    });
}

const usePassport = () => {
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
}

module.exports = { configurePassport, usePassport }

