import { Component, OnInit } from '@angular/core';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../../../core/services/productos.service';
import { VentasService } from '../../../core/services/ventas.service';
import { Producto, VentaRequest } from '../../../core/interfaces/api-response.interface';

interface CartItem {
  productos_id: number;
  productos_nombre: string;
  cantidad: number;
  precio: number;
  stock_disponible: number;
}

@Component({
  selector: 'app-punto-venta',
  templateUrl: './ventas.html',
  standalone: false,
  providers: [MessageService]
})

export class Ventas implements OnInit {
  // Iconos
  readonly icons = { ShoppingCart, Plus, Minus, Trash2, CheckCircle };

  // Datos del backend
  productos: Producto[] = [];
  carrito: CartItem[] = [];
  loading = false;
  error = '';
  currentDate = new Date();

  constructor(
    private productosService: ProductosService,
    private ventasService: VentasService,
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
          // Filtrar solo productos activos con stock
          this.productos = response.data.productos.filter(
            p => p.productos_estado === 1
          );
        } else {
          this.error = response.mensajes.join('. ');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.error
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar productos';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los productos'
        });
        console.error('Error cargando productos:', err);
      }
    });
  }

  // --- LÓGICA DEL CARRITO ---

  agregarProducto(producto: Producto) {
    const stock = Number(producto.productos_stock);
    const precio = Number(producto.productos_precio);

    if (stock === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin Stock',
        detail: 'Producto sin stock disponible'
      });
      return;
    }

    const itemExistente = this.carrito.find(item => item.productos_id === producto.productos_id);
    
    if (itemExistente) {
      // Validar stock
      if (itemExistente.cantidad >= stock) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Stock Insuficiente',
          detail: `Stock disponible: ${stock}`
        });
        return;
      }
      
      // Actualizar cantidad
      itemExistente.cantidad++;
    } else {
      // Nuevo item
      this.carrito.push({
        productos_id: producto.productos_id,
        productos_nombre: producto.productos_nombre,
        cantidad: 1,
        precio: precio,
        stock_disponible: stock
      });
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Agregado',
      detail: `${producto.productos_nombre} agregado al carrito`
    });
  }

  incrementarCantidad(id: number) {
    const item = this.carrito.find(i => i.productos_id === id);
    if (!item) return;

    if (item.cantidad >= item.stock_disponible) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Stock Insuficiente',
        detail: `Stock disponible: ${item.stock_disponible}`
      });
      return;
    }
    item.cantidad++;
  }

  decrementarCantidad(id: number) {
    const item = this.carrito.find(i => i.productos_id === id);
    if (!item) return;

    item.cantidad = Math.max(1, item.cantidad - 1);
  }

  eliminarDelCarrito(id: number) {
    this.carrito = this.carrito.filter(item => item.productos_id !== id);
  }

  // --- CÁLCULOS (Getters para reactividad automática) ---

  get subtotal(): number {
    return this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  get igv(): number {
    return this.subtotal * 0.18;
  }

  get total(): number {
    return this.subtotal + this.igv;
  }

  cantidadEnCarrito(id: number): number {
    const item = this.carrito.find(i => i.productos_id === id);
    return item ? item.cantidad : 0;
  }

  // --- HELPERS ---

  getStock(producto: Producto): number {
    return Number(producto.productos_stock) || 0;
  }

  getPrecio(producto: Producto): number {
    return Number(producto.productos_precio) || 0;
  }

  // --- PROCESAR VENTA ---

  confirmarVenta() {
    if (this.carrito.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrito Vacío',
        detail: 'Agrega productos antes de confirmar la venta'
      });
      return;
    }

    this.loading = true;

    // Preparar datos de la venta
    const ventaData: VentaRequest = {
      items: this.carrito.map(item => ({
        productos_id: item.productos_id,
        cantidad: item.cantidad,
        precio: item.precio
      })),
      cliente_nombre: 'Cliente General', // Puedes agregar un input para esto después
      observaciones: `Venta registrada el ${new Date().toLocaleString()}`
    };

    this.ventasService.create(ventaData).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.tipo === 1 && response.data) {
          this.messageService.add({
            severity: 'success',
            summary: '¡Venta Exitosa!',
            detail: `${response.mensajes.join('. ')}`,
            life: 5000
          });

          // Limpiar carrito
          this.carrito = [];

          // Recargar productos para actualizar el stock
          this.cargarProductos();

          console.log('Venta procesada:', response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes.join('. ')
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Procesar Venta',
          detail: 'No se pudo completar la venta. Intenta nuevamente.'
        });
        console.error('Error al procesar venta:', err);
      }
    });
  }
}