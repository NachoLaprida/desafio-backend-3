//////////////////// RANDOM ///////////////////////////////////

routerRandom.get("/", (req, res) => {
    try {
            let cant =
            req.query.cant !== undefined ? parseInt(req.query.cant) : 100000000;
            const computo = fork("./random.js");
            computo.send(cant);
            logger.error(`error`);
            computo.on("message", (mensaje) => {
                res.end(mensaje);
        });
    } catch (err) {
        logger.error(`error aca ${err}`);
    }
});