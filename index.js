//const express = require('express')//commonJS es la forma antigua 
import express from 'express'//ECMAScript modules
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'
import bodyparser from 'body-parser'



// crear la app
const app = express()

// Habilitar body-parser
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

// Habilitar cookie-parser
app.use(cookieParser())

// Habilitar csrf
app.use(csrf({cookie:true}))

// habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}))



// coneccion a la base de datos
try{
    await db.authenticate();
    db.sync()//crea las tablas en la base de datos en caso de no estar creadas
    console.log('conexion correcta a la base de datos')
}catch (error){
    console.log(error)
}

//Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//carpeta publica
app.use(express.static('public'))

//Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)




//Definir puerto del servidor
const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Servidor funcionando por el puerto ${port}`)
}) 