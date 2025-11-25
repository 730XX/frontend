import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Package, TrendingUp, Users, Activity } from 'lucide-angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  standalone: false
})
export class Index {
  // Definimos los iconos para usarlos en el HTML y en el array
  readonly icons = { Package, TrendingUp, Users, Activity };

  // Datos de estadísticas
  stats = [
    {
      title: "Total Productos",
      value: "124",
      description: "15 con stock bajo",
      icon: this.icons.Package,
      color: "text-slate-900", // primary
    },
    {
      title: "Movimientos Hoy",
      value: "38",
      description: "24 entradas, 14 salidas",
      icon: this.icons.TrendingUp,
      color: "text-emerald-600", // success
    },
    {
      title: "Usuarios Activos",
      value: "12",
      description: "3 administradores",
      icon: this.icons.Users,
      color: "text-amber-500", // warning
    },
    {
      title: "Estado Sistema",
      value: "Activo",
      description: "Última sincronización: Ahora",
      icon: this.icons.Activity,
      color: "text-emerald-600", // success
    },
  ];

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}