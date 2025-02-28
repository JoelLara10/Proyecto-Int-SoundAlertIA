const xlsx = require( 'xlsx' );
const User = require( '../models/User' );
const ExcelJS = require( 'exceljs' );
const Dispositivo = require( '../models/Dispositivo' );
const Alerta = require( '../models/Alerta' );

const importExcel = async ( req, res ) => {
  try {
    if ( !req.file ) {
      return res.status( 400 ).json( { error: "No se ha subido ningún archivo." } );
    }

    // Leer el archivo Excel desde el buffer
    const workbook = xlsx.read( req.file.buffer, { type: 'buffer' } );
    const sheetName = workbook.SheetNames[ 0 ];
    const data = xlsx.utils.sheet_to_json( workbook.Sheets[ sheetName ] );

    let registrosNuevos = 0;

    for ( let item of data ) {
      const existe = await User.findOne( { email: item.email } );

      if ( !existe ) {
        const nuevoUsuario = new User( {
          nombre: item.nombre,
          apellido_paterno: item.apellido_paterno,
          apellido_materno: item.apellido_materno,
          email: item.email,
          password: item.password, // Hash en producción
          fechaNacimiento: new Date( item.fechaNacimiento ),
          rol: item.rol || 'usuario',
          foto_perfil: item.foto_perfil || '',
          intentos: item.intentos || 0,
          bloqueo_hasta: item.bloqueo_hasta ? new Date( item.bloqueo_hasta ) : null
        } );

        await nuevoUsuario.save();
        registrosNuevos++;
      }
    }

    res.json( { mensaje: `Importación completada. Se añadieron ${ registrosNuevos } nuevos usuarios.` } );

  } catch ( error ) {
    console.error( error );
    res.status( 500 ).json( { error: "Error al procesar el archivo." } );
  }
};

const importarDispositivos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No se proporcionó un archivo' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const dispositivos = data.map((row) => ({
      dispositivo_id: row.dispositivo_id,
      usuario_id: row.usuario_id, // Se asume que el Excel ya tiene usuario_id correcto
      ubicacion: row.ubicacion || 'Desconocida',
      estado: ['activo', 'inactivo'].includes(row.estado) ? row.estado : 'activo',
      ultima_reporte: isNaN(new Date(row.ultima_reporte)) ? Date.now() : new Date(row.ultima_reporte),
    }));

    // Filtrar dispositivos válidos
    const dispositivosValidos = dispositivos.filter(d => d.usuario_id);

    if (dispositivosValidos.length === 0) {
      return res.status(400).json({ msg: 'No se encontraron dispositivos válidos para importar' });
    }

    let dispositivosInsertados = 0;
    let dispositivosFallidos = [];

    // Intentar insertar dispositivos evitando duplicados y manejando errores individualmente
    for (const dispositivo of dispositivosValidos) {
      try {
        const existe = await Dispositivo.findOne({ dispositivo_id: dispositivo.dispositivo_id });
        if (!existe) {
          await Dispositivo.create(dispositivo);
          dispositivosInsertados++;
        }
      } catch (error) {
        dispositivosFallidos.push({ dispositivo_id: dispositivo.dispositivo_id, error: error.message });
      }
    }

    res.json({
      msg: `Proceso completado. Dispositivos insertados: ${dispositivosInsertados}`,
      errores: dispositivosFallidos.length > 0 ? dispositivosFallidos : 'Ninguno'
    });

  } catch (error) {
    res.status(500).json({ msg: 'Error al importar dispositivos', error: error.message });
  }
};

const importarAlertas = async ( req, res ) => {
  try {
    if ( !req.file ) {
      return res.status( 400 ).json( { msg: 'No se proporcionó un archivo' } );
    }

    const workbook = xlsx.read( req.file.buffer, { type: 'buffer' } );
    const sheetName = workbook.SheetNames[ 0 ];
    const data = xlsx.utils.sheet_to_json( workbook.Sheets[ sheetName ] );

    const alertas = data.map( ( row ) => ( {
      tipo_sonido: row.tipo_sonido,
      fecha_hora: isNaN( new Date( row.fecha_hora ) ) ? null : new Date( row.fecha_hora ),
      nivel_sonido: row.nivel_sonido,
      texto_icono: row.texto_icono,
      dispositivo_id: row.dispositivo_id,
      ubicacion: row.ubicacion,
      notificacion: row.notificacion,
    } ) );

    await Alerta.insertMany( alertas );
    res.json( { msg: 'Alertas importadas correctamente' } );
  } catch ( error ) {
    res.status( 500 ).json( { msg: 'Error al importar alertas', error: error.message } );
  }
};


