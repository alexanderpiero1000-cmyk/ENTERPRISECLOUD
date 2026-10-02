import { useEffect, useState } from 'react'
import { listProveedores, listProductos, listCompras, createCompra } from '../../services/api'
import type { Proveedor, Producto, Compra } from '../../types'

// Elige proveedor y producto reales. Al guardar: sube el stock y se registra en el Kardex y Finanzas.
export default function ComprasPage() {
  const [provs, setProvs] = useState<Proveedor[]>([])
  const [prods, setProds] = useState<Producto[]>([])
  const [compras, setCompras] = useState<Compra[]>([])
  const [proveedorId, setProveedorId] = useState(0)
  const [productoId, setProductoId] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [costo, setCosto] = useState(0)

  const cargar = async () => {
    const [a, b, c] = await Promise.all([listProveedores(), listProductos(), listCompras()])
    setProvs(a); setProds(b); setCompras(c)
    setProveedorId(id => id || a[0]?.id || 0); setProductoId(id => id || b[0]?.id || 0)
  }
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (!proveedorId || !productoId || cantidad < 1) return
    await createCompra({ proveedorId, productoId, cantidad, costo }); setCosto(0); cargar()
  }

  return (
    <section>
      <h1>Compras</h1>
      <div className="card form">
        <label>Proveedor
          <select value={proveedorId} onChange={e => setProveedorId(Number(e.target.value))}>
            {provs.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </label>
        <label>Producto
          <select value={productoId} onChange={e => setProductoId(Number(e.target.value))}>
            {prods.map(p => <option key={p.id} value={p.id}>{p.nombre} (stock {p.stock})</option>)}
          </select>
        </label>
        <label>Cantidad<input type="number" min={1} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} /></label>
        <label>Costo unit. (S/)<input type="number" min={0} value={costo} onChange={e => setCosto(Number(e.target.value))} /></label>
        <button className="primary" onClick={guardar}>Registrar compra</button>
      </div>
      <div className="card tablewrap">
        <table>
          <thead><tr><th>N°</th><th>Fecha</th><th>Proveedor</th><th>Producto</th><th>Cant.</th><th>Total</th></tr></thead>
          <tbody>
            {[...compras].reverse().map(c => (
              <tr key={c.id}><td>{c.id}</td><td>{c.fecha}</td>
                <td>{provs.find(p => p.id === c.proveedorId)?.nombre}</td>
                <td>{prods.find(p => p.id === c.productoId)?.nombre}</td>
                <td>{c.cantidad}</td><td>S/ {(c.cantidad * c.costo).toLocaleString('es-PE')}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
