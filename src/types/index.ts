export interface Cliente { id: number; nombre: string; ruc: string; email: string; telefono: string }
export interface Producto { id: number; nombre: string; categoria: string; precio: number; stock: number }
export interface LineaVenta { productoId: number; cantidad: number; precio: number }
export interface Venta { id: number; fecha: string; clienteId: number; items: LineaVenta[]; total: number }
export interface Proveedor { id: number; nombre: string; ruc: string; email: string; telefono: string }
export interface Compra { id: number; fecha: string; proveedorId: number; productoId: number; cantidad: number; costo: number }
export interface Movimiento { id: number; fecha: string; productoId: number; tipo: 'entrada' | 'salida'; cantidad: number; referencia: string }
