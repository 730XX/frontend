import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ApiResponse,
  Movimiento,
  MovimientosListResponse,
  MovimientoResponse,
  MovimientoFormData
} from '../interfaces/api-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
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
   * GET: Listar todos los movimientos (kardex)
   * Endpoint: GET /kardex
   */
  getAll(): Observable<ApiResponse<MovimientosListResponse>> {
    const url = `${this.API_BASE_URL}/kardex`;
    
    return this.http.get<ApiResponse<MovimientosListResponse>>(
      url,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Movimientos obtenidos: ${response.data?.total || 0}`);
        }
      }),
      catchError(error => {
        console.error('❌ Error obteniendo movimientos:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET: Obtener movimiento por ID
   * Endpoint: GET /kardex/:id
   */
  getById(id: number): Observable<ApiResponse<MovimientoResponse>> {
    const url = `${this.API_BASE_URL}/kardex/${id}`;
    
    return this.http.get<ApiResponse<MovimientoResponse>>(
      url,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error(`❌ Error obteniendo movimiento ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST: Crear nuevo movimiento
   * Endpoint: POST /kardex
   */
  create(movimiento: MovimientoFormData): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/kardex`;
    
    return this.http.post<ApiResponse<any>>(
      url,
      movimiento,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log('✅ Movimiento creado exitosamente');
        }
      }),
      catchError(error => {
        console.error('❌ Error creando movimiento:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * PUT: Actualizar movimiento existente
   * Endpoint: PUT /kardex/:id
   */
  update(id: number, movimiento: Partial<MovimientoFormData>): Observable<ApiResponse<any>> {
    const url = `${this.API_BASE_URL}/kardex/${id}`;
    
    return this.http.put<ApiResponse<any>>(
      url,
      movimiento,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log(`✅ Movimiento ${id} actualizado exitosamente`);
        }
      }),
      catchError(error => {
        console.error(`❌ Error actualizando movimiento ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET: Obtener movimientos por producto
   * Endpoint: GET /kardex/producto/:productoId
   */
  getByProducto(productoId: number): Observable<ApiResponse<MovimientosListResponse>> {
    const url = `${this.API_BASE_URL}/kardex/producto/${productoId}`;
    
    return this.http.get<ApiResponse<MovimientosListResponse>>(
      url,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error(`❌ Error obteniendo movimientos del producto ${productoId}:`, error);
        return throwError(() => error);
      })
    );
  }
}
