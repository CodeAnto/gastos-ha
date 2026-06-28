import React from 'react'
import { Box, Stack, Typography } from '@mui/material'

// Donut SVG ligero (sin librerías). data: [{ label, value, color }]
export default function Donut({ data = [], size = 180, thickness = 22, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0)
  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r

  let offset = 0
  const segments = total > 0 ? data.filter(d => d.value > 0).map((d) => {
    const frac = d.value / total
    const seg = { ...d, dash: frac * circ, gap: circ - frac * circ, off: offset }
    offset += frac * circ
    return seg
  }) : []

  return (
    <Stack direction="row" spacing={2.5} alignItems="center" flexWrap="wrap">
      <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={thickness}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.off}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray .6s ease, stroke-dashoffset .6s ease' }}
            />
          ))}
        </svg>
        <Box sx={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center',
        }}>
          <Box>
            <Typography sx={{ fontFamily: '"Inter"', fontWeight: 700, fontSize: 22, lineHeight: 1 }}>
              {centerValue}
            </Typography>
            {centerLabel && (
              <Typography variant="caption" sx={{ opacity: 0.55, textTransform: 'uppercase', letterSpacing: 1 }}>
                {centerLabel}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Stack spacing={0.8} sx={{ minWidth: 130 }}>
        {data.filter(d => d.value > 0).map((d, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 10, height: 10, borderRadius: '3px', background: d.color, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>{d.label}</Typography>
            <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono"', opacity: 0.85 }}>
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </Typography>
          </Stack>
        ))}
        {total === 0 && <Typography variant="body2" sx={{ opacity: 0.5 }}>Sin datos todavía</Typography>}
      </Stack>
    </Stack>
  )
}
