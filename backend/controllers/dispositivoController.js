const mongoose = require('mongoose');
const Dispositivo = require('../models/Dispositivo');

// Crear dispositivo
exports.crearDispositivo = async (req, res) => {
    try {
        // Convertir usuario_id a ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.body.usuario_id)) {
            return res.status(400).json({ msg: 'usuario_id no es válido' });
        }

        const nuevoDispositivo = new Dispositivo({
            dispositivo_id: req.body.dispositivo_id,
            usuario_id: new mongoose.Types.ObjectId(req.body.usuario_id), // ✅ Convertir a ObjectId
            ubicacion: req.body.ubicacion,
            estado: req.body.estado
        });

        const dispositivoGuardado = await nuevoDispositivo.save();
        res.status(201).json(dispositivoGuardado);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el dispositivo', error: error.message });
    }
};

// Actualizar dispositivo
exports.actualizarDispositivo = async (req, res) => {
    try {
        const { id } = req.params;

        // Convertir usuario_id a ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.body.usuario_id)) {
            return res.status(400).json({ msg: 'usuario_id no es válido' });
        }

        const dispositivoActualizado = await Dispositivo.findByIdAndUpdate(id, {
            dispositivo_id: req.body.dispositivo_id,
            usuario_id: new mongoose.Types.ObjectId(req.body.usuario_id), // ✅ Convertir a ObjectId
            ubicacion: req.body.ubicacion,
            estado: req.body.estado
        }, { new: true });

        if (!dispositivoActualizado) {
            return res.status(404).json({ msg: 'Dispositivo no encontrado' });
        }

        res.status(200).json(dispositivoActualizado);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el dispositivo', error: error.message });
    }
};
