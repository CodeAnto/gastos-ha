import React from 'react'
import {
  Box, Paper, Typography, Stack, TextField, MenuItem, Button, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, ToggleButtonGroup, ToggleButton,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import UndoIcon from '@mui/icons-material/Undo'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../api.js'
import { CATS, catColor, catLabel, catEmoji, eur } from '../categorias.js'

const hoy = () => new Date().toISOString().slice(0, 10)
const emptyForm = () => ({ tipo: 'luz', empresa: '', monto: '', fecha_cobro: hoy(), estado: 'pendiente', notas: '' })

export default function Facturas({ notify }) {
  const [facturas, setFacturas] = React.useState([])
  const [form, setForm] = React.useState(emptyForm())
  const [filtroEstado, setFiltroEstado] = React.useState('')
  const [filtroTipo, setFiltroTipo] = React.useState('')

  const load = () => api.facturas({ estado: filtroEstado, tipo: filtroTipo }).then(setFacturas).catch(() => {})
  React.useEffect(() => { load() }, [filtroEstado, filtroTipo])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.empresa || !form.monto) { notify('Pon empresa y monto', 'warning'); return }
    try {
      await api.crear({ ...form, monto: Number(form.monto) })
      notify('Factura guardada')
      setForm(emptyForm())
      load()
    } catch (err) { notify(`Error: ${err.message}`, 'error') }
  }

  const togglePagado = async (f) => {
    const nuevo = f.estado === 'pagado' ? 'pendiente' : 'pagado'
    await api.actualizar(f.id, { estado: nuevo })
    load()
  }

  const borrar = async (id) => {
    if (!confirm('¿Borrar esta factura?')) return
    await api.borrar(id)
    load()
  }

  const venc = (f) => f.estado === 'pendiente' && f.fecha_cobro && f.fecha_cobro < hoy()

  return (
    <Stack spacing={3}>
      {/* Alta */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Nueva factura</Typography>
        <Box component="form" onSubmit={submit}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField select fullWidth label="Tipo" value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}>
                {Object.entries(CATS).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v.emoji} {v.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Empresa" value={form.empresa}
                onChange={e => setForm({ ...form, empresa: e.target.value })} placeholder="Iberdrola, Movistar…" />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField fullWidth label="Monto (€)" type="number" value={form.monto}
                onChange={e => setForm({ ...form, monto: e.target.value })} inputProps={{ step: 0.01 }} />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField fullWidth label="Fecha de cobro" type="date" value={form.fecha_cobro}
                onChange={e => setForm({ ...form, fecha_cobro: e.target.value })} sx={{ minWidth: 160 }} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField select fullWidth label="Estado" value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="pagado">Pagado</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                <Button type="submit" variant="contained" startIcon={<AddIcon />}
                  sx={{ height: 48, px: 4 }}>
                  Añadir factura
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Filtros + tabla */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Facturas</Typography>
          <ToggleButtonGroup size="small" exclusive value={filtroEstado}
            onChange={(_, v) => setFiltroEstado(v ?? '')}>
            <ToggleButton value="">Todas</ToggleButton>
            <ToggleButton value="pendiente">Pendientes</ToggleButton>
            <ToggleButton value="pagado">Pagadas</ToggleButton>
          </ToggleButtonGroup>
          <TextField select size="small" label="Tipo" value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(CATS).map(([k, v]) => <MenuItem key={k} value={k}>{v.emoji} {v.label}</MenuItem>)}
          </TextField>
        </Stack>

        {facturas.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center', opacity: 0.5 }}>No hay facturas con este filtro.</Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Fecha de cobro</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {facturas.map(f => (
                  <TableRow key={f.id} hover component={motion.tr}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span style={{ fontSize: 18 }}>{catEmoji(f.tipo)}</span>
                        <span style={{ color: catColor(f.tipo), fontWeight: 600 }}>{catLabel(f.tipo)}</span>
                      </Stack>
                    </TableCell>
                    <TableCell>{f.empresa}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>{f.fecha_cobro}</span>
                        {venc(f) && <Chip size="small" label="vencida" color="error" variant="outlined" />}
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: '"JetBrains Mono"', fontWeight: 700 }}>
                      {eur(f.monto)}
                    </TableCell>
                    <TableCell>
                      <Chip size="small"
                        label={f.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                        sx={{
                          fontWeight: 700,
                          color: f.estado === 'pagado' ? '#04221a' : '#3a2c05',
                          background: f.estado === 'pagado' ? '#34d399' : '#fbbf24',
                        }} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={f.estado === 'pagado' ? 'Marcar pendiente' : 'Marcar pagada'}>
                        <IconButton size="small" onClick={() => togglePagado(f)}
                          sx={{ color: f.estado === 'pagado' ? '#fbbf24' : '#34d399' }}>
                          {f.estado === 'pagado' ? <UndoIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" onClick={() => borrar(f.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  )
}
