import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Eye, Pencil, Plus, X } from 'lucide-angular';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos {
  readonly icons = { Plus, Eye, Pencil, X };

  mockProductos = [
    {
      id: 1,
      nombre: "Laptop Dell XPS 15",
      codigo: "LAP-001",
      unidad: "UNIDAD",
      precio: 1299.99,
      stock: 15,
      estado: "ACTIVO",
    },
    {
      id: 2,
      nombre: "Mouse Logitech MX Master 3",
      codigo: "MOU-002",
      unidad: "UNIDAD",
      precio: 99.99,
      stock: 45,
      estado: "ACTIVO",
    },
    {
      id: 3,
      nombre: "Teclado Mecánico Keychron K2",
      codigo: "TEC-003",
      unidad: "UNIDAD",
      precio: 89.99,
      stock: 0,
      estado: "INACTIVO",
    },
    {
      id: 4,
      nombre: "Monitor LG UltraWide 34\"",
      codigo: "MON-004",
      unidad: "UNIDAD",
      precio: 449.99,
      stock: 8,
      estado: "ACTIVO",
    },
  ];

  constructor(private router: Router) {}

  navegarNuevo() {
    this.router.navigate(['/productos/nuevo']);
  }

  verProducto(id: number) {
    this.router.navigate([`/productos/${id}`]);
  }

  editarProducto(id: number) {
    this.router.navigate([`/productos/${id}/editar`]);
  }

}
