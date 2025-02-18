const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido_paterno: { type: String, required: true },
    apellido_materno: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
    foto_perfil: { type: String, default: '' },
    intentos: { type: Number, default: 0 },
    bloqueo_hasta: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
