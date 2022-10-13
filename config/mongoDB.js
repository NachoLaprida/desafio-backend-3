const mongoose = require("mongoose");

const connectMongoDB = async () => {
	try {
		const url = 'mongodb+srv://Nacholi:parlamento88@cluster0.8viuxhq.mongodb.net/?retryWrites=true&w=majority';
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