const exportExcel = async ( req, res, User, fileName ) => {
  try {
    const users = await User.find(); // Obtiene todos los usuarios de la base de datos

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet( 'Usuarios' );

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Apellido Paterno', key: 'apellido_paterno', width: 20 },
      { header: 'Apellido Materno', key: 'apellido_materno', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Rol', key: 'rol', width: 15 },
      { header: 'Fecha de Nacimiento', key: 'fechaNacimiento', width: 15 },
      { header: 'Foto de Perfil', key: 'foto_perfil', width: 30 }
    ];

    // Agregar los datos al archivo Excel
    users.forEach( user => {
      worksheet.addRow( user );
    } );

    // Configurar respuesta HTTP para descargar el archivo
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader( 'Content-Disposition', `attachment; filename=${ fileName }` );

    // Enviar el archivo Excel como respuesta
    await workbook.xlsx.write( res );
    res.end();
  } catch ( error ) {
    console.error( 'Error al exportar a Excel:', error );
    res.status( 500 ).json( { msg: 'Error al generar el archivo Excel' } );
  }
};

// Exportar dispositivos a Excel
const exportDispositivos = async ( req, res, Dispositivo ) => {
  try {
    const dispositivos = await Dispositivo.find().populate( 'usuario_id', 'nombre email' );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet( 'Dispositivos' );

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'ID Dispositivo', key: 'dispositivo_id', width: 20 },
      { header: 'Usuario', key: 'usuario_nombre', width: 20 },
      { header: 'Email Usuario', key: 'usuario_email', width: 30 },
      { header: 'Ubicación', key: 'ubicacion', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Último Reporte', key: 'ultima_reporte', width: 20 }
    ];

    dispositivos.forEach( dispositivo => {
      worksheet.addRow( {
        _id: dispositivo._id,
        dispositivo_id: dispositivo.dispositivo_id,
        usuario_nombre: dispositivo.usuario_id?.nombre || 'No asignado',
        usuario_email: dispositivo.usuario_id?.email || 'No asignado',
        ubicacion: dispositivo.ubicacion,
        estado: dispositivo.estado,
        ultima_reporte: dispositivo.ultima_reporte
      } );
    } );

    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
    res.setHeader( 'Content-Disposition', 'attachment; filename=dispositivos.xlsx' );

    await workbook.xlsx.write( res );
    res.end();
  } catch ( error ) {
    console.error( 'Error al exportar dispositivos:', error );
    res.status( 500 ).json( { msg: 'Error al generar el archivo Excel' } );
  }
};

// Exportar alertas a Excel
const exportAlertas = async ( req, res, Alerta ) => {
  try {
    const alertas = await Alerta.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet( 'Alertas' );

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'Tipo de Sonido', key: 'tipo_sonido', width: 20 },
      { header: 'Fecha y Hora', key: 'fecha_hora', width: 20 },
      { header: 'Nivel de Sonido', key: 'nivel_sonido', width: 20 },
      { header: 'Texto Ícono', key: 'texto_icono', width: 20 },
      { header: 'ID Dispositivo', key: 'dispositivo_id', width: 30 },
      { header: 'Ubicación', key: 'ubicacion', width: 20 },
      { header: 'Notificación', key: 'notificacion', width: 15 }
    ];

    alertas.forEach( alerta => {
      worksheet.addRow( alerta );
    } );

    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
    res.setHeader( 'Content-Disposition', 'attachment; filename=alertas.xlsx' );

    await workbook.xlsx.write( res );
    res.end();
  } catch ( error ) {
    console.error( 'Error al exportar alertas:', error );
    res.status( 500 ).json( { msg: 'Error al generar el archivo Excel' } );
  }
};

module.exports = { importExcel, importarDispositivos, importarAlertas, exportExcel, exportDispositivos, exportAlertas };
