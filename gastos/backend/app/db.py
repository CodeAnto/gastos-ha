import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text

DB_PATH = os.environ.get("DB_PATH", "/data/gastos.db")
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})


def _existing_columns(conn, table: str) -> set[str]:
    rows = conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
    return {r[1] for r in rows}


def _migrate(conn) -> None:
    """Migraciones ligeras idempotentes (preparado para que el modelo evolucione)."""
    cols = _existing_columns(conn, "factura")
    if cols:
        if "fecha_pago" not in cols:
            conn.execute(text("ALTER TABLE factura ADD COLUMN fecha_pago DATE"))
        if "notas" not in cols:
            conn.execute(text("ALTER TABLE factura ADD COLUMN notas VARCHAR"))


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    with engine.begin() as conn:
        _migrate(conn)


def get_session():
    with Session(engine) as session:
        yield session
