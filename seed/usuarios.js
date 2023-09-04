import bcrypt from 'bcrypt'
const usuarios = [
    {
        nombre: 'omar',
        email: 'omarsr25@hotmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }

]

export default usuarios