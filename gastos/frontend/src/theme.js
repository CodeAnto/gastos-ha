import { createTheme } from '@mui/material/styles'

// === FINTECH DARK PREMIUM ===
// Recomendado por ui-ux-pro-max para finance dashboard: azul confianza + verde beneficio
// sobre azul noche profundo. Números monoespaciados tabulares. Status verde/ámbar/rojo.
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },   // azul confianza
    secondary: { main: '#22c55e', light: '#4ade80', dark: '#16a34a' }, // verde beneficio
    info: { main: '#60a5fa' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
    background: { default: '#020617', paper: 'rgba(25, 33, 52, 0.72)' },
    text: { primary: '#f8fafc', secondary: '#94a3b8' },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    // Números tabulares para que las columnas de € no bailen
    h1: { fontFamily: '"Inter", sans-serif', fontWeight: 700, letterSpacing: -1.5, fontFeatureSettings: '"tnum"' },
    h2: { fontFamily: '"Inter", sans-serif', fontWeight: 700, letterSpacing: -1 },
    h3: { fontFamily: '"Inter", sans-serif', fontWeight: 700, letterSpacing: -1 },
    h4: { fontFamily: '"Inter", sans-serif', fontWeight: 700, letterSpacing: -0.5 },
    h5: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
    overline: { letterSpacing: 1.4, fontWeight: 700, fontSize: 11, color: '#94a3b8' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: 'transparent !important' },
        // figuras tabulares globales para datos
        '.tnum': { fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 40px rgba(0,0,0,0.45)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 18 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: '#fff',
          boxShadow: '0 6px 20px rgba(59,130,246,0.28)',
          '&:hover': { background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: '#04210f', fontWeight: 700,
          boxShadow: '0 6px 20px rgba(34,197,94,0.25)',
          '&:hover': { background: 'linear-gradient(135deg, #4ade80, #22c55e)' },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', fontWeight: 600, fontSize: 14, minHeight: 40,
          borderRadius: 10, margin: '0 2px', color: '#94a3b8',
          '&.Mui-selected': { color: '#fff' },
        },
      },
    },
    MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3, background: '#3b82f6' } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12, background: 'rgba(255,255,255,0.03)',
          'input[type="date"]::-webkit-calendar-picker-indicator': { filter: 'invert(0.85)', cursor: 'pointer' },
          'input[type="date"]': { colorScheme: 'dark' },
        },
      },
    },
    MuiTableCell: { styleOverrides: { root: { borderColor: 'rgba(255,255,255,0.06)' } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
  },
})
