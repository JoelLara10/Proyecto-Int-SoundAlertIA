const express = require('express');
const multer = require('multer');
const router = express.Router();
const Dispositivo = require('../models/Dispositivo');
const mongoose = require('mongoose');
const { importarDispositivos, exportDispositivos } = require('../controllers/excelController');

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/import-excel', upload.single('file'), importarDispositivos);

// Primero definimos la ruta para exportar
router.get('/export-excel', async (req, res) => {
  exportDispositivos(req, res, Dispositivo);
});

// Obtener todos los dispositivos
router.get('/', async (req, res) => {
  try {
    const dispositivos = await Dispositivo.find().populate('usuario_id', 'nombre email');
    res.json(dispositivos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener dispositivos', error: error.message });
  }
});

// Obtener un solo dispositivo por ID
router.get('/:id', async (req, res) => {
  try {
    const dispositivo = await Dispositivo.findById(req.params.id).populate('usuario_id', 'nombre email');
    if (!dispositivo) return res.status(404).json({ msg: 'Dispositivo no encontrado' });
    res.json(dispositivo);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el dispositivo', error: error.message });
  }
});

// Crear un nuevo dispositivo
router.post('/', async (req, res) => {
  try {
    const { dispositivo_id, usuario_id, ubicacion, estado } = req.body;

    // Verificar que usuario_id sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
      return res.status(400).json({ msg: 'Error: usuario_id no es un ObjectId válido.' });
    }

    // Crear el nuevo dispositivo con usuario_id convertido a ObjectId
    const nuevoDispositivo = new Dispositivo({
      dispositivo_id,
      usuario_id: new mongoose.Types.ObjectId(usuario_id), // Convertir usuario_id a ObjectId
      ubicacion,
      estado
    });

    await nuevoDispositivo.save();
    res.status(201).json({ msg: 'Dispositivo creado', dispositivo: nuevoDispositivo });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el dispositivo', error: error.message });
  }
});

// Actualizar un dispositivo
router.put('/:id', async (req, res) => {
  try {
    const { dispositivo_id, usuario_id, ubicacion, estado } = req.body;

    const dispositivoActualizado = await Dispositivo.findByIdAndUpdate(
      req.params.id,
      { dispositivo_id, usuario_id, ubicacion, estado },
      { new: true, runValidators: true }
    );

    if (!dispositivoActualizado) return res.status(404).json({ msg: 'Dispositivo no encontrado' });

    res.json({ msg: 'Dispositivo actualizado', dispositivo: dispositivoActualizado });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar el dispositivo', error: error.message });
  }
});

// Eliminar un dispositivo
router.delete('/:id', async (req, res) => {
  try {
    const dispositivoEliminado = await Dispositivo.findByIdAndDelete(req.params.id);
    if (!dispositivoEliminado) return res.status(404).json({ msg: 'Dispositivo no encontrado' });

    res.json({ msg: 'Dispositivo eliminado' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el dispositivo', error: error.message });
  }
});

module.exports = router;
