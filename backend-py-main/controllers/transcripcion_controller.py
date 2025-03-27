from flask import jsonify, request
from models.transcripcion import transcribir_audio

def procesar_transcripcion():
    if 'audio' not in request.files:
        return jsonify({"error": "No se envió ningún archivo de audio"}), 400

    audio_file = request.files['audio']
    audio_bytes = audio_file.read()

    # Obtener datos adicionales del request
    nivel_sonido = request.form.get("nivel_sonido", "Desconocido")
    dispositivo_id = request.form.get("dispositivo_id", "Desconocido")
    ubicacion = request.form.get("ubicacion", "Ubicación no especificada")

    transcripcion = transcribir_audio(audio_bytes, nivel_sonido, dispositivo_id, ubicacion)

    if "error" in transcripcion.lower():
        return jsonify({"error": transcripcion}), 500

    return jsonify({"texto": transcripcion, "mensaje": "Alerta guardada correctamente"})
