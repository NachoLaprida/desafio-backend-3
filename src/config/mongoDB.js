const mongoose = require("mongoose");
require('dotenv').config()

const connectMongoDB = async () => {
	try {
		const url = process.env.MONGO_ATLAS;
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("MongoDb conectado");
	} catch (error) {
		console.error(`error de conexion: ${error}`);
	}
};

module.exports.connectMongoDB = connectMongoDB;