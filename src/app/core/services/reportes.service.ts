import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly API_KEY = 'sk_live_master_2024_XyZ123AbC456';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Headers con API Key para peticiones protegidas
   */
  private getHeaders(): HttpHeaders {
    const user = this.authService.getCurrentUser();
    const userId = user?.usuarios_id?.toString() || '1';
    
    return new HttpHeaders({
      'X-API-Key': this.API_KEY,
      'X-User-Id': userId
    });
  }

  /**
   * Descargar reporte de movimientos en Excel
   * @param filtros Filtros opcionales: fecha_inicio, fecha_fin, tipo, producto_id
   */
  descargarMovimientos(filtros?: any): Observable<Blob> {
    let params = '';
    if (filtros) {
      const queryParams = new URLSearchParams();
      if (filtros.fecha_inicio) queryParams.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) queryParams.append('fecha_fin', filtros.fecha_fin);
      if (filtros.tipo) queryParams.append('tipo', filtros.tipo);
      if (filtros.producto_id) queryParams.append('producto_id', filtros.producto_id);
      params = '?' + queryParams.toString();
    }

    return this.http.get(
      `${this.API_BASE_URL}/reportes/movimientos${params}`,
      { 
        headers: this.getHeaders(),
        responseType: 'blob'
      }
    );
  }

  /**
   * Descargar reporte de productos en Excel
   * @param filtros Filtros opcionales: stock_minimo, estado
   */
  descargarProductos(filtros?: any): Observable<Blob> {
    let params = '';
    if (filtros) {
      const queryParams = new URLSearchParams();
      if (filtros.stock_minimo !== undefined) queryParams.append('stock_minimo', filtros.stock_minimo.toString());
      if (filtros.estado !== undefined) queryParams.append('estado', filtros.estado.toString());
      params = '?' + queryParams.toString();
    }

    return this.http.get(
      `${this.API_BASE_URL}/reportes/productos${params}`,
      { 
        headers: this.getHeaders(),
        responseType: 'blob'
      }
    );
  }

  /**
   * Descargar reporte de ventas en Excel
   * @param filtros Filtros opcionales: fecha_inicio, fecha_fin
   */
  descargarVentas(filtros?: any): Observable<Blob> {
    let params = '';
    if (filtros) {
      const queryParams = new URLSearchParams();
      if (filtros.fecha_inicio) queryParams.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) queryParams.append('fecha_fin', filtros.fecha_fin);
      params = '?' + queryParams.toString();
    }

    return this.http.get(
      `${this.API_BASE_URL}/reportes/ventas${params}`,
      { 
        headers: this.getHeaders(),
        responseType: 'blob'
      }
    );
  }

  /**
   * Helper para iniciar descarga del archivo
   */
  iniciarDescarga(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
