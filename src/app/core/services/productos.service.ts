import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ApiResponse,
  Producto,
  ProductosListResponse,
  ProductoResponse,
  ProductoFormData
} from '../interfaces/api-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
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
   * GET: Listar todos los productos
   * Endpoint: GET /productos
   */
  getAll(): Observable<ApiResponse<ProductosListResponse>> {
    const url = `${this.API_BASE_URL}/productos`;
    
    return this.http.get<ApiResponse<ProductosListResponse>>(
      url,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Productos obtenidos: ${response.data?.total || 0}`);
        }
      }),
      catchError(error => {
        console.error('❌ Error obteniendo productos:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET: Obtener producto por ID
   * Endpoint: GET /productos/:id
   */
  getById(id: number): Observable<ApiResponse<ProductoResponse>> {
    const url = `${this.API_BASE_URL}/productos/${id}`;
    
    return this.http.get<ApiResponse<ProductoResponse>>(
      url,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error(`❌ Error obteniendo producto ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST: Crear nuevo producto
   * Endpoint: POST /productos
   */
  create(producto: ProductoFormData): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/productos`;
    
    return this.http.post<ApiResponse<any>>(
      url,
      producto,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log('✅ Producto creado exitosamente');
        }
      }),
      catchError(error => {
        console.error('❌ Error creando producto:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * PUT: Actualizar producto existente
   * Endpoint: PUT /productos/:id
   */
  update(id: number, producto: Partial<ProductoFormData>): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/productos/${id}`;
    
    return this.http.put<ApiResponse<any>>(
      url,
      producto,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Producto ${id} actualizado exitosamente`);
        }
      }),
      catchError(error => {
        console.error(`❌ Error actualizando producto ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * PUT: Cambiar estado del producto (activar/desactivar)
   * Endpoint: PUT /productos/:id/estado
   */
  cambiarEstado(id: number, estado: number): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/productos/${id}/estado`;
    
    return this.http.put<ApiResponse<any>>(
      url,
      { productos_estado: estado },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Estado de producto ${id} cambiado a ${estado === 1 ? 'ACTIVO' : 'INACTIVO'}`);
        }
      }),
      catchError(error => {
        console.error(`❌ Error cambiando estado de producto ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
