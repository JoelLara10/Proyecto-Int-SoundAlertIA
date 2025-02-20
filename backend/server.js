const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Agregar helmet
const authRoutes = require('./routes/authRoutes');
//const userRoutes = require('./routes/userRoutes.js'); 

require('dotenv').config();
const app = express();
const path = require('path');
//const uploadRouter = require('./routes/upload'); 
//console.log("EMAIL_USER:", process.env.EMAIL_USER);
//console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Cargado " : "No cargado ");

// Usar helmet para aplicar políticas de seguridad
app.use(helmet());

// Configuración de middleware
app.use(express.json());
app.use(cors());

// Configuración de rutas
app.use('/api/auth', authRoutes);
//app.use('/api/user', userRoutes);

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usa el enrutador de carga
//app.use('/api/auth/upload', uploadRouter); 

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Iniciar el servidor
app.listen(5000, () => console.log('Servidor corriendo en el puerto 5000'));
