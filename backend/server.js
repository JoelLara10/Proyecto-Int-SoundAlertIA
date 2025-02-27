const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Seguridad extra
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usuarios'); // CRUD de usuarios

const app = express();
const path = require('path');

// Middleware de seguridad y configuración
app.use(helmet());
app.use(express.json());
app.use(cors());

// Rutas de la API
app.use('/api/auth', authRoutes);  // Rutas de autenticación
app.use('/api', userRoutes);       // Rutas CRUD de usuarios

// Servir archivos estáticos (si lo necesitas en el futuro)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error al conectar MongoDB:', err));

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
