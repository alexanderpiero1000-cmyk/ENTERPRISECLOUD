import type { Cliente, Producto, Venta, LineaVenta, Proveedor, Compra, Movimiento } from '../types'

/*
 * CAPA DE DATOS (simulada, en memoria).
 * Para conectar la base de datos, reemplaza cada función por fetch(`${API}/...`).
 * Rutas previstas: /customers, /suppliers, /products, /sales, /purchases
 */
export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'
const wait = <T,>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 120))
const nextId = (a: { id: number }[]) => Math.max(0, ...a.map(x => x.id)) + 1
const hoy = new Date()
const fechaAtras = (dias: number) => new Date(hoy.getTime() - dias * 864e5).toISOString().slice(0, 10)

let clientes: Cliente[] = [
  { id: 1, nombre: 'Distribuidora Andina SAC', ruc: '20601234567', email: 'compras@andina.pe', telefono: '987654321' },
  { id: 2, nombre: 'Comercial Pacífico', ruc: '20509876543', email: 'ventas@pacifico.pe', telefono: '912345678' },
  { id: 3, nombre: 'Inversiones Los Olivos', ruc: '20456781234', email: 'admin@losolivos.pe', telefono: '956123478' },
  { id: 4, nombre: 'Tecnoservicios del Perú', ruc: '20587654321', email: 'contacto@tecnoserv.pe', telefono: '944556677' },
  { id: 5, nombre: 'Corporación Machu Picchu', ruc: '20612349876', email: 'logistica@cmp.pe', telefono: '933221100' },
  { id: 6, nombre: 'Importadora Sol Naciente', ruc: '20498761234', email: 'info@solnaciente.pe', telefono: '925814703' },
  { id: 7, nombre: 'Librería y Papelería Lima', ruc: '20534126789', email: 'pedidos@libreria.pe', telefono: '918273645' },
  { id: 8, nombre: 'Grupo Inca Retail', ruc: '20578901234', email: 'compras@incaretail.pe', telefono: '999888777' },
]
let proveedores: Proveedor[] = [
  { id: 1, nombre: 'TechImport SAC', ruc: '20111222333', email: 'ventas@techimport.pe', telefono: '014567890' },
  { id: 2, nombre: 'Global Hardware Perú', ruc: '20444555666', email: 'b2b@globalhw.pe', telefono: '017654321' },
  { id: 3, nombre: 'Accesorios del Sur', ruc: '20777888999', email: 'info@accsur.pe', telefono: '054321987' },
  { id: 4, nombre: 'Distribuciones Norte', ruc: '20123987456', email: 'pedidos@dnorte.pe', telefono: '044123456' },
  { id: 5, nombre: 'Papelera Nacional', ruc: '20321654987', email: 'ventas@papnacional.pe', telefono: '013217654' },
]
let productos: Producto[] = [
  { id: 1, nombre: 'Laptop 14"', categoria: 'Tecnología', precio: 2400, stock: 18 },
  { id: 2, nombre: 'Teclado mecánico', categoria: 'Accesorios', precio: 180, stock: 6 },
  { id: 3, nombre: 'Monitor 24"', categoria: 'Tecnología', precio: 650, stock: 4 },
  { id: 4, nombre: 'Mouse inalámbrico', categoria: 'Accesorios', precio: 65, stock: 45 },
  { id: 5, nombre: 'Impresora láser', categoria: 'Oficina', precio: 890, stock: 9 },
  { id: 6, nombre: 'Disco SSD 1TB', categoria: 'Tecnología', precio: 320, stock: 27 },
  { id: 7, nombre: 'Router WiFi 6', categoria: 'Redes', precio: 280, stock: 15 },
  { id: 8, nombre: 'Silla ergonómica', categoria: 'Mobiliario', precio: 540, stock: 8 },
  { id: 9, nombre: 'Escritorio ejecutivo', categoria: 'Mobiliario', precio: 760, stock: 5 },
  { id: 10, nombre: 'Papel bond A4 (millar)', categoria: 'Oficina', precio: 28, stock: 120 },
  { id: 11, nombre: 'Webcam HD', categoria: 'Accesorios', precio: 120, stock: 3 },
  { id: 12, nombre: 'Switch 24 puertos', categoria: 'Redes', precio: 460, stock: 11 },
]

