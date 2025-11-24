import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuarios } from './pages/usuarios/usuarios';
import { Eye, LucideAngularModule, Package, Pencil, Plus, X } from 'lucide-angular';
import { Productos } from './pages/productos/productos';
import { Movimientos } from './pages/movimientos/movimientos';



@NgModule({
  declarations: [
    Usuarios,
    Productos,
    Movimientos
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({ Plus, Eye, Pencil, X, Package }),
  ]
})
export class FeaturesModule { }
