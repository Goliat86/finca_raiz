import {exit} from 'node:process'
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
// import Categoria from "../models/Categoria.js"
// import Precio from "../models/Precio.js"
import{Categoria, Precio, Usuario} from "../models/index.js"
import db from '../config/db.js'

import { fromJSON } from 'postcss';

const importarDatos = async()=>{
    try {

        //Autenticar en la base de datos
        await db.authenticate()

        //Generar las columnas
        await db.sync()

        //Insertamos los datos
        // await Categoria.bulkCreate(categorias) // si categoria dependiera de precios o vice versa usariamos este codigo
        // await Precio.bulkCreate(precios)  
        await Promise.all([//Si categorias no dependen de precios podemos usar promise
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos importados correctamente')
        exit()//exit sin codigo se utiliza cuando no hubieron errores

    } catch (error) {
        console.log(error) 
        // process.exit(1)  
        exit(1)//se usa cuando se finaliza pero hubo errores
    }
}

const eliminarDatos = async()=>{
    try {
        // await Promise.all([//se usa para limpiar la base de datos
        //     Categoria.destroy({where:{}, truncate:true}),
        //     Precio.destroy({where:{}, truncate:true})
        // ])

        await db.sync({force: true})// es otra forma de limpiar la base de datos
        console.log('Datos eliminados correctamente')
        exit()
    } catch (error) {
        console.log(error) 
        exit(1)
    }
}

if (process.argv[2]=== "-i"){//i de importar
    importarDatos();
}

if (process.argv[2]=== "-e"){//e de eliminar
    eliminarDatos();
}