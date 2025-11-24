import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Eye, Pencil, Plus, X } from 'lucide-angular';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios {
  // Iconos
  readonly icons = { Plus, Eye, Pencil, X };

  // Datos simulados
  mockUsuarios = [
    {
      id: 1,
      nombre: "Juan Pérez",
      correo: "juan.perez@empresa.com",
      rol: "ADMINISTRADOR",
      estado: "ACTIVO",
    },
    {
      id: 2,
      nombre: "Ana García",
      correo: "ana.garcia@empresa.com",
      rol: "SUPERVISOR",
      estado: "ACTIVO",
    },
    {
      id: 3,
      nombre: "Carlos Ruiz",
      correo: "carlos.ruiz@empresa.com",
      rol: "OPERADOR",
      estado: "ACTIVO",
    },
    {
      id: 4,
      nombre: "María López",
      correo: "maria.lopez@empresa.com",
      rol: "OPERADOR",
      estado: "INACTIVO",
    },
  ];

  constructor(private router: Router) {}

  // Métodos de navegación
  navegarNuevo() {
    this.router.navigate(['/usuarios/nuevo']);
  }

  verUsuario(id: number) {
    this.router.navigate([`/usuarios/${id}`]);
  }

  editarUsuario(id: number) {
    this.router.navigate([`/usuarios/${id}/editar`]);
  }
}
