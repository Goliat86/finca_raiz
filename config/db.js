import Sequelize from 'sequelize' // es un ORM  nos permite manipular varias bases de datos SQL de una manera bastante sencilla
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER, process.env.BD_PASS,{//Si el password es vacio se pone process.env.BD_PASS ?? '',
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: process.env.BD_BD ,
    define: {
        timestamps: true
    },
    pool:{ /*configura las conecciones nuevas o ya exixtentes mantiene o reutiliza las conecciones que esten vivas y no crear una nueva*/ 
        max: 5, /* cuanto es el maximo de conexiones a mantener */
        min: 0, /* se refiere a que cuando no aya actividad en el sitio va tratar de desconectar las conecciones para liberar recursos  */
        acquire: 30000, /*tiempo que va pasar tratando de realizar una coneccion antes de arojar un error */
        idle: 10000 /*si nadie esta usando el sitio le da este tiempo para finalizar la coneccion  */
    },
    operatorAliases: false
})

export default db;