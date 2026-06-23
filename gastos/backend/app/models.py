from datetime import date, datetime
from typing import Optional
from sqlmodel import SQLModel, Field


# Categorías de servicios del hogar (ampliable a futuro).
# El frontend usa estos mismos slugs para iconos y colores.
CATEGORIAS = [
    "luz",        # electricidad
    "agua",
    "gas",
    "internet",
    "movil",
    "comunidad",
    "seguro",
    "otro",
]

ESTADOS = ["pendiente", "pagado"]


class Factura(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tipo: str = Field(index=True)              # uno de CATEGORIAS
    empresa: str
    monto: float
    fecha_cobro: date                          # fecha de cobro / vencimiento
    estado: str = Field(default="pendiente")   # pendiente | pagado
    fecha_pago: Optional[date] = None          # cuándo se marcó pagada
    notas: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
