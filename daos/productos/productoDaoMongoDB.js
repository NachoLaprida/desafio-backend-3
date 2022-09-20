
const {ContenedorMongoDB} = require("../../contenedores/contenedorMongoDB.js");
const mongoose = require("mongoose");
const { connectMongoDB } = require("../../config/mongoDB.js")

const productosCollection = "productos";

const ProductosSchema = new mongoose.Schema({
	name: { type: String, require: true },
	thumbnail: { type: String, require: true },
	price: { type: Number, require: true }
})

const productos = mongoose.model(productosCollection, ProductosSchema);

class ProductosDaoMongoDB extends ContenedorMongoDB {
	constructor() {
		super(connectMongoDB, productos);
	}
}

module.exports.ProductosDaoMongoDB = ProductosDaoMongoDB;