import React from 'react'
import {
  AppBar, Toolbar, Typography, Container, Tabs, Tab, Box, Stack,
  Snackbar, Alert,
} from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { AnimatePresence, motion } from 'framer-motion'

import Resumen from './pages/Resumen.jsx'
import Facturas from './pages/Facturas.jsx'

const TABS = ['Resumen', 'Facturas']

export default function App() {
  const [tab, setTab] = React.useState(0)
  const [toast, setToast] = React.useState(null)
  const notify = (msg, sev = 'success') => setToast({ msg, sev })

  return (
    <>
      <AppBar position="sticky" elevation={0}
        sx={{
          background: 'rgba(11,18,32,0.72)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)', boxShadow: 'none',
        }}>
        <Toolbar sx={{ py: 1.5, gap: 2 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: '13px', display: 'grid', placeItems: 'center',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            boxShadow: '0 6px 20px rgba(52,211,153,0.35)',
          }}>
            <ReceiptLongIcon sx={{ color: '#04221a' }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>Gastos del hogar</Typography>
            <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 2, fontSize: 10, textTransform: 'uppercase' }}>
              Stack · Anto
            </Typography>
          </Box>
        </Toolbar>
        <Container maxWidth="lg" sx={{ pb: 1.5 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            {TABS.map(t => <Tab key={t} label={t} />)}
          </Tabs>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            {tab === 0 && <Resumen />}
            {tab === 1 && <Facturas notify={notify} />}
          </motion.div>
        </AnimatePresence>
      </Container>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {toast && <Alert severity={toast.sev} variant="filled" onClose={() => setToast(null)}
          sx={{ borderRadius: 3 }}>{toast.msg}</Alert>}
      </Snackbar>
    </>
  )
}
