import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Eye, Pencil, Plus, Download } from 'lucide-angular';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { ReportesService } from '../../../core/services/reportes.service';
import { Movimiento } from '../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-movimientos',
  standalone: false,
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.scss',
})
export class Movimientos implements OnInit {
  readonly icons = { Plus, Eye, Pencil, Download };

  // Datos reales del backend
  movimientos: Movimiento[] = [];
  loading: boolean = false;
  error: string = '';
  descargando: boolean = false;

  // Modal de detalles
  detalleModalVisible: boolean = false;
  movimientoIdDetalle: number | null = null;

  constructor(
    private router: Router,
    private movimientosService: MovimientosService,
    private reportesService: ReportesService
  ) {}

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  /**
   * Cargar movimientos desde el backend
   */
  cargarMovimientos(): void {
    this.loading = true;
    this.error = '';

    this.movimientosService.getAll().subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.tipo === 1 && response.data) {
          this.movimientos = response.data.movimientos;
        } else {
          this.error = response.mensajes.join('. ');
        }
      },
      error: (error) => {
        this.loading = false;
        
        if (error.status === 401) {
          this.error = 'No autorizado. Verifica el API Key.';
        } else if (error.status === 0) {
          this.error = 'No se puede conectar con el servidor.';
        } else {
          this.error = error.error?.mensajes?.join('. ') || 'Error al cargar movimientos.';
        }
        
        console.error('Error cargando movimientos:', error);
      }
    });
  }

  navegarNuevo() {
    this.router.navigate(['/movimientos/nuevo']);
  }

  verMovimiento(id: number) {
    this.movimientoIdDetalle = id;
    this.detalleModalVisible = true;
  }

  editarMovimiento(id: number) {
    this.router.navigate([`/movimientos/${id}/editar`]);
  }

  /**
   * Obtener clase CSS para el badge de tipo
   */
  getTipoClass(tipo: string): string {
    return tipo === 'ENTRADA' ? 'badge-success' : 'badge-destructive';
  }

  /**
   * Formatear cantidad - mostrar como número entero sin decimales
   */
  formatearCantidad(cantidad: string): string {
    return Math.round(parseFloat(cantidad)).toString();
  }

  /**
   * Formatear fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Descargar reporte de movimientos en Excel
   */
  descargarReporte(): void {
    this.descargando = true;

    this.reportesService.descargarMovimientos().subscribe({
      next: (blob) => {
        const filename = `movimientos_${new Date().toISOString().split('T')[0]}.xlsx`;
        this.reportesService.iniciarDescarga(blob, filename);
        this.descargando = false;
       
      },
      error: (error) => {
        this.descargando = false;
        this.error = 'Error al descargar el reporte';
        
      }
    });
  }
}
