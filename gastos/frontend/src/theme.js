import { createTheme } from '@mui/material/styles'

// Tema OSCURO premium inspirado en las referencias 4 y 5 (azul marino casi negro + acentos neón).
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },   // verde menta
    secondary: { main: '#f472b6', light: '#f9a8d4', dark: '#ec4899' }, // rosa fucsia
    info: { main: '#60a5fa' },
    warning: { main: '#fbbf24' },
    error: { main: '#fb7185' },
    success: { main: '#34d399' },
    background: { default: '#0b1220', paper: 'rgba(17, 25, 40, 0.7)' },
    text: { primary: '#e8edf5', secondary: 'rgba(232,237,245,0.55)' },
    divider: 'rgba(255,255,255,0.07)',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: -1.5 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: -1 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: -1 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: -0.5 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
    overline: { letterSpacing: 1.5, fontWeight: 700, fontSize: 11 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: 'transparent !important' } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 18 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #34d399, #10b981)',
          color: '#04221a',
          fontWeight: 700,
          boxShadow: '0 6px 20px rgba(52,211,153,0.25)',
          '&:hover': { background: 'linear-gradient(135deg, #6ee7b7, #34d399)' },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', fontWeight: 600, fontSize: 14, minHeight: 40,
          borderRadius: 10, margin: '0 2px', color: 'rgba(232,237,245,0.5)',
          '&.Mui-selected': { color: '#fff' },
        },
      },
    },
    MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3, background: '#34d399' } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12, background: 'rgba(255,255,255,0.03)',
          'input[type="date"]::-webkit-calendar-picker-indicator': { filter: 'invert(0.85)', cursor: 'pointer' },
          'input[type="date"]': { colorScheme: 'dark' },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
  },
})
