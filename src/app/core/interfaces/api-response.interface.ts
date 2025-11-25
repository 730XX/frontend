/**
 * Estructura de respuesta estándar de la API
 * tipo: 1 = éxito, 2 = error de validación, 3 = error del servidor
 */
export interface ApiResponse<T = any> {
  tipo: 1 | 2 | 3;
  mensajes: string[];
  data: T | null;
}

/**
 * Datos del usuario autenticado
 */
export interface Usuario {
  usuarios_id: number;
  usuarios_nombre: string;
  usuarios_apellido?: string;
  usuarios_correo: string;
  usuarios_rol: 'ADMIN' | 'CAJERO' | 'ALMACENERO';
  usuarios_estado: number;
  usuarios_creado?: string; // Fecha de creación
  usuarios_actualizado?: string; // Fecha de actualización
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  correo: string;
  password: string;
}

/**
 * Respuesta de login exitoso
 */
export interface LoginResponse {
  token?: string;
  usuario: Usuario;
}

/**
 * Datos del usuario almacenados en localStorage
 */
export interface AuthData {
  isAuthenticated: boolean;
  usuario: Usuario;
  token?: string;
}

/**
 * Respuesta de listado de usuarios
 */
export interface UsuariosListResponse {
  usuarios: Usuario[];
}

/**
 * Respuesta de un solo usuario
 */
export interface UsuarioResponse {
  usuario: Usuario;
}

/**
 * Datos para crear/actualizar usuario
 */
export interface UsuarioFormData {
  usuarios_nombre: string;
  usuarios_apellido?: string;
  usuarios_correo: string;
  usuarios_password?: string;
  usuarios_rol: 'ADMIN' | 'CAJERO' | 'ALMACENERO';
}

/**
 * Datos del producto
 */
export interface Producto {
  productos_id: number;
  productos_nombre: string;
  productos_codigo: string;
  productos_unidad: string;
  productos_precio: string | null;
  productos_stock: string;
  productos_estado: number;
  productos_creado?: string;
  productos_actualizado?: string;
}

/**
 * Respuesta de listado de productos
 */
export interface ProductosListResponse {
  productos: Producto[];
  total: number;
}

/**
 * Respuesta de un solo producto
 */
export interface ProductoResponse {
  producto: Producto;
}

/**
 * Datos para crear/actualizar producto
 */
export interface ProductoFormData {
  productos_nombre: string;
  productos_codigo: string;
  productos_unidad: string;
  productos_precio?: number | null;
  productos_stock?: number;
}

/**
 * Datos del movimiento (kardex)
 */
export interface Movimiento {
  movimientos_id: number;
  productos_id: number;
  usuarios_id: number;
  movimientos_tipo: 'ENTRADA' | 'SALIDA';
  movimientos_cantidad: string;
  movimientos_motivo: string;
  movimientos_comentario: string | null;
  movimientos_fecha: string;
  productos_nombre: string;
  productos_codigo: string;
}

/**
 * Detalle completo del movimiento (kardex)
 */
export interface MovimientoDetalle {
  movimientos_id: number;
  movimientos_fecha: string;
  productos_id: number;
  productos_nombre: string;
  productos_codigo: string;
  productos_unidad: string;
  usuarios_id: number;
  usuarios_nombre: string;
  movimientos_tipo: 'ENTRADA' | 'SALIDA';
  movimientos_cantidad: string;
  movimientos_stock_historico: string;
  movimientos_motivo: string;
  movimientos_comentario: string | null;
}

/**
 * Respuesta de listado de movimientos
 */
export interface MovimientosListResponse {
  movimientos: Movimiento[];
  total: number;
}

/**
 * Respuesta de un solo movimiento con detalle
 */
export interface MovimientoDetalleResponse {
  movimientos_id: number;
  movimientos_fecha: string;
  productos_id: number;
  productos_nombre: string;
  productos_codigo: string;
  productos_unidad: string;
  usuarios_id: number;
  usuarios_nombre: string;
  movimientos_tipo: 'ENTRADA' | 'SALIDA';
  movimientos_cantidad: string;
  movimientos_stock_historico: string;
  movimientos_motivo: string;
  movimientos_comentario: string | null;
}

/**
 * Datos para crear movimiento
 */
export interface MovimientoFormData {
  productos_id: number;
  movimientos_tipo: 'ENTRADA' | 'SALIDA';
  movimientos_cantidad: number;
  movimientos_motivo: string;
  movimientos_comentario?: string;
}

/**
 * Item de venta
 */
export interface VentaItem {
  productos_id: number;
  cantidad: number;
  precio: number;
}

/**
 * Datos para crear una venta
 */
export interface VentaRequest {
  items: VentaItem[];
  cliente_nombre?: string;
  observaciones?: string;
}

/**
 * Respuesta al crear una venta
 */
export interface VentaResponse {
  venta_id: string;
  mensaje: string;
  timestamp: string;
}
