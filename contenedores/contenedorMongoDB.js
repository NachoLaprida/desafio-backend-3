const mongoose = require("mongoose")

class ContenedorMongoDB {
	constructor(connexion, modelo) {
		this.modelo = modelo
		connexion()
	}
	async save(obj) {
		try {
			let guardar = await new this.modelo(obj).save()
			return guardar._id.toString()
		} catch (error) {
			console.log(`error al guardar: ${error}`)
		}
	}
	async getById(id) {
		try {
			let datos = await this.modelo.findOne({ _id: id })
			let newDatos = { ...datos._doc, id: datos._id.toString() }
			return newDatos
		} catch (error) {
			return `No se pudo traer producto ${id}. ${error}`
		}
	}
	async getAll() {
		try {
			let datos = await this.modelo.find({});
			let newDatos = datos.map(el => {
				return { ...el._doc, id: el._id.toString() }
			})
			return newDatos;
		} catch (error) {
			console.log(`error al listar: ${error}`)
			return []
		}
	}
	async deleteById(id) {
		try {
			let datos = await this.modelo.deleteOne({ _id: id });
			return datos
		} catch (error) {
			console.log(`error al eliminar: ${error}`)
		}
	}

	async updateById(obj) {
		try {
			await this.modelo.updateOne({ _id: obj.id }, { $set: { ...obj } });
			return obj.id
		} catch (error) {
			console.log(`error al actualizar: ${error}`)
		}
	}
	async getById(user) {
		try {
			let datos = await this.modelo.findOne({ user: user })
			let newDatos = { ...datos._doc, id: datos._id.toString() }
			return newDatos
		} catch (error) {
			return `No se pudo traer producto ${id}. ${error}`
		}
	}
}

module.exports.ContenedorMongoDB = ContenedorMongoDB