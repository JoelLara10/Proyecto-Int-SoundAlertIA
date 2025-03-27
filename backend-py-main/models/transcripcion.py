from google.cloud import speech
from config.database import mongo
from datetime import datetime

def transcribir_audio(audio_bytes, nivel_sonido, dispositivo_id, ubicacion):
    try:
        client = speech.SpeechClient()
        audio = speech.RecognitionAudio(content=audio_bytes)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="es-MX"
        )

        response = client.recognize(config=config, audio=audio)

        transcripcion = " ".join(result.alternatives[0].transcript for result in response.results)

        if not transcripcion.strip():
            return "No se pudo transcribir el audio."

        # Crear la alerta en MongoDB
        nueva_alerta = {
            "tipo_sonido": transcripcion.strip(),
            "fecha_hora": datetime.utcnow(),
            "nivel_sonido": nivel_sonido,
            "texto_icono": "🔊",
            "dispositivo_id": dispositivo_id,
            "ubicacion": ubicacion,
            "notificacion": "pendiente"
        }
        mongo.db.alertas.insert_one(nueva_alerta)

        return transcripcion.strip()

    except Exception as e:
        return str(e)
