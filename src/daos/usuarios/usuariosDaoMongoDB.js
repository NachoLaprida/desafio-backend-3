
const {ContenedorMongoDB} = require("../../contenedores/contenedorMongoDB")
const mongoose = require("mongoose")
const { connectMongoDB } = require("../../config/mongoDB.js")

const usersCollections = "users"

const usersSchema = new mongoose.Schema({
	email: { type: String, require: true, unique: true },
	password: { type: String, require: true },
	name: { type: String, require: true },
	age: { type: Number, require: true },
	address: { type: String, require: true },
	avatar: { type: String, require: true },
})

const users = mongoose.model(usersCollections, usersSchema);

class UsersDaoMongoDB extends ContenedorMongoDB {
	constructor() {
		super(connectMongoDB, users)
	}
	async getByEmail(email) {
		try {
			let datos = await this.modelo.findOne({ email: email })
			console.log(datos)
			return datos
		} catch (error) {
			return `No se pudo traer el usuario ${email}. ${error}`
		}
	}
}


module.exports = UsersDaoMongoDB