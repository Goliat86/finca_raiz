import multer from 'multer'
import path from 'path'//permite navegar y leer sobre las diferentes carpetas del proyecto 
import {generarId} from '../helpers/tokens.js'

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb){
        cb(null, generarId() + path.extname(file.originalname))//extname trae la extención de un archivo

    }
})

const upload = multer({storage})

export default upload