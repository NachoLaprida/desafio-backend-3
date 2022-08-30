const fs = require ('fs')

class Comentario {
    constructor (ruta) {
        this.ruta = ruta
    }
    async save(obj){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            if(dataArchivoParse.length){
                //obj = {...obj, id: dataArchivoParse[dataArchivoParse.length - 1].id + 1}; 
                obj.id = dataArchivoParse[dataArchivoParse.length - 1].id + 1;
                await fs.promises.writeFile(this.ruta, JSON.stringify([ ...dataArchivoParse, obj], null, 2))                
            }
            else {
                //obj = {...obj, id: 1}
                obj.id = 1
                await fs.promises.writeFile(this.ruta, JSON.stringify([obj], null, 2))
            }
            console.log(`El archivo tiene el id: ${dataArchivoParse[dataArchivoParse.length -1].id + 1}`)
            //return obj
        } catch (err) {
            console.log(err)
        }
    }
    async getAll() {
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            if(dataArchivoParse.length){
                //console.log(dataArchivoParse)
            } 
            else{
                console.log("No hay comentarios")
            }
            return dataArchivoParse

        }
        catch (err){
            console.log(err)
        }
    }
}

class Contenedor {
    constructor (ruta) {
        this.ruta = ruta
    }

    async leerArchivo(){
        let products = []
        let productsJson = ""
        try{
            products = await fs.promises.readFile(this.ruta, 'utf-8')
        }
        catch(err){
            console.log('No se encontro archivo')
        }
        if(products === '') products = []
            productsJson = JSON.parse(products)
            return productsJson
    }
    

    async getLenght(){
        const productsJson = await this.leerArchivo()
        return productsJson.length
    }


    async save(obj){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            if(dataArchivoParse.length){
                //obj = {...obj, id: dataArchivoParse[dataArchivoParse.length - 1].id + 1}; 
                obj.id = dataArchivoParse[dataArchivoParse.length - 1].id + 1;
                await fs.promises.writeFile(this.ruta, JSON.stringify([ ...dataArchivoParse, obj], null, 2))                
            }
            else {
                //obj = {...obj, id: 1}
                obj.id = 1
                await fs.promises.writeFile(this.ruta, JSON.stringify([obj], null, 2))
            }
            console.log(`El archivo tiene el id: ${dataArchivoParse[dataArchivoParse.length -1].id + 1}`)
            //return obj
        } catch (err) {
            console.log(err)
        }
    }

    async updateById(obj) {
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParseado = JSON.parse(dataArchivo)
            const objIndex = dataArchivoParseado.findIndex(producto => (producto.id) === (obj.id))
            if(objIndex !== -1) {
                dataArchivoParseado[objIndex] = obj
                await fs.promises.writeFile(this.ruta, JSON.stringify( dataArchivoParseado, null, 2))
                return {msg: 'actualizado el producto'}
            } else {
                return {error: 'no existe el producto'}
            }
            
        }
        catch (err){
            console.log(err)
        }
    }

    //traer productos por id
    async getById(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)

            let producto = dataArchivoParse.find(p => p.id === id)
            if(producto) {
                console.log(producto)
            } else {
                console.log('No se encontro el producto')
            }
            return producto
        }
        catch (err){
            console.log(err)
        }
    }
    async getLastId(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)

            let producto = dataArchivoParse[ dataArchivoParse.length - 1 ]
            if(producto) {
                console.log(producto)
            } else {
                console.log('No se encontro el producto')
            }
            return producto
        }
        catch (err){
            console.log(err)
        }
    }
    async getAll() {
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            if(dataArchivoParse.length){
                //console.log(dataArchivoParse)
            } 
            else{
                console.log("No hay productos")
            }
            return dataArchivoParse

        }
        catch (err){
            console.log(err)
        }
    }

    async delete(id){
        try{
            console.log(id)
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            let producto = dataArchivoParse.find(p => p.id === id)
            console.log(dataArchivoParse)
            console.log(producto)
            if(producto){
                let dataArchivoParseFiltrado = dataArchivoParse.filter(p => p.id !== id)
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParseFiltrado, null, 2))
                console.log('Producto Eliminado')
            }
            else {
                console.log('No se encontro el producto')
            }
        }
        catch(err){
            console.log(err)
        }
    }
    async deleteAll(){
        await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2))
            console.log('Productos Eliminados')
    }


}

class Carrito {
    constructor(ruta){
        this.ruta = ruta
    }
    async save(obj){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            if(dataArchivoParse.length){
                //obj = {...obj, id: dataArchivoParse[dataArchivoParse.length - 1].id + 1}; 
                obj.id = dataArchivoParse[dataArchivoParse.length - 1].id + 1;
                await fs.promises.writeFile(this.ruta, JSON.stringify( ...dataArchivoParse, obj, null, 2))                
            }
            else {
                //obj = {...obj, id: 1}
                obj.id = 1
                await fs.promises.writeFile(this.ruta, JSON.stringify(obj, null, 2))
            }
            
            //return obj
        } catch (err) {
            console.log(err)
        }
    }
    async getAll() {
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo).products
            if(dataArchivoParse.length){
                //console.log(dataArchivoParse)
            } 
            else{
                console.log("No hay productos")
            }
            return dataArchivoParse

        }
        catch (err){
            console.log(err)
        }
    }
    async delete(id){
        try{
            console.log(id)
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            let producto = dataArchivoParse.find(p => p.id === id)
            console.log(dataArchivoParse)
            console.log(producto)
            if(producto){
                let dataArchivoParseFiltrado = dataArchivoParse.filter(p => p.id !== id)
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParseFiltrado, null, 2))
                console.log('Producto Eliminado')
            }
            else {
                console.log('No se encontro el producto')
            }
        }
        catch(err){
            console.log(err)
        }
    }
    async getById(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let carrito = JSON.parse(dataArchivo)
            if(carrito) {
                console.log(carrito)
            } else {
                console.log('No se encontro el carrito')
            }
            return carrito
        }
        catch (err){
            console.log(err)
        }
    }

    async createCart() {
        let timestamp = Date.now()
        let carrito = {
            id: 1,
            timestamp,
            products: [],

        }          
        await this.save(carrito)
        return carrito
    }
    
}
module.exports.Contenedor = Contenedor
module.exports.Comentario = Comentario
module.exports.Carrito = Carrito