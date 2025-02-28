const express = require('express');
const multer = require('multer');
const router = express.Router();
const Alerta = require('../models/Alerta');
const { importarAlertas, exportAlertas } = require('../controllers/excelController');
const mongoose = require('mongoose');

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/import-excel', upload.single('file'), importarAlertas);

// // Descargar alertas en Excel
router.get('/export-excel', async (req, res) => {
  exportAlertas(req, res, Alerta);
});

// Obtener todas las alertas
router.get('/', async (req, res) => {
  try {
    const alertas = await Alerta.find();
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener alertas', error: error.message });
  }
});

// Obtener una alerta por ID
router.get('/:id', async (req, res) => {
  try {
    const alerta = await Alerta.findById(req.params.id);
    if (!alerta) return res.status(404).json({ msg: 'Alerta no encontrada' });
    res.json(alerta);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener la alerta', error: error.message });
  }
});

// Crear una nueva alerta
router.post('/', async (req, res) => {
  try {
    const { tipo_sonido, fecha_hora, nivel_sonido, texto_icono, dispositivo_id, ubicacion, notificacion } = req.body;

    const nuevaAlerta = new Alerta({
      tipo_sonido,
      fecha_hora,
      nivel_sonido,
      texto_icono,
      dispositivo_id,
      ubicacion,
      notificacion
    });

    await nuevaAlerta.save();
    res.status(201).json({ msg: 'Alerta creada', alerta: nuevaAlerta });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear la alerta', error: error.message });
  }
});

// Actualizar una alerta
router.put('/:id', async (req, res) => {
  try {
    const { tipo_sonido, fecha_hora, nivel_sonido, texto_icono, dispositivo_id, ubicacion, notificacion } = req.body;

    const alertaActualizada = await Alerta.findByIdAndUpdate(
      req.params.id,
      { tipo_sonido, fecha_hora, nivel_sonido, texto_icono, dispositivo_id, ubicacion, notificacion },
      { new: true, runValidators: true }
    );

    if (!alertaActualizada) return res.status(404).json({ msg: 'Alerta no encontrada' });

    res.json({ msg: 'Alerta actualizada', alerta: alertaActualizada });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar la alerta', error: error.message });
  }
});

// Eliminar una alerta
router.delete('/:id', async (req, res) => {
  try {
    const alertaEliminada = await Alerta.findByIdAndDelete(req.params.id);
    if (!alertaEliminada) return res.status(404).json({ msg: 'Alerta no encontrada' });

    res.json({ msg: 'Alerta eliminada' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar la alerta', error: error.message });
  }
});

module.exports = router;
