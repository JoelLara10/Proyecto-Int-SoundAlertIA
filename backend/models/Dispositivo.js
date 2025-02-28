const mongoose = require('mongoose');

const DispositivoSchema = new mongoose.Schema({
  dispositivo_id: { type: String, required: true, unique: true },
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ubicacion: { type: String, required: true },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  ultima_reporte: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispositivo', DispositivoSchema);
