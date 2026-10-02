import { useEffect, useState } from 'react'
import Crud from '../../components/Crud'
import { listProveedores, createProveedor, listCompras } from '../../services/api'
import type { Proveedor, Compra } from '../../types'

// Conectado con Compras: muestra órdenes y monto comprado a cada proveedor.
export default function ProveedoresPage() {
  const [compras, setCompras] = useState<Compra[]>([])
  useEffect(() => { listCompras().then(setCompras) }, [])
  const de = (p: Proveedor) => compras.filter(c => c.proveedorId === p.id)
  return (
    <Crud<Proveedor> title="Proveedores" load={listProveedores} create={createProveedor}
      extraCols={[
        { label: 'Compras', value: p => String(de(p).length) },
        { label: 'Monto comprado', value: p => `S/ ${de(p).reduce((s, c) => s + c.cantidad * c.costo, 0).toLocaleString('es-PE')}` },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre' }, { key: 'ruc', label: 'RUC' },
        { key: 'email', label: 'Correo', type: 'email' }, { key: 'telefono', label: 'Teléfono' },
      ]} />
  )
}
