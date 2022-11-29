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

module.exports.Comentario = Comentario