const {faker} = require('@faker-js/faker')

class Producto {
	constructor(id, title, price, thumbnail) {
		this.id = id
		this.title = title
		this.price = price
		this.thumbnail = thumbnail
	}
}

generadorProductos = () => {
	const productos = [];
	for (let i = 0; i < 5; i++) {
		const producto = new Producto(
			
		)
		productos.push(producto)
	}
	return productos;
}

module.exports = { generadorProductos }