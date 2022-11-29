const { ContenedorFirebase } = require("../../contenedores/contenedorFirebase");

class CarritoDaoFirebase extends ContenedorFirebase {
	constructor() {
		super("carts");
	}
}

module.exports.CarritoDaoFirebase = CarritoDaoFirebase;