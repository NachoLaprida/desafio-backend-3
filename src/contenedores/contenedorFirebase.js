var admin = require("firebase-admin");

var serviceAccount = require("../desafio-backend-a32b6-firebase-adminsdk-w0w66-e6867da526.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

class ContenedorFirebase {
	constructor(coll) {
		this.coll = coll
		this.query = db.collection(coll)
	}
    async save(obj) {
		try {
			let save = await this.query.add(obj)
			return save.id
		} catch (error) {
			console.log(`error en el save: ${error}`)
		}
	}
    async updateById(obj) {
		try {
			await this.query.doc(obj.id).update(obj)
			return obj.id
		} catch (error) {
			console.log(`error update: ${error}`)
		}
	}
	async getById(id) {
		try {
			let docs = await this.query.doc(id).get()
			let newDocs = { ...docs.data(), id: docs.id }
			return newDocs
		} catch (error) {
			console.log(`No se pudo traer el producto ${id}. ${error}`)
		}
	}
	async getAll() {
		try {
			let queryRead = await this.query.get()
			let docs = queryRead.docs
			let newDocs = docs.map(doc => ({...doc.data(), id: doc.id}))
			return newDocs
		} catch (error) {
			console.log(`error en el read: ${error}`)
		}
	}
	async deleteById(id) {
		try {
			let docDelete = await this.query.doc(id).delete()
			return docDelete
		} catch (error) {
			console.log(`error en el delete: ${error}`)
		}
	}
}

module.exports.ContenedorFirebase = ContenedorFirebase