// Historial de ventas generado (últimos ~6 meses)
let semilla = 7
const rnd = (n: number) => { semilla = (semilla * 9301 + 49297) % 233280; return Math.floor((semilla / 233280) * n) }
const ventas: Venta[] = Array.from({ length: 28 }, (_, i) => {
  const items: LineaVenta[] = Array.from({ length: 1 + rnd(3) }, () => {
    const p = productos[rnd(productos.length)]
    return { productoId: p.id, cantidad: 1 + rnd(4), precio: p.precio }
  })
  return {
    id: i + 1, fecha: fechaAtras(170 - i * 6), clienteId: 1 + rnd(clientes.length), items,
    total: items.reduce((s, x) => s + x.cantidad * x.precio, 0),
  }
})
let compras: Compra[] = [
  { id: 1, fecha: fechaAtras(40), proveedorId: 1, productoId: 1, cantidad: 10, costo: 1900 },
  { id: 2, fecha: fechaAtras(32), proveedorId: 3, productoId: 4, cantidad: 50, costo: 38 },
  { id: 3, fecha: fechaAtras(21), proveedorId: 2, productoId: 3, cantidad: 8, costo: 480 },
  { id: 4, fecha: fechaAtras(14), proveedorId: 5, productoId: 10, cantidad: 100, costo: 19 },
  { id: 5, fecha: fechaAtras(6), proveedorId: 4, productoId: 8, cantidad: 6, costo: 390 },
]
// Kardex: cada venta (salida) y cada compra (entrada) deja un movimiento de inventario
const movimientos: Movimiento[] = [
  ...ventas.flatMap(v => v.items.map(i => ({ fecha: v.fecha, productoId: i.productoId, tipo: 'salida' as const, cantidad: i.cantidad, referencia: `Venta #${v.id}` }))),
  ...compras.map(c => ({ fecha: c.fecha, productoId: c.productoId, tipo: 'entrada' as const, cantidad: c.cantidad, referencia: `Compra #${c.id}` })),
].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((m, i) => ({ ...m, id: i + 1 }))

export const listClientes = () => wait([...clientes])
export const createCliente = async (d: Omit<Cliente, 'id'>) => { const c = { ...d, id: nextId(clientes) }; clientes.push(c); return wait(c) }
export const listProveedores = () => wait([...proveedores])
export const createProveedor = async (d: Omit<Proveedor, 'id'>) => { const p = { ...d, id: nextId(proveedores) }; proveedores.push(p); return wait(p) }
export const listProductos = () => wait([...productos])
export const createProducto = async (d: Omit<Producto, 'id'>) => { const p = { ...d, id: nextId(productos) }; productos.push(p); return wait(p) }
export const listCompras = () => wait([...compras])
export const createCompra = async (d: Omit<Compra, 'id' | 'fecha'>) => {
  const c: Compra = { ...d, id: nextId(compras), fecha: fechaAtras(0) }
  compras.push(c)
  productos = productos.map(p => p.id === d.productoId ? { ...p, stock: p.stock + d.cantidad } : p)
  movimientos.push({ id: nextId(movimientos), fecha: c.fecha, productoId: d.productoId, tipo: 'entrada', cantidad: d.cantidad, referencia: `Compra #${c.id}` })
  return wait(c)
}
export const listMovimientos = () => wait([...movimientos])
export const listVentas = () => wait([...ventas])
export const createVenta = async (clienteId: number, items: LineaVenta[]) => {
  for (const it of items) {
    const p = productos.find(x => x.id === it.productoId)
    if (!p || p.stock < it.cantidad) throw new Error(`Stock insuficiente: ${p?.nombre ?? 'producto'}`)
  }
  items.forEach(it => { productos = productos.map(p => p.id === it.productoId ? { ...p, stock: p.stock - it.cantidad } : p) })
  const v: Venta = {
    id: nextId(ventas), fecha: fechaAtras(0), clienteId, items,
    total: items.reduce((s, i) => s + i.cantidad * i.precio, 0),
  }
  ventas.push(v)
  items.forEach(i => movimientos.push({ id: nextId(movimientos), fecha: v.fecha, productoId: i.productoId, tipo: 'salida', cantidad: i.cantidad, referencia: `Venta #${v.id}` }))
  return wait(v)
}
