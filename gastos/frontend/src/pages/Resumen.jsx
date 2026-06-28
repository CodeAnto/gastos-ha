import React from 'react'
import { Box, Paper, Typography, Stack, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import { api } from '../api.js'
import { CATS, catColor, catLabel, catEmoji, eur } from '../categorias.js'
import Donut from '../components/Donut.jsx'

function Kpi({ label, value, sub, color = '#34d399', delay = 0 }) {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      sx={{ p: 2.5, height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: color, opacity: 0.9 }} />
      <Typography variant="overline" sx={{ opacity: 0.6 }}>{label}</Typography>
      <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: 28, lineHeight: 1.1, color }}>
        {value}
      </Typography>
      {sub && <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>{sub}</Typography>}
    </Paper>
  )
}

export default function Resumen() {
  const [r, setR] = React.useState(null)
  React.useEffect(() => { api.resumen().then(setR).catch(() => {}) }, [])

  if (!r) return <Typography sx={{ opacity: 0.6 }}>Cargando…</Typography>

  const donutCat = r.donut_categoria.map(d => ({
    label: catLabel(d.tipo), value: d.monto, color: catColor(d.tipo),
  }))
  const donutEstado = r.estado_split.map(d => ({
    label: d.estado === 'pagado' ? 'Pagado' : 'Pendiente',
    value: d.monto,
    color: d.estado === 'pagado' ? '#34d399' : '#fbbf24',
  }))
  const totalCat = r.donut_categoria.reduce((s, d) => s + d.monto, 0)

  return (
    <Stack spacing={3}>
      {/* KPIs */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Kpi label="Pendiente de pagar" value={eur(r.total_pendiente)}
               sub={`${r.n_pendientes} factura${r.n_pendientes === 1 ? '' : 's'}`} color="#fbbf24" delay={0} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Kpi label="Vencidas" value={eur(r.total_vencido)}
               sub={r.n_vencidas ? `${r.n_vencidas} sin pagar ⚠️` : 'al día 👍'}
               color={r.n_vencidas ? '#fb7185' : '#34d399'} delay={0.05} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Kpi label="Pagado este mes" value={eur(r.pagado_mes)} sub="salidas del mes" color="#34d399" delay={0.1} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Kpi label="Total del mes" value={eur(r.total_mes)} sub="facturas con cobro este mes" color="#60a5fa" delay={0.15} />
        </Grid>
      </Grid>

      {/* Próximo vencimiento */}
      {r.proximo && (
        <Paper sx={{ p: 2.5 }}
          component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <Box sx={{ fontSize: 30 }}>{catEmoji(r.proximo.tipo)}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ opacity: 0.6 }}>Próximo vencimiento</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {catLabel(r.proximo.tipo)} · {r.proximo.empresa}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                {r.proximo.fecha_cobro} · {r.proximo.dias === 0 ? 'hoy' : `en ${r.proximo.dias} día${r.proximo.dias === 1 ? '' : 's'}`}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: 22, color: '#f59e0b' }}>
              {eur(r.proximo.monto)}
            </Typography>
          </Stack>
        </Paper>
      )}

      {/* Donuts */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Gasto por categoría</Typography>
            <Donut data={donutCat} centerValue={eur(totalCat)} centerLabel="total" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Pagado vs pendiente</Typography>
            <Donut data={donutEstado}
                   centerValue={`${donutEstado[0].value + donutEstado[1].value > 0
                     ? Math.round(donutEstado[0].value / (donutEstado[0].value + donutEstado[1].value) * 100) : 0}%`}
                   centerLabel="pagado" />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}
