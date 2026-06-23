const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8338'

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return res.json()
}

export const api = {
  meta: () => req('/meta'),
  facturas: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    return req(`/facturas${q ? `?${q}` : ''}`)
  },
  crear: (data) => req('/facturas', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id, data) => req(`/facturas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  borrar: (id) => req(`/facturas/${id}`, { method: 'DELETE' }),
  resumen: () => req('/stats/resumen'),
}
