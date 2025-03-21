from flask import jsonify, request
from models.dispositivo import DispositivoModel  # Asegúrate de tener este modelo
import pandas as pd
from bson import ObjectId

# Agregar un dispositivo
def agregar_dispositivo():
    data = request.json
    DispositivoModel.agregar_dispositivo(data)
    return jsonify({"message": "Dispositivo agregado correctamente"}), 201

# Obtener todos los dispositivos
def obtener_dispositivos():
    dispositivos = DispositivoModel.obtener_todos_dispositivos()
    return jsonify(dispositivos)

# Obtener un dispositivo específico
def obtener_dispositivo(id):
    dispositivo = DispositivoModel.obtener_dispositivo(ObjectId(id))
    return jsonify(dispositivo) if dispositivo else jsonify({"message": "Dispositivo no encontrado"}), 404

# Actualizar un dispositivo
def actualizar_dispositivo(id):
    data = request.json
    result = DispositivoModel.actualizar_dispositivo(ObjectId(id), data)
    return jsonify({"message": "Dispositivo actualizado"}) if result.modified_count else jsonify({"message": "No se modificó nada"}), 400

# Eliminar un dispositivo
def eliminar_dispositivo(id):
    result = DispositivoModel.eliminar_dispositivo(ObjectId(id))
    return jsonify({"message": "Dispositivo eliminado"}) if result.deleted_count else jsonify({"message": "No se encontró el dispositivo"}), 404

# Importar dispositivos desde un archivo Excel
def importar_excel():
    file = request.files['file']
    df = pd.read_excel(file)
    data = df.to_dict(orient="records")
    mongo.db.dispositivos.insert_many(data)  # Asegúrate de que la colección sea "dispositivos"
    return jsonify({"message": "Datos importados correctamente"}), 201

# Exportar dispositivos a un archivo Excel
def exportar_excel():
    dispositivos = DispositivoModel.obtener_todos_dispositivos()
    df = pd.DataFrame(dispositivos)
    df.to_excel("dispositivos_exportados.xlsx", index=False)
    return jsonify({"message": "Archivo Excel exportado con éxito"}), 200
