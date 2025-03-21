from bson import ObjectId
from config.database import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class UsuarioModel:
    @staticmethod
    def agregar_usuario(data):
        return mongo.db.users.insert_one(data)

    @staticmethod
    def obtener_todos_usuarios():
        usuarios = list(mongo.db.users.find({}))  # No excluyas el _id aquí
        for usuario in usuarios:
            usuario["_id"] = str(usuario["_id"])  # Convierte el _id a string
        return usuarios


    @staticmethod
    def obtener_usuario(id):
        try:
            object_id = ObjectId(id)
            usuario = mongo.db.users.find_one({"_id": object_id})
            if usuario:
                usuario["_id"] = str(usuario["_id"])  # Convertir ObjectId a string
            return usuario
        except:
            return None


    @staticmethod
    def actualizar_usuario(id, data):
        try:
            object_id = ObjectId(id)  # Convertir a ObjectId
            result = mongo.db.users.update_one({"_id": object_id}, {"$set": data})

            # Verificar si se hizo alguna actualización
            if result.matched_count == 0:
                return {"message": "Usuario no encontrado", "success": False}
            if result.modified_count == 0:
                return {"message": "No hubo cambios en los datos", "success": False}

            return {"message": "Usuario actualizado", "success": True}
        except Exception as e:
            print(f"Error al actualizar usuario: {e}")  # Agregar logs de error
            return {"message": "Error al procesar la solicitud", "error": str(e), "success": False}




    @staticmethod
    def eliminar_usuario(id):
        try:
            object_id = ObjectId(id)  # Convertir a ObjectId
            return mongo.db.users.delete_one({"_id": object_id})
        except:
            return None  # Retorna None si el ID no es válido
    
    def save(self):
        mongo.db.users.insert_one(self.__dict__)

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})

    def update(self):
        mongo.db.users.update_one({"email": self.email}, {"$set": self.__dict__})
