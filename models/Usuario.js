import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Usuario = db.define('usuarios', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false, //se refiere a que el campo no puede ir vacio
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false, //se refiere a que el campo no puede ir vacio
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false, //se refiere a que el campo no puede ir vacio
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    hooks:{ // hashear el password
        beforeCreate:async function(usuario){
            const salt = await bcrypt.genSalt(10)// numero de rondas de hasheo
            usuario.password = await bcrypt.hash(usuario.password, salt)
        }
    },
    scopes:{
        eliminarPassword:{
            attributes:{
                exclude:['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
})
//Metodos personalizados
Usuario.prototype.verificarPassword = function(password)    {
    return bcrypt.compareSync(password, this.password);
}   
export default Usuario

