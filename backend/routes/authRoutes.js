require('dotenv').config();
const express = require('express');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerUser } = require('../controllers/userController'); 
const authController = require('../controllers/authController');

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
module.exports = router;
