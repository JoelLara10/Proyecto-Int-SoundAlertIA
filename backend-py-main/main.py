from flask import Flask
from flask_cors import CORS
from routes.alerta import alerta_routes
from config.database import mongo
from routes.dispositivo import dispositivo_routes
from routes.usuario import usuario_routes
from routes.auth import auth_routes
from routes.transcripcion import transcripcion_routes
from google.cloud import speech
from google.oauth2 import service_account
import os

app = Flask(__name__)
CORS(app)  # Permite peticiones desde el frontend




cred_path = os.path.join(os.path.dirname(__file__), "key.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = cred_path

credentials = service_account.Credentials.from_service_account_file(cred_path)
client = speech.SpeechClient(credentials=credentials)



# Configuración de MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/SoundAlertIA"
#app.config["MONGO_URI"] = "mongodb+srv://admin:Joel1234@soundalertia.fuoti.mongodb.net/?retryWrites=true&w=majority&appName=SoundAlertIA"
mongo.init_app(app)

# Registrar las rutas de alertas
app.register_blueprint(alerta_routes, url_prefix="/api/alertas")

app.register_blueprint(dispositivo_routes, url_prefix="/api/dispositivos")

app.register_blueprint(usuario_routes, url_prefix="/api/usuarios")

app.register_blueprint(auth_routes, url_prefix="/api/auth")

app.register_blueprint(transcripcion_routes, url_prefix="/api")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
