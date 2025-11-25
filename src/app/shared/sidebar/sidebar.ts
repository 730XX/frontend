import { Component, Input, OnInit } from '@angular/core';
import { Package, TrendingUp, Users, LogOut, ShoppingCart } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/interfaces/api-response.interface';

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles?: Array<'ADMIN' | 'CAJERO' | 'ALMACENERO'>; // Si no tiene roles, es accesible para todos
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {

  // Recibimos el estado desde el Layout
  @Input() collapsed: boolean = false;

  // Definimos los iconos para usarlos en el HTML
  readonly icons = {
    Package,
    TrendingUp,
    Users,
    LogOut,
    ShoppingCart
  };

  // Usuario actual
  currentUser: Usuario | null = null;

  // Todos los items del menú (con restricciones de roles)
  private allMenuItems: MenuItem[] = [
    { 
      title: 'Productos', 
      url: '/productos', 
      icon: this.icons.Package 
      // Sin roles = accesible para todos
    },
    { 
      title: 'Movimientos', 
      url: '/movimientos', 
      icon: this.icons.TrendingUp 
      // Sin roles = accesible para todos
    },
    { 
      title: 'Usuarios', 
      url: '/usuarios', 
      icon: this.icons.Users,
      roles: ['ADMIN'] // Solo ADMIN puede ver usuarios
    },
     {
       title: "Punto de Venta",
       url: "/ventas",
        icon: this.icons.ShoppingCart 
       // Sin roles = accesible para todos
     },
  ];

  // Items visibles según el rol del usuario
  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.filterMenuItems();
    });
  }

  /**
   * Filtrar items del menú según el rol del usuario
   */
  private filterMenuItems(): void {
    this.menuItems = this.allMenuItems.filter(item => {
      // Si el item no tiene restricción de roles, mostrarlo
      if (!item.roles || item.roles.length === 0) {
        return true;
      }

      // Si tiene roles, verificar si el usuario tiene alguno de ellos
      return item.roles.some(role => this.authService.hasRole(role));
    });
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    if (confirm('¿Está seguro de cerrar sesión?')) {
      this.authService.logout();
    }
  }

  /**
   * Obtener iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return '??';
    const nombre = this.currentUser.usuarios_nombre || '';
    const palabras = nombre.split(' ');
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

}
