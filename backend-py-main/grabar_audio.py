import sounddevice as sd
import wave

# Parámetros de grabación
DURACION = 5  # Segundos
FREQ = 16000  # Frecuencia de muestreo

print("🎙 Grabando audio... Habla ahora.")

# Grabación
audio = sd.rec(int(DURACION * FREQ), samplerate=FREQ, channels=1, dtype='int16')
sd.wait()

# Guardar como archivo WAV
archivo_audio = "audio_prueba.wav"
with wave.open(archivo_audio, 'wb') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(FREQ)
    wf.writeframes(audio.tobytes())

print(f"Audio guardado como {archivo_audio}")
