from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def agregar_alerta():
    return {"message": "Alerta agregada"}

@router.get("/")
async def obtener_alertas():
    return {"message": "Lista de alertas"}

@router.get("/{id}")
async def obtener_alerta(id: str):
    return {"message": f"Detalles de alerta {id}"}

@router.put("/{id}")
async def actualizar_alerta(id: str):
    return {"message": f"Alerta {id} actualizada"}

@router.delete("/{id}")
async def eliminar_alerta(id: str):
    return {"message": f"Alerta {id} eliminada"}

@router.post("/import-excel")
async def importar_excel():
    return {"message": "Excel importado"}

@router.get("/export-excel")
async def exportar_excel():
    return {"message": "Excel exportado"}
