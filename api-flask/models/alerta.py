from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertaSchema(BaseModel):
    tipo_sonido: str
    fecha_hora: Optional[datetime] = datetime.utcnow()
    nivel_sonido: str
    texto_icono: str
    dispositivo_id: str
    ubicacion: str
    notificacion: str = "pendiente"
