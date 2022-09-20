const { ContenedorArchivo } = require("../../contenedores/contenedorArchivo");

class ProductoDaoArchivo extends ContenedorArchivo {
	constructor() {
		super("../../txt/ecommerce.txt");
	}

	
}

module.exports = ProductoDaoArchivo;