from config.database import mongo

class AlertaModel:
    @staticmethod
    def agregar_alerta(data):
        return mongo.db.alertas.insert_one(data)

    @staticmethod
    def obtener_todas_alertas():
        return list(mongo.db.alertas.find({}, {"_id": 0}))

    @staticmethod
    def obtener_alerta(id):
        return mongo.db.alertas.find_one({"_id": id}, {"_id": 0})

    @staticmethod
    def actualizar_alerta(id, data):
        return mongo.db.alertas.update_one({"_id": id}, {"$set": data})

    @staticmethod
    def eliminar_alerta(id):
        return mongo.db.alertas.delete_one({"_id": id})
