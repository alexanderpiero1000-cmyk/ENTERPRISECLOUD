import { useEffect, useState } from 'react'
import { listClientes, listProductos, listVentas, listCompras } from '../../services/api'
import type { Cliente, Producto, Venta, Compra } from '../../types'

const money = (n: number) => `S/ ${n.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`

export default function DashboardPage() {
  const [c, setC] = useState<Cliente[]>([]); const [p, setP] = useState<Producto[]>([])
  const [v, setV] = useState<Venta[]>([]); const [co, setCo] = useState<Compra[]>([])
  useEffect(() => { listClientes().then(setC); listProductos().then(setP); listVentas().then(setV); listCompras().then(setCo) }, [])

  const totalVentas = v.reduce((s, x) => s + x.total, 0)
  const totalCompras = co.reduce((s, x) => s + x.cantidad * x.costo, 0)
  const critico = p.filter(x => x.stock < 10)
  const stats: [string, string][] = [
    ['Ventas acumuladas', money(totalVentas)],
    ['Compras acumuladas', money(totalCompras)],
    ['Utilidad bruta (ventas − compras)', money(totalVentas - totalCompras)],
    ['Pedidos registrados', String(v.length)],
    ['Ticket promedio', money(v.length ? totalVentas / v.length : 0)],
    ['Clientes activos', String(c.length)],
    ['Valor del inventario', money(p.reduce((s, x) => s + x.precio * x.stock, 0))],
  ]

  const porMes: Record<string, number> = {}
  v.forEach(x => { const k = x.fecha.slice(0, 7); porMes[k] = (porMes[k] ?? 0) + x.total })
  const meses = Object.entries(porMes).sort().slice(-6)
  const max = Math.max(1, ...meses.map(m => m[1]))

  const unidades: Record<number, number> = {}
  v.forEach(x => x.items.forEach(i => { unidades[i.productoId] = (unidades[i.productoId] ?? 0) + i.cantidad }))
  const top = Object.entries(unidades).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const nombreProd = (id: number) => p.find(x => x.id === id)?.nombre ?? id
  const ultimas = [...v].reverse().slice(0, 6)

  return (
    <section>
      <h1>Dashboard</h1>
      <div className="stats">{stats.map(([l, val]) => <div className="card stat" key={l}><span>{l}</span><strong>{val}</strong></div>)}</div>

      <div className="grid2">
        <div className="card">
          <h2>Ventas por mes</h2>
          <div className="bars">
            {meses.map(([m, t]) => (
              <div key={m} className="bar"><em>{money(t)}</em><i style={{ height: `${(t / max) * 130}px` }} /><span>{m}</span></div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2>Productos más vendidos</h2>
          {top.map(([id, u]) => <p key={id} className="row"><span>{nombreProd(Number(id))}</span><strong>{u} uds</strong></p>)}
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h2>Stock crítico (menos de 10 unidades)</h2>
          {critico.length ? critico.map(x => <p key={x.id} className="row warn"><span>{x.nombre}</span><strong>{x.stock}</strong></p>) : <p className="empty">Todo el stock está en niveles normales.</p>}
        </div>
        <div className="card">
          <h2>Últimas ventas</h2>
          {ultimas.map(x => <p key={x.id} className="row"><span>{x.fecha} · {c.find(k => k.id === x.clienteId)?.nombre}</span><strong>{money(x.total)}</strong></p>)}
        </div>
      </div>
    </section>
  )
}
