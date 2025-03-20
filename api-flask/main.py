import uvicorn
from fastapi import FastAPI
from routes import alerta  # Asegúrate de que esta importación sea correcta

app = FastAPI()

# Incluir el router de alertas
app.include_router(alerta.router, prefix="/api/alertas", tags=["Alertas"])

@app.get("/")
async def home():
    return {"message": "API de Alertas funcionando"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
