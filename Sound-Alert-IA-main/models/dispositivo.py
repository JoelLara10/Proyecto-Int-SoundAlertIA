from config.database import mongo

class DispositivoModel:
    @staticmethod
    def agregar_dispositivo(data):
        return mongo.db.dispositivos.insert_one(data)

    @staticmethod
    def obtener_todos_dispositivos():
        return list(mongo.db.dispositivos.find({}, {"_id": 0}))

    @staticmethod
    def obtener_dispositivo(id):
        return mongo.db.dispositivos.find_one({"_id": id}, {"_id": 0})

    @staticmethod
    def actualizar_dispositivo(id, data):
        return mongo.db.dispositivos.update_one({"_id": id}, {"$set": data})

    @staticmethod
    def eliminar_dispositivo(id):
        return mongo.db.dispositivos.delete_one({"_id": id})
