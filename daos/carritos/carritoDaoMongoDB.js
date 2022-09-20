const mongoose = require("mongoose")

const {ContenedorMongoDB} = require("../../contenedores/contenedorMongoDB")
const { connectMongoDB } = require("../../config/mongoDB.js")



const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
	name: { 
        type: String,
        require: true 
    },
	thumbnail: { 
        type: String, 
        require: true 
    },
	price: { 
        type: Number, 
        require: true 
    }
})

const carts = mongoose.model(cartsCollection, cartsSchema)

class CarritoDaoMongoDB extends ContenedorMongoDB {
	constructor() {
		super(connectMongoDB, carts)
	}
}

module.exports.CarritoDaoMongoDB = CarritoDaoMongoDB