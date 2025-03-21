const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/usuarios");
const dispositivoRoutes = require("./routes/dispositivos");
const alertaRoutes = require("./routes/alertas");

// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-config.json"); // Configuración de Firebase

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/dispositivos", dispositivoRoutes);
app.use("/api/alertas", alertaRoutes);

// Conexión a MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.error("Error al conectar MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
