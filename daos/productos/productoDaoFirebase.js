const { ContenedorFirebase } = require("../../contenedores/contenedorFirebase");

class ProductosDaoFirebase extends ContenedorFirebase {
	constructor() {
		super("productos");
	}
}

module.exports.ProductosDaoFirebase = ProductosDaoFirebase