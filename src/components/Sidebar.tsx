export type Vista = 'dashboard' | 'ventas' | 'compras' | 'inventario' | 'clientes' | 'proveedores' | 'kardex' | 'finanzas'
const items: [Vista, string][] = [
  ['dashboard', 'Dashboard'], ['ventas', 'Ventas'], ['compras', 'Compras'], ['inventario', 'Inventario'],
  ['clientes', 'Clientes'], ['proveedores', 'Proveedores'],
  ['kardex', 'Kardex'], ['finanzas', 'Finanzas'],
]
export default function Sidebar({ vista, onChange }: { vista: Vista; onChange: (v: Vista) => void }) {
  return (
    <nav className="sidebar" aria-label="Módulos">
      <div className="brand">EnterpriseCloud<small>ERP</small></div>
      {items.map(([k, label]) => (
        <button key={k} className={vista === k ? 'nav active' : 'nav'} onClick={() => onChange(k)}>{label}</button>
      ))}
    </nav>
  )
}
