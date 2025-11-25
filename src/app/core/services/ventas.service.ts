import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiResponse, VentaRequest, VentaResponse } from '../interfaces/api-response.interface';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly API_KEY = 'sk_live_master_2024_XyZ123AbC456';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Headers con API Key y User ID para peticiones protegidas
   */
  private getHeaders(): HttpHeaders {
    const user = this.authService.getCurrentUser();
    const userId = user?.usuarios_id?.toString() || '1'; // Fallback a '1' si no hay usuario
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': this.API_KEY,
      'X-User-Id': userId
    });
  }

  /**
   * Crear una nueva venta
   */
  create(ventaData: VentaRequest): Observable<ApiResponse<VentaResponse>> {
    return this.http.post<ApiResponse<VentaResponse>>(
      `${this.API_BASE_URL}/ventas`,
      ventaData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log('✅ Venta creada:', response.data);
        } else {
          console.warn('⚠️ Error al crear venta:', response.mensajes);
        }
      }),
      catchError(error => {
        console.error('❌ Error HTTP al crear venta:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener todas las ventas
   */
  getAll(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.API_BASE_URL}/ventas`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log('✅ Ventas obtenidas');
        }
      }),
      catchError(error => {
        console.error('❌ Error HTTP al obtener ventas:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener una venta por ID
   */
  getById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.API_BASE_URL}/ventas/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.tipo === 1) {
          console.log('✅ Venta obtenida:', response.data);
        }
      }),
      catchError(error => {
        console.error('❌ Error HTTP al obtener venta:', error);
        return throwError(() => error);
      })
    );
  }
}
