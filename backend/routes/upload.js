const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Crear carpeta 'uploads' si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ruta para subir la imagen
router.post('/api/auth/upload', upload.single('foto_perfil'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.foto_perfil = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Foto de perfil actualizada correctamente',
      foto_perfil: user.foto_perfil,
    });

  } catch (error) {
    console.error('Error al actualizar la foto de perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Servir imágenes estáticas
router.use('/uploads', express.static(uploadDir));

module.exports = router;
