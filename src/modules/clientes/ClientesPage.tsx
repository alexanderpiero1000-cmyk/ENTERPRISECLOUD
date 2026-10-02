import { useEffect, useState } from 'react'
import Crud from '../../components/Crud'
import { listClientes, createCliente, listVentas } from '../../services/api'
import type { Cliente, Venta } from '../../types'

// Conectado con Ventas: muestra pedidos y total comprado por cada cliente.
export default function ClientesPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  useEffect(() => { listVentas().then(setVentas) }, [])
  const de = (c: Cliente) => ventas.filter(v => v.clienteId === c.id)
  return (
    <Crud<Cliente> title="Clientes" load={listClientes} create={createCliente}
      extraCols={[
        { label: 'Pedidos', value: c => String(de(c).length) },
        { label: 'Total comprado', value: c => `S/ ${de(c).reduce((s, v) => s + v.total, 0).toLocaleString('es-PE')}` },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre' }, { key: 'ruc', label: 'RUC' },
        { key: 'email', label: 'Correo', type: 'email' }, { key: 'telefono', label: 'Teléfono' },
      ]} />
  )
}
