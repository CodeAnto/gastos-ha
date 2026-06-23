from datetime import date, datetime
from collections import defaultdict
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select

from .db import init_db, get_session
from .models import Factura, CATEGORIAS, ESTADOS

app = FastAPI(title="Gastos del hogar — stack-anto", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    init_db()


# ---------- Schemas ----------
class FacturaIn(BaseModel):
    tipo: str
    empresa: str
    monto: float
    fecha_cobro: date
    estado: str = "pendiente"
    fecha_pago: Optional[date] = None
    notas: Optional[str] = None


class FacturaPatch(BaseModel):
    tipo: Optional[str] = None
    empresa: Optional[str] = None
    monto: Optional[float] = None
    fecha_cobro: Optional[date] = None
    estado: Optional[str] = None
    fecha_pago: Optional[date] = None
    notas: Optional[str] = None


# ---------- Meta ----------
@app.get("/meta")
def meta():
    return {"categorias": CATEGORIAS, "estados": ESTADOS}


# ---------- Facturas ----------
@app.get("/facturas")
def listar(
    tipo: Optional[str] = None,
    estado: Optional[str] = None,
    mes: Optional[str] = None,  # formato YYYY-MM (filtra por fecha_cobro)
    session: Session = Depends(get_session),
):
    q = select(Factura)
    if tipo:
        q = q.where(Factura.tipo == tipo)
    if estado:
        q = q.where(Factura.estado == estado)
    rows = session.exec(q).all()
    if mes:
        rows = [f for f in rows if f.fecha_cobro and f.fecha_cobro.strftime("%Y-%m") == mes]
    rows.sort(key=lambda f: (f.fecha_cobro or date.min), reverse=True)
    return rows


@app.post("/facturas")
def crear(data: FacturaIn, session: Session = Depends(get_session)):
    if data.tipo not in CATEGORIAS:
        raise HTTPException(400, f"tipo inválido: {data.tipo}")
    if data.estado not in ESTADOS:
        raise HTTPException(400, f"estado inválido: {data.estado}")
    f = Factura(**data.model_dump())
    if f.estado == "pagado" and not f.fecha_pago:
        f.fecha_pago = date.today()
    session.add(f)
    session.commit()
    session.refresh(f)
    return f


@app.patch("/facturas/{fid}")
def actualizar(fid: int, data: FacturaPatch, session: Session = Depends(get_session)):
    f = session.get(Factura, fid)
    if not f:
        raise HTTPException(404, "factura no encontrada")
    payload = data.model_dump(exclude_unset=True)
    for k, v in payload.items():
        setattr(f, k, v)
    # Si pasa a pagado y no tiene fecha_pago, ponemos hoy. Si vuelve a pendiente, la limpiamos.
    if f.estado == "pagado" and not f.fecha_pago:
        f.fecha_pago = date.today()
    if f.estado == "pendiente":
        f.fecha_pago = None
    session.add(f)
    session.commit()
    session.refresh(f)
    return f


@app.delete("/facturas/{fid}")
def borrar(fid: int, session: Session = Depends(get_session)):
    f = session.get(Factura, fid)
    if not f:
        raise HTTPException(404, "factura no encontrada")
    session.delete(f)
    session.commit()
    return {"ok": True}


# ---------- Resumen / stats ----------
@app.get("/stats/resumen")
def resumen(session: Session = Depends(get_session)):
    facturas = session.exec(select(Factura)).all()
    hoy = date.today()
    mes_actual = hoy.strftime("%Y-%m")

    total_pendiente = sum(f.monto for f in facturas if f.estado == "pendiente")
    n_pendientes = sum(1 for f in facturas if f.estado == "pendiente")

    pagado_mes = sum(
        f.monto for f in facturas
        if f.estado == "pagado" and f.fecha_pago and f.fecha_pago.strftime("%Y-%m") == mes_actual
    )
    total_mes = sum(
        f.monto for f in facturas
        if f.fecha_cobro and f.fecha_cobro.strftime("%Y-%m") == mes_actual
    )

    # Facturas vencidas (pendientes con fecha de cobro pasada)
    vencidas = [
        f for f in facturas
        if f.estado == "pendiente" and f.fecha_cobro and f.fecha_cobro < hoy
    ]
    total_vencido = sum(f.monto for f in vencidas)

    # Próximo vencimiento pendiente (a partir de hoy)
    futuras = sorted(
        [f for f in facturas if f.estado == "pendiente" and f.fecha_cobro and f.fecha_cobro >= hoy],
        key=lambda f: f.fecha_cobro,
    )
    proximo = None
    if futuras:
        nf = futuras[0]
        proximo = {
            "tipo": nf.tipo, "empresa": nf.empresa, "monto": nf.monto,
            "fecha_cobro": nf.fecha_cobro.isoformat(),
            "dias": (nf.fecha_cobro - hoy).days,
        }

    # Donut: gasto por categoría (suma de todas las facturas registradas)
    por_categoria = defaultdict(float)
    for f in facturas:
        por_categoria[f.tipo] += f.monto
    donut_categoria = [
        {"tipo": k, "monto": round(v, 2)}
        for k, v in sorted(por_categoria.items(), key=lambda kv: kv[1], reverse=True)
    ]

    # Donut secundario: pagado vs pendiente (importe)
    pagado_total = sum(f.monto for f in facturas if f.estado == "pagado")
    estado_split = [
        {"estado": "pagado", "monto": round(pagado_total, 2)},
        {"estado": "pendiente", "monto": round(total_pendiente, 2)},
    ]

    # Serie por mes (últimos 6 meses) para futura gráfica de barras
    por_mes = defaultdict(float)
    for f in facturas:
        if f.fecha_cobro:
            por_mes[f.fecha_cobro.strftime("%Y-%m")] += f.monto
    serie_mes = [{"mes": k, "monto": round(v, 2)} for k, v in sorted(por_mes.items())][-6:]

    return {
        "total_pendiente": round(total_pendiente, 2),
        "n_pendientes": n_pendientes,
        "pagado_mes": round(pagado_mes, 2),
        "total_mes": round(total_mes, 2),
        "total_vencido": round(total_vencido, 2),
        "n_vencidas": len(vencidas),
        "proximo": proximo,
        "donut_categoria": donut_categoria,
        "estado_split": estado_split,
        "serie_mes": serie_mes,
        "n_total": len(facturas),
    }


# ---------- Backup ----------
@app.get("/backup/export")
def exportar(session: Session = Depends(get_session)):
    facturas = session.exec(select(Factura)).all()
    return {"version": 1, "exported_at": datetime.utcnow().isoformat(), "facturas": facturas}
