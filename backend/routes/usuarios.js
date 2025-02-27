const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importa el modelo
const mongoose = require('mongoose');

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el usuario' });
  }
});

// Crear un nuevo usuario
// router.post('/usuarios', async (req, res) => {
//   try {
//     const { nombre, apellido_paterno, apellido_materno, email, password, fechaNacimiento, rol, foto_perfil } = req.body;

//     // Verifica si el usuario ya existe
//     const usuarioExistente = await User.findOne({ email });
//     if (usuarioExistente) {
//       return res.status(400).json({ msg: 'El correo ya está registrado' });
//     }

//     const nuevoUsuario = new User({
//       nombre,
//       apellido_paterno,
//       apellido_materno,
//       email,
//       password,
//       fechaNacimiento,
//       rol,
//       foto_perfil
//     });

//     await nuevoUsuario.save();
//     res.status(201).json({ msg: 'Usuario creado exitosamente', usuario: nuevoUsuario });

//   } catch (error) {
//     res.status(500).json({ msg: 'Error al crear el usuario' });
//   }
// });

// Actualizar un usuario
router.put('/usuarios/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    console.log('ID recibido:', userId); // <-- Verifica el ID en consola

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'ID no válido' });
    }

    const usuarioExistente = await User.findById(userId);
    if (!usuarioExistente) {
      return res.status(404).json({ msg: 'Usuario no encontrado en la base de datos' });
    }

    const { nombre, apellido_paterno, apellido_materno, email, rol, foto_perfil, fechaNacimiento } = req.body;

    const usuarioActualizado = await User.findByIdAndUpdate(
      userId,
      { nombre, apellido_paterno, apellido_materno, email, rol, foto_perfil, fechaNacimiento },
      { new: true, runValidators: true }
    );

    res.json({ msg: 'Usuario actualizado', usuario: usuarioActualizado });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el usuario', error: error.message });
  }
});

// Eliminar un usuario por ID
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);

    if (!usuarioEliminado) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario eliminado' });

  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
