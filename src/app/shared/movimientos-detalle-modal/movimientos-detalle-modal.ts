import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MovimientoDetalleResponse } from '../../core/interfaces/api-response.interface';
import { MovimientosService } from '../../core/services/movimientos.service';

@Component({
  selector: 'app-movimientos-detalle-modal',
  standalone: false,
  templateUrl: './movimientos-detalle-modal.html',
  styleUrl: './movimientos-detalle-modal.scss',
})
export class MovimientosDetalleModal implements OnChanges {
  @Input() visible: boolean = false;
  @Input() movimientoId: number | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  movimiento: MovimientoDetalleResponse | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(private movimientosService: MovimientosService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movimientoId'] && this.movimientoId && this.visible) {
      this.cargarMovimiento();
    }
  }

  /**
   * Cargar detalles del movimiento desde el backend
   */
  cargarMovimiento(): void {
    if (!this.movimientoId) return;

    this.loading = true;
    this.error = '';

    this.movimientosService.getById(this.movimientoId).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.tipo === 1 && response.data) {
          this.movimiento = response.data as MovimientoDetalleResponse;
        } else {
          this.error = response.mensajes.join('. ');
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.mensajes?.join('. ') || 'Error al cargar el movimiento';
        console.error('Error cargando movimiento:', error);
      }
    });
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.movimiento = null;
    this.error = '';
  }

  /**
   * Obtener badge de tipo de movimiento
   */
  getTipoBadge(tipo: string): { class: string, text: string, icon: string } {
    return tipo === 'ENTRADA'
      ? { class: 'badge-success', text: 'ENTRADA', icon: '📥' }
      : { class: 'badge-destructive', text: 'SALIDA', icon: '📤' };
  }

  /**
   * Formatear cantidad
   */
  formatearCantidad(cantidad: string): string {
    return parseFloat(cantidad).toFixed(3);
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return 'No disponible';
    
    const date = new Date(fecha);
    return date.toLocaleString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
