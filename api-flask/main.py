from flask import Flask
from flask_cors import CORS
from routes.alerta import alerta_routes
from config.database import mongo

app = Flask(__name__)
CORS(app)  # Permite peticiones desde el frontend

# Configuración de MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/SoundAlertIA"
mongo.init_app(app)

# Registrar las rutas de alertas
app.register_blueprint(alerta_routes, url_prefix="/api/alertas")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
