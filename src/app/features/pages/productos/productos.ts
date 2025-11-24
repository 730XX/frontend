import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Eye, Pencil, Plus, X } from 'lucide-angular';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto } from '../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit {
  readonly icons = { Plus, Eye, Pencil, X };

  // Datos reales del backend
  productos: Producto[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private router: Router,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  /**
   * Cargar productos desde el backend
   */
  cargarProductos(): void {
    this.loading = true;
    this.error = '';

    this.productosService.getAll().subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.tipo === 1 && response.data) {
          this.productos = response.data.productos;
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
          this.error = error.error?.mensajes?.join('. ') || 'Error al cargar productos.';
        }
        
        console.error('Error cargando productos:', error);
      }
    });
  }

  navegarNuevo() {
    this.router.navigate(['/productos/nuevo']);
  }

  verProducto(id: number) {
    this.router.navigate([`/productos/${id}`]);
  }

  editarProducto(id: number) {
    this.router.navigate([`/productos/${id}/editar`]);
  }

  /**
   * Cambiar estado de producto (activar/desactivar)
   */
  cambiarEstado(producto: Producto): void {
    const nuevoEstado = producto.productos_estado === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Está seguro de ${accion} el producto "${producto.productos_nombre}"?`)) {
      return;
    }

    this.productosService.cambiarEstado(producto.productos_id, nuevoEstado).subscribe({
      next: (response) => {
        if (response.tipo === 1) {
          // Actualizar estado en el array local
          producto.productos_estado = nuevoEstado;
          console.log(`Producto ${accion} exitosamente`);
        } else {
          alert('Error: ' + response.mensajes.join('. '));
        }
      },
      error: (error) => {
        alert('Error al cambiar estado: ' + (error.error?.mensajes?.join('. ') || 'Error desconocido'));
        console.error('Error cambiando estado:', error);
      }
    });
  }

  /**
   * Obtener clase CSS para el badge de estado
   */
  getEstadoClass(estado: number): string {
    return estado === 1 ? 'estado-activo' : 'estado-inactivo';
  }

  /**
   * Obtener texto del estado
   */
  getEstadoTexto(estado: number): string {
    return estado === 1 ? 'ACTIVO' : 'INACTIVO';
  }

  /**
   * Formatear precio
   */
  formatearPrecio(precio: string | null): string {
    if (!precio) return 'N/A';
    return `S/ ${parseFloat(precio).toFixed(2)}`;
  }

  /**
   * Formatear stock
   */
  formatearStock(stock: string): string {
    return parseFloat(stock).toFixed(3);
  }

  /**
   * Verificar si hay stock bajo (menos de 10)
   */
  isStockBajo(stock: string): boolean {
    return parseFloat(stock) < 10;
  }
}
