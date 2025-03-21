from config.database import mongo
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class UsuarioModel:
    @staticmethod
    def agregar_usuario(data):
        return mongo.db.users.insert_one(data)

    @staticmethod
    def obtener_todos_usuarios():
        return list(mongo.db.users.find({}, {"_id": 0}))

    @staticmethod
    def obtener_usuario(id):
        return mongo.db.users.find_one({"_id": id}, {"_id": 0})

    @staticmethod
    def actualizar_usuario(id, data):
        return mongo.db.users.update_one({"_id": id}, {"$set": data})

    @staticmethod
    def eliminar_usuario(id):
        return mongo.db.users.delete_one({"_id": id})
    
    def save(self):
        mongo.db.users.insert_one(self.__dict__)

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})

    def update(self):
        mongo.db.users.update_one({"email": self.email}, {"$set": self.__dict__})
