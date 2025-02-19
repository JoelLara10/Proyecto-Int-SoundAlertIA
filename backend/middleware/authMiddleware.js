const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Obtener el token desde los headers
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password'); // Excluir contraseña

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Guardar usuario en la solicitud para que lo usen otros controladores
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido o expirado' });
  }
};
