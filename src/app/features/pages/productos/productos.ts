import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Check, Eye, Pencil, Plus, X } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto, ProductoFormData } from '../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
  providers: [MessageService]
})
export class Productos implements OnInit {
  readonly icons = { Plus, Eye, Pencil, X, Check };

  // Datos reales del backend
  productos: Producto[] = [];
  loading: boolean = false;
  error: string = '';

  // Modal de edición
  modalVisible: boolean = false;
  productoSeleccionado: Producto | null = null;

  // Modal de detalles
  detalleModalVisible: boolean = false;
  productoIdDetalle: number | null = null;

  // Modal de agregar
  agregarModalVisible: boolean = false;

  constructor(
    private router: Router,
    private productosService: ProductosService,
    private messageService: MessageService
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
    this.agregarModalVisible = true;
  }

  /**
   * Crear nuevo producto
   */
  crearProducto(data: ProductoFormData): void {
    this.productosService.create(data).subscribe({
      next: (response) => {
        if (response.tipo === 1) {
          // Cerrar modal
          this.agregarModalVisible = false;
          
          // Recargar productos para mostrar el nuevo
          this.cargarProductos();
          
          // Toast de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto creado correctamente',
            life: 3000
          });
        } else {
          // Toast de error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes.join('. '),
            life: 5000
          });
        }
      },
      error: (error) => {
        // Toast de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensajes?.join('. ') || 'Error al crear producto',
          life: 5000
        });
        console.error('Error creando producto:', error);
      }
    });
  }

  verProducto(id: number) {
    this.productoIdDetalle = id;
    this.detalleModalVisible = true;
  }

  editarProducto(id: number) {
    // Buscar el producto en el array
    const producto = this.productos.find(p => p.productos_id === id);
    if (producto) {
      this.productoSeleccionado = producto;
      this.modalVisible = true;
    }
  }

  /**
   * Guardar producto editado
   */
  guardarProducto(event: { id: number, data: ProductoFormData }): void {
    this.productosService.update(event.id, event.data).subscribe({
      next: (response) => {
        if (response.tipo === 1) {
          // Cerrar modal
          this.modalVisible = false;
          this.productoSeleccionado = null;
          
          // Recargar productos para mostrar cambios
          this.cargarProductos();
          
          // Toast de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto actualizado correctamente',
            life: 3000
          });
        } else {
          // Toast de error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes.join('. '),
            life: 5000
          });
        }
      },
      error: (error) => {
        // Toast de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensajes?.join('. ') || 'Error al actualizar producto',
          life: 5000
        });
        console.error('Error actualizando producto:', error);
      }
    });
  }

  /**
   * Cambiar estado de producto (activar/desactivar)
   */
  cambiarEstado(producto: Producto): void {
    const nuevoEstado = producto.productos_estado === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? 'activado' : 'desactivado';

    this.productosService.cambiarEstado(producto.productos_id, nuevoEstado).subscribe({
      next: (response) => {
        if (response.tipo === 1) {
          // Actualizar estado en el array local
          producto.productos_estado = nuevoEstado;
          
          // Toast de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Producto ${accion} correctamente`,
            life: 3000
          });
        } else {
          // Toast de error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes.join('. '),
            life: 5000
          });
        }
      },
      error: (error) => {
        // Toast de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensajes?.join('. ') || 'Error al cambiar estado',
          life: 5000
        });
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
    return parseFloat(stock).toFixed(0);
  }

  /**
   * Verificar si hay stock bajo (menos de 10)
   */
  isStockBajo(stock: string): boolean {
    return parseFloat(stock) < 10;
  }
}
