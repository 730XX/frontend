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
  usuarios_apellido: string;
  usuarios_correo: string;
  usuarios_rol: 'ADMIN' | 'CAJERO' | 'ALMACENERO';
  usuarios_estado: number;
  usuarios_creado_en: string;
  usuarios_actualizado_en: string;
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
