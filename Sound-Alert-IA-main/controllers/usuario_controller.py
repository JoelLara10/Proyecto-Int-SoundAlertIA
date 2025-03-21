from flask import jsonify, request
from models.usuario import UsuarioModel
import pandas as pd
from bson import ObjectId

# Agregar un usuario
def agregar_usuario():
    data = request.json
    UsuarioModel.agregar_usuario(data)
    return jsonify({"message": "Usuario agregado correctamente"}), 201

# Obtener todos los usuarios
def obtener_usuarios():
    usuarios = UsuarioModel.obtener_todos_usuarios()
    return jsonify(usuarios)

# Obtener un usuario específico
def obtener_usuario(id):
    usuario = UsuarioModel.obtener_usuario(ObjectId(id))
    return jsonify(usuario) if usuario else jsonify({"message": "Usuario no encontrado"}), 404

# Actualizar un usuario
def actualizar_usuario(id):
    data = request.json
    result = UsuarioModel.actualizar_usuario(ObjectId(id), data)
    return jsonify({"message": "Usuario actualizado"}) if result.modified_count else jsonify({"message": "No se modificó nada"}), 400

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
