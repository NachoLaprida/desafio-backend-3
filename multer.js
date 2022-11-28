//multer
const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        //console.dir(cb)
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

module.exports = storage