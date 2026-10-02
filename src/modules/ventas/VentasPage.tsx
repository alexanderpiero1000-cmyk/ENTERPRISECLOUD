import { useEffect, useState } from 'react'
import { listClientes, listProductos, listVentas, createVenta } from '../../services/api'
import type { Cliente, Producto, Venta, LineaVenta } from '../../types'

export default function VentasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [clienteId, setClienteId] = useState(0)
  const [productoId, setProductoId] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [carrito, setCarrito] = useState<LineaVenta[]>([])
  const [error, setError] = useState('')

  const cargar = async () => {
    const [c, p, v] = await Promise.all([listClientes(), listProductos(), listVentas()])
    setClientes(c); setProductos(p); setVentas(v)
    setClienteId(id => id || c[0]?.id || 0); setProductoId(id => id || p[0]?.id || 0)
  }
  useEffect(() => { cargar() }, [])

  const nombreProd = (id: number) => productos.find(p => p.id === id)?.nombre ?? id
  const total = carrito.reduce((s, i) => s + i.cantidad * i.precio, 0)

  const agregar = () => {
    const p = productos.find(x => x.id === productoId)
    if (p && cantidad > 0) setCarrito([...carrito, { productoId: p.id, cantidad, precio: p.precio }])
  }
  const registrar = async () => {
    try { setError(''); await createVenta(clienteId, carrito); setCarrito([]); cargar() }
    catch (e) { setError((e as Error).message) }
  }

  return (
    <section>
      <h1>Ventas</h1>
      <div className="card form">
        <label>Cliente
          <select value={clienteId} onChange={e => setClienteId(Number(e.target.value))}>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </label>
        <label>Producto
          <select value={productoId} onChange={e => setProductoId(Number(e.target.value))}>
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (stock {p.stock})</option>)}
          </select>
        </label>
        <label>Cantidad
          <input type="number" min={1} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
        </label>
        <button onClick={agregar}>Agregar línea</button>
      </div>

      {carrito.length > 0 && (
        <div className="card">
          {carrito.map((l, i) => <p key={i}>{l.cantidad} × {nombreProd(l.productoId)} — S/ {(l.cantidad * l.precio).toFixed(2)}</p>)}
          <p><strong>Total: S/ {total.toFixed(2)}</strong></p>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="primary" onClick={registrar}>Registrar venta</button>
        </div>
      )}

      <div className="card tablewrap">
        <table>
          <thead><tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th></tr></thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}><td>{v.id}</td><td>{v.fecha}</td>
                <td>{clientes.find(c => c.id === v.clienteId)?.nombre}</td><td>S/ {v.total.toFixed(2)}</td></tr>
            ))}
            {!ventas.length && <tr><td colSpan={4} className="empty">Aún no hay ventas. Arma una arriba y regístrala.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
