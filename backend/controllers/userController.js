const bcrypt = require('bcryptjs'); 
const User = require('../models/User');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, email, password, fechaNacimiento, rol, foto_perfil } = req.body;

        // Verificar si el correo electrónico ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear un nuevo usuario
        const newUser = new User({
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            password: hashedPassword,
            fechaNacimiento,
            rol,
            foto_perfil
        });

        // Guardar el usuario en la base de datos
        await newUser.save();
        
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
};

module.exports = { registerUser };
