require( 'dotenv' ).config();
const express = require( 'express' );
//const bcrypt = require('bcrypt');
const jwt = require( 'jsonwebtoken' );
const nodemailer = require( 'nodemailer' );
const bcrypt = require( 'bcryptjs' );
const User = require( '../models/User' );
const { registerUser } = require( '../controllers/userController' );
const authController = require( '../controllers/authController' );
//const { updateProfilePicture } = require( '../controllers/authController' );


const router = express.Router();

// Middleware para verificar edad
const verificarEdad = ( req, res, next ) => {
  const { fechaNacimiento } = req.body;
  const cumple = new Date( fechaNacimiento );

  if ( isNaN( cumple ) ) return res.status( 400 ).json( { message: 'Fecha de nacimiento inválida.' } );

  const hoy = new Date();
  let edad = hoy.getFullYear() - cumple.getFullYear();
  const mes = hoy.getMonth() - cumple.getMonth();
  if ( mes < 0 || ( mes === 0 && hoy.getDate() < cumple.getDate() ) ) {
    edad--;
  }

  if ( edad < 18 ) {
    return res.status( 400 ).json( { message: 'Debes ser mayor de 18 años para registrarte.' } );
  }

  next();
};

// Middleware para verificar el token JWT
const verifyToken = ( req, res, next ) => {
  const token = req.headers[ 'authorization' ]?.split( ' ' )[ 1 ]; // Obtener el token desde el encabezado

  if ( !token ) {
    return res.status( 403 ).json( { message: 'Token no proporcionado' } );
  }

  jwt.verify( token, process.env.JWT_SECRET, ( err, decoded ) => {
    if ( err ) {
      console.error( 'Error verificando token:', err );
      return res.status( 401 ).json( { message: 'Token inválido' } );
    }

    req.userId = decoded.userId; // En lugar de decoded.id
    next();
  } );
};

// Ruta para obtener los datos del perfil
router.get( '/profile', verifyToken, async ( req, res ) => {
  try {
    const user = await User.findById( req.userId ); // Buscar al usuario por su ID
    if ( !user ) {
      return res.status( 404 ).json( { message: 'Usuario no encontrado' } );
    }
    res.json( { user } );
  } catch ( err ) {
    res.status( 500 ).json( { message: 'Error del servidor' } );
  }
} );

// Ruta para registrar un nuevo usuario
router.post( '/register', verificarEdad, registerUser ); // Agrega el middleware de verificación de edad antes de registrar al usuario

// Ruta para obtener todos los usuarios
router.get( '/usuarios', async ( req, res ) => {
  try {
    const usuarios = await User.find();  // Encuentra todos los usuarios en la base de datos
    res.json( usuarios );  // Devuelve los usuarios en formato JSON
  } catch ( error ) {
    res.status( 500 ).json( { msg: 'Error al obtener los usuarios' } );
  }
} );

// Ruta para iniciar sesion
router.post( '/login', authController.login );

// Ruta para recuperar contraseña
router.post( '/recuperar-password', authController.recuperarPassword );

// Resetear password
router.post( '/reset-password', authController.resetPassword );


// Ruta para encontrar a un solo usuario mediante correo
router.get( '/usuario/:email', authController.buscarUsuarioPorCorreo );

//const multer = require( 'multer' );

// // Configurar multer para subir archivos
// const storage = multer.diskStorage( {
//   destination: ( req, file, cb ) => {
//     cb( null, 'uploads/' ); // Carpeta donde se guardará la imagen
//   },
//   filename: ( req, file, cb ) => {
//     cb( null, `${ Date.now() }-${ file.originalname }` ); // Nombre único
//   },
// } );

// const upload = multer( { storage } );

// // Ruta para actualizar la foto de perfil
// router.post('/update-profile-picture', verifyToken, upload.single('foto_perfil'), async (req, res) => {
//   try {
//     await updateProfilePicture(req, res);
//   } catch (error) {
//     console.error('Error en subida de imagen:', error);
//     res.status(500).json({ message: 'Error subiendo la imagen' });
//   }
// });


module.exports = router;
