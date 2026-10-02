import { useEffect, useState } from 'react'
import { listMovimientos, listProductos } from '../../services/api'
import type { Movimiento, Producto } from '../../types'

// Historial de entradas (compras) y salidas (ventas) por producto.
export default function KardexPage() {
  const [movs, setMovs] = useState<Movimiento[]>([])
  const [prods, setProds] = useState<Producto[]>([])
  const [filtro, setFiltro] = useState(0)
  useEffect(() => { listMovimientos().then(setMovs); listProductos().then(setProds) }, [])
  const shown = [...movs].reverse().filter(m => !filtro || m.productoId === filtro)
  return (
    <section>
      <h1>Kardex</h1>
      <label className="card">Producto
        <select value={filtro} onChange={e => setFiltro(Number(e.target.value))}>
          <option value={0}>Todos</option>
          {prods.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </label>
      <div className="card tablewrap">
        <table>
          <thead><tr><th>Fecha</th><th>Producto</th><th>Movimiento</th><th>Cantidad</th><th>Origen</th></tr></thead>
          <tbody>
            {shown.map(m => (
              <tr key={m.id}><td>{m.fecha}</td><td>{prods.find(p => p.id === m.productoId)?.nombre}</td>
                <td className={m.tipo === 'entrada' ? 'in' : 'out'}>{m.tipo === 'entrada' ? 'Entrada' : 'Salida'}</td>
                <td>{m.cantidad}</td><td>{m.referencia}</td></tr>
            ))}
            {!shown.length && <tr><td colSpan={5} className="empty">Sin movimientos para este producto.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
