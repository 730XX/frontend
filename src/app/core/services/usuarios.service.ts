import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ApiResponse,
  Usuario,
  UsuariosListResponse,
  UsuarioResponse,
  UsuarioFormData
} from '../interfaces/api-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly API_KEY = 'sk_live_master_2024_XyZ123AbC456';

  constructor(private http: HttpClient) {}

  /**
   * Headers con API Key para peticiones protegidas
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': this.API_KEY
    });
  }

  /**
   * GET: Listar todos los usuarios
   * Endpoint: GET /usuarios
   */
  getAll(): Observable<ApiResponse<UsuariosListResponse>> {
    const url = `${this.API_BASE_URL}/usuarios`;
    
    return this.http.get<ApiResponse<UsuariosListResponse>>(
      url,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Usuarios obtenidos: ${response.data?.usuarios.length || 0}`);
        }
      }),
      catchError(error => {
        console.error('❌ Error obteniendo usuarios:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET: Obtener usuario por ID
   * Endpoint: GET /usuarios/:id
   */
  getById(id: number): Observable<ApiResponse<UsuarioResponse>> {
    const url = `${this.API_BASE_URL}/usuarios/${id}`;
    
    return this.http.get<ApiResponse<UsuarioResponse>>(
      url,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error(`❌ Error obteniendo usuario ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST: Crear nuevo usuario
   * Endpoint: POST /usuarios
   */
  create(usuario: UsuarioFormData): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/usuarios`;
    
    return this.http.post<ApiResponse<any>>(
      url,
      usuario,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log('✅ Usuario creado exitosamente');
        }
      }),
      catchError(error => {
        console.error('❌ Error creando usuario:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * PUT: Actualizar usuario existente
   * Endpoint: PUT /usuarios/:id
   */
  update(id: number, usuario: Partial<UsuarioFormData>): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/usuarios/${id}`;
    
    return this.http.put<ApiResponse<any>>(
      url,
      usuario,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Usuario ${id} actualizado exitosamente`);
        }
      }),
      catchError(error => {
        console.error(`❌ Error actualizando usuario ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * PUT: Cambiar estado del usuario (activar/desactivar)
   * Endpoint: PUT /usuarios/:id/estado
   */
  cambiarEstado(id: number, estado: number): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/usuarios/${id}/estado`;
    
    return this.http.put<ApiResponse<any>>(
      url,
      { usuarios_estado: estado },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Estado de usuario ${id} cambiado a ${estado === 1 ? 'ACTIVO' : 'INACTIVO'}`);
        }
      }),
      catchError(error => {
        console.error(`❌ Error cambiando estado de usuario ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
