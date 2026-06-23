// Metadatos de cada categoría: etiqueta, emoji y color de acento (neón sobre oscuro).
export const CATS = {
  luz:       { label: 'Luz / Electricidad', emoji: '⚡', color: '#fbbf24' },
  agua:      { label: 'Agua',               emoji: '💧', color: '#60a5fa' },
  gas:       { label: 'Gas',                emoji: '🔥', color: '#fb7185' },
  internet:  { label: 'Internet',           emoji: '🌐', color: '#34d399' },
  movil:     { label: 'Móvil',              emoji: '📱', color: '#f472b6' },
  comunidad: { label: 'Comunidad',          emoji: '🏢', color: '#a78bfa' },
  seguro:    { label: 'Seguro',             emoji: '🛡️', color: '#2dd4bf' },
  otro:      { label: 'Otro',               emoji: '📄', color: '#94a3b8' },
}

export const catLabel = (t) => CATS[t]?.label || t
export const catEmoji = (t) => CATS[t]?.emoji || '📄'
export const catColor = (t) => CATS[t]?.color || '#94a3b8'

export const eur = (n) =>
  (Number(n) || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
