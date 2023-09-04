import {Dropzone} from 'dropzone'


const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')//traemos meta desde agregar-imagen.pug
console.log(token)
Dropzone.options.imagen = {
    dictDefaultMessage: 'Carga tus imagenes aquí',//cambie el mensaje que trae dropzone por defecto a uno que querramos
    acceptedFiles:'.png,.jpg,.jpng',//tipos de formatos que se aceptan 
    maxFilesize: 5,//se refiere a el tamaño de imagen en esta caso 5megas
    maxFiles: 1,//Cantidad maxima de archivos que puedo arrastrar
    parallelUploads: 1,//Cantidad de archivos que estamos soportando ejm si ponfo maxfiles: 5, parallelUploads: 5
    autoProcessQueue: false,//Se usa para subir la imagen automaticamente en este caso lo vamos a concretar desde un boton
    addRemoveLinks: true,//Se usa para poder eliminar imagenes antes de cargarlas
    dictRemoveFile:"Borrar archivo",//Se usa para cambiar el nombre por defecto que trae para poder eliminar la imagen
    dictMaxFilesExceeded:"El limite es 1 archivo",//Se usa para cambiar el mensaje por default
    headers:{
        'CSRF-Token': token//Es la forma en que dropzone requiere el token
    },
    paramName:'imagen',//se trae desde routes propiedades routes  upload single
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/mis-propiedades'
            }
        })
       

    }
}
