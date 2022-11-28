const mongoose = require("mongoose")

const {ContenedorMongoDB} = require("../../contenedores/contenedorMongoDB")
const { connectMongoDB } = require("../../config/mongoDB.js")



const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
	userEmail: { 
        type: String,
        require: true 
    },
	products: { 
        type: Array, 
        require: true 
    }
})

const carts = mongoose.model(cartsCollection, cartsSchema)

class CarritoDaoMongoDB extends ContenedorMongoDB {
	constructor() {
		super(connectMongoDB, carts)
	}
    async getByEmail(email) {
		try {
			let datos = await this.modelo.findOne({ userEmail: email })
			return datos
		} catch (error) {
			return `No se pudo traer el carrito del usuario ${email}. ${error}`
		}
	}
}

module.exports.CarritoDaoMongoDB = CarritoDaoMongoDB