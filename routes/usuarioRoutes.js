import express from "express";
import { formularioLogin, autenticar,cerrarSesion, formularioRegistro, registrar,confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword } from "../controllers/usuarioController.js";


const router = express.Router();

//Routing
router.get('/login', formularioLogin );
router.post('/login', autenticar );

//Cerrar sesión
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro );
router.post('/registro', registrar );

router.get('/confirmar/:token', confirmar)

router.get('/olvide-Password', formularioOlvidePassword );
router.post('/olvide-Password', resetPassword );

//Almacena el nuevo password
router.get('/olvide-Password/:token', comprobarToken );
router.post('/olvide-Password/:token', nuevoPassword );

export default router