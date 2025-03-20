from flask import jsonify, request
from models.alerta import AlertaModel
import pandas as pd
from bson import ObjectId

# Agregar una alerta
def agregar_alerta():
    data = request.json
    AlertaModel.agregar_alerta(data)
    return jsonify({"message": "Alerta agregada correctamente"}), 201

# Obtener todas las alertas
def obtener_alertas():
    alertas = AlertaModel.obtener_todas_alertas()
    return jsonify(alertas)

# Obtener una alerta específica
def obtener_alerta(id):
    alerta = AlertaModel.obtener_alerta(ObjectId(id))
    return jsonify(alerta) if alerta else jsonify({"message": "Alerta no encontrada"}), 404

# Actualizar una alerta
def actualizar_alerta(id):
    data = request.json
    result = AlertaModel.actualizar_alerta(ObjectId(id), data)
    return jsonify({"message": "Alerta actualizada"}) if result.modified_count else jsonify({"message": "No se modificó nada"}), 400

# Eliminar una alerta
def eliminar_alerta(id):
    result = AlertaModel.eliminar_alerta(ObjectId(id))
    return jsonify({"message": "Alerta eliminada"}) if result.deleted_count else jsonify({"message": "No se encontró la alerta"}), 404

# Importar alertas desde un archivo Excel
def importar_excel():
    file = request.files['file']
    df = pd.read_excel(file)
    data = df.to_dict(orient="records")
    mongo.db.alertas.insert_many(data)
    return jsonify({"message": "Datos importados correctamente"}), 201

# Exportar alertas a un archivo Excel
def exportar_excel():
    alertas = AlertaModel.obtener_todas_alertas()
    df = pd.DataFrame(alertas)
    df.to_excel("alertas_exportadas.xlsx", index=False)
    return jsonify({"message": "Archivo Excel exportado con éxito"}), 200
