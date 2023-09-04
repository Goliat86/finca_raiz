//Realacion de los modelos
import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'


// Precio.hasOne(Propiedad)se usa para relacion uno a uno entre propiedad y precio
Propiedad.belongsTo(Precio, {foreingKey:'precioId'})//Es otra manera para hacer una relacion de uno a uno y le asignamos al campo el nombre precioId
Propiedad.belongsTo(Categoria, {foreingKey:'categoriaId'})
Propiedad.belongsTo(Usuario, {foreingKey:'usuarioId'})
Propiedad.hasMany(Mensaje, {foreingKey:'propiedadeId'})

Mensaje.belongsTo(Propiedad, {foreingKey:'propiedadeId'})
Mensaje.belongsTo(Usuario, {foreingKey:'usuarioId'})




export{
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}