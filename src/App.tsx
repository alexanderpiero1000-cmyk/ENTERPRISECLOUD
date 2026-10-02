import { useState } from 'react'
import Sidebar, { Vista } from './components/Sidebar'
import DashboardPage from './modules/dashboard/DashboardPage'
import VentasPage from './modules/ventas/VentasPage'
import InventarioPage from './modules/inventario/InventarioPage'
import ClientesPage from './modules/clientes/ClientesPage'
import ProveedoresPage from './modules/proveedores/ProveedoresPage'
import KardexPage from './modules/kardex/KardexPage'
import FinanzasPage from './modules/finanzas/FinanzasPage'
import ComprasPage from './modules/compras/ComprasPage'

export default function App() {
  const [vista, setVista] = useState<Vista>('dashboard')
  return (
    <div className="layout">
      <Sidebar vista={vista} onChange={setVista} />
      <main>
        {vista === 'dashboard' && <DashboardPage />}
        {vista === 'ventas' && <VentasPage />}
        {vista === 'inventario' && <InventarioPage />}
        {vista === 'compras' && <ComprasPage />}
        {vista === 'clientes' && <ClientesPage />}
        {vista === 'proveedores' && <ProveedoresPage />}
        {vista === 'kardex' && <KardexPage />}
        {vista === 'finanzas' && <FinanzasPage />}
      </main>
    </div>
  )
}
