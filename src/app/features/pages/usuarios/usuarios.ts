import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Check, Eye, Pencil, Plus, X } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
  providers: [MessageService]
})
export class Usuarios implements OnInit {
  // Iconos
  readonly icons = { Plus, Eye, Pencil, X, Check };

  // Datos reales del backend
  usuarios: Usuario[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /**
   * Cargar usuarios desde el backend
   */
  cargarUsuarios(): void {
    this.loading = true;
    this.error = '';

    this.usuariosService.getAll().subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.tipo === 1 && response.data) {
          this.usuarios = response.data.usuarios;
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
          this.error = error.error?.mensajes?.join('. ') || 'Error al cargar usuarios.';
        }
        
        console.error('Error cargando usuarios:', error);
      }
    });
  }

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

  /**
   * Cambiar estado de usuario (activar/desactivar)
   */
  cambiarEstado(usuario: Usuario): void {
    const nuevoEstado = usuario.usuarios_estado === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Está seguro de ${accion} al usuario ${usuario.usuarios_nombre}?`)) {
      return;
    }

    this.usuariosService.cambiarEstado(usuario.usuarios_id, nuevoEstado).subscribe({
      next: (response) => {
        if (response.tipo === 1) {
          // Actualizar estado en el array local
          usuario.usuarios_estado = nuevoEstado;
          
          // Toast de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Usuario ${accion} correctamente`,
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
   * Obtener clase CSS para el badge de rol
   */
  getRolClass(rol: string): string {
    switch (rol) {
      case 'ADMIN':
        return 'badge-destructive';
      case 'CAJERO':
        return 'badge-warning';
      case 'ALMACENERO':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  }
}
