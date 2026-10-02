import { useEffect, useState } from 'react'
import { listClientes, listProveedores, listVentas, listCompras } from '../../services/api'
import type { Cliente, Proveedor, Venta, Compra } from '../../types'

const money = (n: number) => `S/ ${n.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`

// Ingresos = Ventas, egresos = Compras. Todo sale de los otros módulos.
export default function FinanzasPage() {
  const [cl, setCl] = useState<Cliente[]>([]); const [pr, setPr] = useState<Proveedor[]>([])
  const [v, setV] = useState<Venta[]>([]); const [co, setCo] = useState<Compra[]>([])
  useEffect(() => { listClientes().then(setCl); listProveedores().then(setPr); listVentas().then(setV); listCompras().then(setCo) }, [])
  const ingresos = v.reduce((s, x) => s + x.total, 0)
  const egresos = co.reduce((s, x) => s + x.cantidad * x.costo, 0)
  return (
    <section>
      <h1>Finanzas</h1>
      <div className="stats">
        <div className="card stat"><span>Ingresos por ventas</span><strong>{money(ingresos)}</strong></div>
        <div className="card stat"><span>Egresos por compras</span><strong>{money(egresos)}</strong></div>
        <div className="card stat"><span>Utilidad bruta</span><strong>{money(ingresos - egresos)}</strong></div>
      </div>
      <div className="grid2">
        <div className="card">
          <h2>Ingresos por cliente</h2>
          {cl.map(c => <p key={c.id} className="row"><span>{c.nombre}</span><strong>{money(v.filter(x => x.clienteId === c.id).reduce((s, x) => s + x.total, 0))}</strong></p>)}
        </div>
        <div className="card">
          <h2>Egresos por proveedor</h2>
          {pr.map(p => <p key={p.id} className="row"><span>{p.nombre}</span><strong>{money(co.filter(x => x.proveedorId === p.id).reduce((s, x) => s + x.cantidad * x.costo, 0))}</strong></p>)}
        </div>
      </div>
    </section>
  )
}
