import { Component, Input } from '@angular/core';
import { Package, TrendingUp, Users } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

  // Recibimos el estado desde el Layout
  @Input() collapsed: boolean = false;

  // Definimos los iconos para usarlos en el HTML
  readonly icons = {
    Package,
    TrendingUp,
    Users
  };

  menuItems = [
    { title: 'Productos', url: '/productos', icon: this.icons.Package },
    { title: 'Movimientos', url: '/movimientos', icon: this.icons.TrendingUp },
    { title: 'Usuarios', url: '/usuarios', icon: this.icons.Users },
  ];

}
