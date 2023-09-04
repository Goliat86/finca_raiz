import {unlink} from 'node:fs/promises'
import {validationResult} from 'express-validator'
import {Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js'
import {esVendedor, formatearFecha} from '../helpers/index.js' 




const admin = async (req, res)=>{

//Leer queryString

// console.log(req.query.pagina)

const {pagina: paginaActual} = req.query
// console.log(paginaActual)
const expresion = /^[1-9]$/ //verifica que inicie y termine con digitos
if(!expresion.test(paginaActual)){
    return res.redirect('/mis-propiedades?pagina=1')
}

try {
    const {id} = req.usuario

    //Limites y offset para el paginador
    const limit = 5;
    const offset = ((paginaActual * limit) - limit)


    const [propiedades, total] = await Promise.all([
        Propiedad.findAll({
            limit: limit,
            offset,
            where:{
                usuarioid:id
            },
            include:[
                {model: Categoria, as:'categoria'},
                {model: Precio, as:'precio'},
                {model: Mensaje, as:'mensajes'}
               
            ]
        }),
        Propiedad.count({
            where:{
                usuarioId: id
            }
        })
    ])
    // console.log(total)
    // console.log(id)
    res.render('propiedades/admin', {
        pagina:'Mis propiedades',
        propiedades,
        csrfToken:req.csrfToken(),
        paginas: Math.ceil(total / limit),
        paginaActual: Number(paginaActual),
        total,
        offset,
        limit

            })
} catch (error) {
    console.log(error)
}

    
    
}

// formulario para crear una nueva propiedad
const crear = async(req, res)=>{
    //Consutar modelo de precio y categoría
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina:'Crear propiedad',
        csrfToken:req.csrfToken(),
        categorias,
        precios,
        datos:{}

    })
}

const guardar  =async (req, res) =>{
    //validación 
    let resultado = validationResult(req)
    if(!resultado.isEmpty()){

        //Consutar modelo de precio y categoría
        const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina:'Crear propiedad',
            csrfToken:req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos:req.body
        })
}
   // Crear un registro

    const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body
    const { id: usuarioId} = req.usuario
    try {
    const propiedadGuardada = await Propiedad.create({
        titulo,
        descripcion,
        habitaciones,
        estacionamiento,
        wc,
        calle,
        lat,
        lng,
        // precioId:precio es una manera de extraer precio y entregarla a precioId que es el campo relacionado en la base de datos
        precioId,
        categoriaId,
        usuarioId,
        imagen: ''
    })
    const {id} = propiedadGuardada
    res.redirect(`/propiedades/agregar-imagen/${id}`)
    
    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async(req, res)=>{

    const {id} = req.params

    //Validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //Validad que la propiedad no esta publicada

    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad pertenece a quien visita esta pagina
    
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina:`Agregar Imagen: ${propiedad.titulo}`,
        csrfToken:req.csrfToken(),
        propiedad,
        
    })
}

const almacenarImagen = async (req, res, next)=>{
    const {id} = req.params

    //Validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //Validad que la propiedad no esta publicada

    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad pertenece a quien visita esta pagina
    
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }

    try {
        // console.log(req.file)

        //Almacenar imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()
        next()
    } catch (error) {
        console.lor(error)    
    }
}

const editar = async(req, res)=>{
    const {id} = req.params
    //Validar que la propiedad exixta
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    //Revisar que quien visita la URL, es quien creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')    
    }
    //Consutar modelo de precio y categoría
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        pagina: `Editar propiedad:${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad

    })
}

const guardarCambios = async (req, res)=>{
    //Verificar la validación
     //validación 
     let resultado = validationResult(req)
     if(!resultado.isEmpty()){
 
         //Consutar modelo de precio y categoría
        const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
        ])
 
         return res.render('propiedades/editar', {
            pagina: 'Editar propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }
    const {id} = req.params
    //Validar que la propiedad exixta
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    //Revisar que quien visita la URL, es quien creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')    
    }
    //Reescribir el objeto y actualizarlo
    try {
        const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body
        const { id: usuarioId} = req.usuario
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
        })
        
        await propiedad.save()

        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error)
    }
}

const eliminar = async(req, res)=>{
    const {id} = req.params
    //Validar que la propiedad exixta
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    //Revisar que quien visita la URL, es quien creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')    
    }

    //Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log(`Se eliminó la imagen ${propiedad.imagen}`)

    //Eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

    //Modifica el estado de la propiedad
    const cambiarEstado = async(req, res)=>{
        // console.log('Cambiando estado.....')
        const {id} = req.params
        //Validar que la propiedad exixta
        const propiedad = await Propiedad.findByPk(id)
        if(!propiedad){
            return res.redirect('/mis-propiedades')
        }
        //Revisar que quien visita la URL, es quien creó la propiedad
        if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
            return res.redirect('/mis-propiedades')    
        }
        // console.log(propiedad)
        //Actualizar
        propiedad.publicado = !propiedad.publicado
        await propiedad.save()
        res.json({
            resultado: 'ok'
        })
    }

//,uestra una propiedad 
const mostrarPropiedad = async(req, res) =>{

    const {id}= req.params

    
    // console.log(req.usuario)

    //Comprobar que la propiedad exista 
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'}
        ]
    })

    if(!propiedad || !propiedad.publicado){
        return res.redirect('/404')
    }
    // console.log(esVendedor(req.usuario?.id, propiedad.usuarioId))
    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken:req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)    
    })
}

const enviarMensaje = async(req, res)=>{
    const {id}= req.params

    
    // console.log(req.usuario)

    //Comprobar que la propiedad exista 
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'}
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }

    //Renderizar los errores
    //validación 
    let resultado = validationResult(req)
        if(!resultado.isEmpty()){
           
            return res.render('propiedades/mostrar',{
                propiedad,
                pagina: propiedad.titulo,
                csrfToken:req.csrfToken(),
                usuario: req.usuario,
                esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
                errores: resultado.array()    
            })
        
    }

    // console.log(req.body)
    // console.log(req.params)
    // console.log(req.usuario)

    const {mensaje} = req.body
    const {id: propiedadeId} = req.params
    const {id: usuarioId} = req.usuario

    // return

    //Almacenar mensaje
    await Mensaje.create({
        mensaje,
        propiedadeId,
        usuarioId
    })

    // console.log(esVendedor(req.usuario?.id, propiedad.usuarioId))
    res.redirect('/')

}

    //Leer mensajes recibidos
    const verMensajes = async(req, res)=>{
        const {id} = req.params
        //Validar que la propiedad exixta
        const propiedad = await Propiedad.findByPk(id,{
            include:[
                
                {model: Mensaje, as:'mensajes',
                    include:[
                        {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                    ]

                }
               
            ]
        })
        if(!propiedad){
            return res.redirect('/mis-propiedades')
        }
        //Revisar que quien visita la URL, es quien creó la propiedad
        if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
            return res.redirect('/mis-propiedades')    
        }

        res.render('propiedades/mensajes',{
            pagina: 'Mensajes',
            mensajes: propiedad.mensajes,
            formatearFecha
        })
    }

export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}