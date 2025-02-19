const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../models/User' );
const nodemailer = require( 'nodemailer' );
require( 'dotenv' ).config();

// Inicio de sesión 
exports.login = async ( req, res ) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne( { email } );

    if ( !user ) {
      return res.status( 400 ).json( { msg: 'Credenciales incorrectas' } );
    }

    // Verificar si el usuario está bloqueado
    if ( user.bloqueo_hasta && new Date() < user.bloqueo_hasta ) {
      return res.status( 403 ).json( { msg: 'Cuenta bloqueada. Inténtalo en 3 minutos.' } );
    }

    const isMatch = await bcrypt.compare( password, user.password );
    if ( !isMatch ) {
      user.intentos += 1;

      // Bloquear cuenta si ha fallado 3 veces
      if ( user.intentos >= 3 ) {
        user.bloqueo_hasta = new Date( Date.now() + 3 * 60 * 1000 ); // 3 minutos de bloqueo
        await user.save();
        return res.status( 403 ).json( { msg: 'Cuenta bloqueada. Inténtalo en 3 minutos.' } );
      }

      await user.save();
      return res.status( 400 ).json( { msg: 'Credenciales incorrectas' } );
    }

    // Restablecer intentos fallidos si inicia sesión correctamente
    user.intentos = 0;
    user.bloqueo_hasta = null;
    await user.save();

    const payload = { userId: user.id, rol: user.rol };
    const token = jwt.sign( payload, process.env.JWT_SECRET, { expiresIn: '1h' } );

    res.json( {
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
        email: user.email,
        fechaNacimiento: user.fechaNacimiento,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
        intentos: user.intentos,
        bloqueo_hasta: user.bloqueo_hasta
      }
    } );

  } catch ( error ) {
    res.status( 500 ).json( { msg: 'Error en el servidor' } );
  }
};

exports.recuperarPassword = async ( req, res ) => {
  try {
    const { email } = req.body;
    let user = await User.findOne( { email } );

    if ( !user ) {
      return res.status( 400 ).json( { msg: 'No se encontró un usuario con este email.' } );
    }

    const token = jwt.sign( { userId: user.id }, process.env.JWT_SECRET, { expiresIn: '10m' } );

    // Descomenta la configuración del transportador
    let transporter = nodemailer.createTransport( {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    } );

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Recuperación de contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: 
             http://localhost:5173/reset-password/${ token }`, // Asegúrate de que esta URL sea correcta
    };

    // Enviar el correo
    await transporter.sendMail( mailOptions );

    res.json( { msg: 'Se ha enviado un correo con instrucciones.' } );
  } catch ( error ) {
    console.error( "Error en recuperarPassword:", error ); // 🟡 Agrega esto para ver el error en la terminal
    res.status( 500 ).json( { msg: 'Error en el servidor', error: error.message } );
  }
};


exports.resetPassword = async ( req, res ) => {
  try {
    const { token, password } = req.body;

    // Verificar el token
    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    const user = await User.findById( decoded.userId );

    if ( !user ) {
      return res.status( 400 ).json( { msg: 'Usuario no encontrado' } );
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt( 10 );
    const hashedPassword = await bcrypt.hash( password, salt );

    // Actualizar la contraseña del usuario
    user.password = hashedPassword;
    await user.save();

    res.json( { msg: 'Contraseña restablecida con éxito' } );
  } catch ( error ) {
    console.error( error );
    res.status( 500 ).json( { msg: 'Error en el servidor', error: error.message } );
  }
};


exports.buscarUsuarioPorCorreo = async ( req, res ) => {
  try {
    const { email } = req.params; // Tomamos el email desde los parámetros de la URL
    const user = await User.findOne( { email } );

    if ( !user ) {
      return res.status( 404 ).json( { msg: 'Usuario no encontrado' } );
    }

    res.json( {
      user: {
        id: user._id,
        nombre: user.nombre,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
        email: user.email,
        fechaNacimiento: user.fechaNacimiento,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
        intentos: user.intentos,
        bloqueo_hasta: user.bloqueo_hasta
      }
    } );
  } catch ( error ) {
    res.status( 500 ).json( { msg: 'Error en el servidor' } );
  }
};


