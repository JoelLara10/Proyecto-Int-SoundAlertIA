from flask import Blueprint
from controllers.transcripcion_controller import procesar_transcripcion

transcripcion_routes = Blueprint("transcripcion_routes", __name__)

transcripcion_routes.route('/transcribir', methods=['POST'])(procesar_transcripcion)
