from flask import jsonify, request
from models.usuario import UsuarioModel
import pandas as pd
from bson import ObjectId

# Agregar un usuario
def agregar_usuario():
    data = request.json
    UsuarioModel.agregar_usuario(data)
    return jsonify({"message": "Usuario agregado correctamente"}), 201

def obtener_usuarios():
    usuarios = UsuarioModel.obtener_todos_usuarios()
    
    # Asegurarse de que cada usuario tiene _id antes de convertirlo
    for usuario in usuarios:
        if "_id" in usuario:
            usuario["_id"] = str(usuario["_id"])
    
    return jsonify(usuarios)

# Obtener un usuario específico
def obtener_usuario(id):
    usuario = UsuarioModel.obtener_usuario(id)
    
    if usuario:
        usuario['_id'] = str(usuario['_id'])  # Convertir ObjectId a string
        return jsonify(usuario)
    
    return jsonify({"message": "Usuario no encontrado"}), 404

def actualizar_usuario(id):
    data = request.json
    try:
        # Convertir id a ObjectId si es necesario
        object_id = ObjectId(id)
        result = UsuarioModel.actualizar_usuario(object_id, data)

        # Si se actualizó correctamente, o si no hubo cambios, se responde apropiadamente
        if result["success"]:
            return jsonify({"message": result["message"]}), 200  # Usuario actualizado o no hubo cambios
        else:
            return jsonify({"message": result["message"]}), 400  # Error de actualización o no se encontraron cambios
    except Exception as e:
        return jsonify({"message": "Error al procesar la solicitud", "error": str(e)}), 500



# Eliminar un usuario
def eliminar_usuario(id):
    result = UsuarioModel.eliminar_usuario(ObjectId(id))
    return jsonify({"message": "Usuario eliminado"}) if result.deleted_count else jsonify({"message": "No se encontró el usuario"}), 404

# Importar usuarios desde un archivo Excel
def importar_excel():
    file = request.files['file']
    df = pd.read_excel(file)
    data = df.to_dict(orient="records")
    mongo.db.users.insert_many(data)  # Ahora usa la colección "users"
    return jsonify({"message": "Datos importados correctamente"}), 201

# Exportar usuarios a un archivo Excel
def exportar_excel():
    usuarios = UsuarioModel.obtener_todos_usuarios()
    df = pd.DataFrame(usuarios)
    df.to_excel("users_exportados.xlsx", index=False)
    return jsonify({"message": "Archivo Excel exportado con éxito"}), 200
