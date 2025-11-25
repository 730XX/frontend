import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Producto } from '../../core/interfaces/api-response.interface';
import { ProductosService } from '../../core/services/productos.service';

@Component({
  selector: 'app-producto-detalle-modal',
  standalone: false,
  templateUrl: './producto-detalle-modal.html',
  styleUrl: './producto-detalle-modal.scss',
})
export class ProductoDetalleModal implements OnChanges {
  @Input() visible: boolean = false;
  @Input() productoId: number | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  producto: Producto | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(private productosService: ProductosService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoId'] && this.productoId && this.visible) {
      this.cargarProducto();
    }
  }

  /**
   * Cargar detalles del producto desde el backend
   */
  cargarProducto(): void {
    if (!this.productoId) return;

    this.loading = true;
    this.error = '';

    this.productosService.getById(this.productoId).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.tipo === 1 && response.data) {
          this.producto = response.data.producto;
        } else {
          this.error = response.mensajes.join('. ');
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.mensajes?.join('. ') || 'Error al cargar el producto';
        console.error('Error cargando producto:', error);
      }
    });
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.producto = null;
    this.error = '';
  }

  /**
   * Formatear precio
   */
  formatearPrecio(precio: string | null): string {
    if (!precio) return 'No especificado';
    return `S/ ${parseFloat(precio).toFixed(2)}`;
  }

  /**
   * Formatear stock
   */
  formatearStock(stock: string): string {
    return parseFloat(stock).toFixed(0);
  }

  /**
   * Calcular valor total en stock
   */
  calcularValorTotal(precio: string | null, stock: string): string {
    if (!precio) return 'S/ 0.00';
    const total = parseFloat(precio) * parseFloat(stock);
    return `S/ ${total.toFixed(2)}`;
  }

  /**
   * Obtener badge de estado
   */
  getEstadoBadge(estado: number): { class: string, text: string } {
    return estado === 1 
      ? { class: 'badge-success', text: 'ACTIVO' }
      : { class: 'badge-inactive', text: 'INACTIVO' };
  }

  /**
   * Verificar si hay stock bajo (menos de 10)
   */
  isStockBajo(stock: string): boolean {
    return parseFloat(stock) < 10;
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
