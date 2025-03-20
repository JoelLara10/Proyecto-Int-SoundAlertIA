from database import db
from models.alerta import AlertaSchema

async def crear_alerta(alerta: AlertaSchema):
    nueva_alerta = alerta.dict()
    resultado = await db.alertas.insert_one(nueva_alerta)
    return str(resultado.inserted_id)

async def obtener_alertas():
    return await db.alertas.find().to_list(100)

async def obtener_alerta(id):
    return await db.alertas.find_one({"_id": id})

async def eliminar_alerta(id):
    return await db.alertas.delete_one({"_id": id})
