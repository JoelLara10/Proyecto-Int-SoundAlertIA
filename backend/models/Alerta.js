const mongoose = require('mongoose');

const AlertaSchema = new mongoose.Schema({
  tipo_sonido: { type: String, required: true },
  fecha_hora: { type: Date, default: Date.now },
  nivel_sonido: { type: String, required: true },
  texto_icono: { type: String, required: true },
  dispositivo_id: { type: String, required: true },
  ubicacion: { type: String, required: true },
  notificacion: { type: String, enum: ['enviada', 'pendiente', 'fallida'], default: 'pendiente' }
});

module.exports = mongoose.model('Alerta', AlertaSchema);
