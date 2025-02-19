require('dotenv').config();
const express = require('express');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerUser } = require('../controllers/userController'); 
const authController = require('../controllers/authController');
const { updateProfilePicture } = require('../controllers/authController');


const router = express.Router();

// Middleware para verificar edad
const verificarEdad = (req, res, next) => {
    const { fechaNacimiento } = req.body;
    const cumple = new Date(fechaNacimiento);

    if (isNaN(cumple)) return res.status(400).json({ message: 'Fecha de nacimiento inválida.' });

    const hoy = new Date();
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
        edad--;
    }

    if (edad < 18) {
        return res.status(400).json({ message: 'Debes ser mayor de 18 años para registrarte.' });
    }

    next();
};

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token desde el encabezado

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, '5323e16709b230bb1764a10b640116c29e7723444fa4423a1824c3f9c47696e9aa5fe0d361948b8b005e36860b9fdeb853027a0b11a027b5183e120c522caea2', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.userId = decoded.id; // Almacenar el ID del usuario decodificado
    next();
  });
};

// Ruta para obtener los datos del perfil
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Buscar al usuario por su ID
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', verificarEdad, registerUser); // Agrega el middleware de verificación de edad antes de registrar al usuario

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
      const usuarios = await User.find();  // Encuentra todos los usuarios en la base de datos
      res.json(usuarios);  // Devuelve los usuarios en formato JSON
  } catch (error) {
      res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

// Ruta para iniciar sesion
router.post('/login', authController.login);

// Ruta para recuperar contraseña
router.post('/recuperar-password', authController.recuperarPassword);

// Resetear password
router.post('/reset-password', authController.resetPassword);


// Ruta para encontrar a un solo usuario mediante correo
router.get('/usuario/:email', authController.buscarUsuarioPorCorreo);

//router.post('/update-profile-picture', verifyToken, upload.single('foto_perfil'), updateProfilePicture);

module.exports = router;
