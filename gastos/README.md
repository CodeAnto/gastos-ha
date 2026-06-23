# Gastos del hogar — Add-on de Home Assistant

Tracker de facturas comunes del hogar (luz, agua, gas, internet…), empaquetado como
add-on de Home Assistant con Ingress (acceso seguro con el login de HA).

## Qué hace
- **Resumen:** KPIs (pendiente, vencidas, pagado del mes, total del mes), próximo
  vencimiento y donuts (gasto por categoría · pagado vs pendiente).
- **Facturas:** alta rápida (tipo, empresa, monto, fecha de cobro, estado), filtros,
  marcar pagada/pendiente, semáforo de color y aviso de "vencida".

## Instalación
1. Home Assistant → **Ajustes → Add-ons → Tienda** → ⋮ → **Repositorios**
2. Añade: `https://github.com/CodeAnto/gastos-ha`
3. Instala **Gastos del hogar**, arranca y ábrelo (aparece en la barra lateral por Ingress).

## Datos
SQLite en `/data/gastos.db`, que Home Assistant persiste entre reinicios y actualizaciones.

## Puerto
- `5338` → acceso web directo (además del Ingress).
