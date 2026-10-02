import { useEffect, useState } from 'react'
import Crud from '../../components/Crud'
import { listProductos, createProducto, listMovimientos } from '../../services/api'
import type { Producto, Movimiento } from '../../types'

// Conectado con Ventas y Compras a través del kardex.
export default function InventarioPage() {
  const [movs, setMovs] = useState<Movimiento[]>([])
  useEffect(() => { listMovimientos().then(setMovs) }, [])
  const suma = (p: Producto, tipo: Movimiento['tipo']) =>
    movs.filter(m => m.productoId === p.id && m.tipo === tipo).reduce((s, m) => s + m.cantidad, 0)
  return (
    <Crud<Producto> title="Inventario" load={listProductos} create={createProducto}
      extraCols={[
        { label: 'Comprado', value: p => String(suma(p, 'entrada')) },
        { label: 'Vendido', value: p => String(suma(p, 'salida')) },
      ]}
      fields={[
        { key: 'nombre', label: 'Producto' }, { key: 'categoria', label: 'Categoría' },
        { key: 'precio', label: 'Precio (S/)', type: 'number' }, { key: 'stock', label: 'Stock', type: 'number' },
      ]} />
  )
}
