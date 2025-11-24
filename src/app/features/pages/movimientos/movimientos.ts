import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Eye, Pencil, Plus } from 'lucide-angular';

@Component({
  selector: 'app-movimientos',
  standalone: false,
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.scss',
})
export class Movimientos {

  readonly icons = { Plus, Eye, Pencil };

  mockMovimientos = [
    {
      id: 1,
      producto: { nombre: "Laptop Dell XPS 15", codigo: "LAP-001" },
      usuario: "Juan Pérez",
      tipo: "ENTRADA",
      cantidad: 10,
      motivo: "Compra",
      fecha: "2024-03-20",
    },
    {
      id: 2,
      producto: { nombre: "Mouse Logitech MX Master 3", codigo: "MOU-002" },
      usuario: "Ana García",
      tipo: "SALIDA",
      cantidad: 5,
      motivo: "Venta",
      fecha: "2024-03-19",
    },
    {
      id: 3,
      producto: { nombre: "Teclado Mecánico Keychron K2", codigo: "TEC-003" },
      usuario: "Carlos Ruiz",
      tipo: "ENTRADA",
      cantidad: 15,
      motivo: "Compra",
      fecha: "2024-03-18",
    },
  ];

  constructor(private router: Router) {}

  navegarNuevo() {
    this.router.navigate(['/movimientos/nuevo']);
  }

  verMovimiento(id: number) {
    this.router.navigate([`/movimientos/${id}`]);
  }

  editarMovimiento(id: number) {
    this.router.navigate([`/movimientos/${id}/editar`]);
  }

}
