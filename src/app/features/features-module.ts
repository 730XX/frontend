import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuarios } from './pages/usuarios/usuarios';
import { Check, Eye, EyeOff, LucideAngularModule, Lock, Mail, Package, Pencil, Plus, X } from 'lucide-angular';
import { Productos } from './pages/productos/productos';
import { Movimientos } from './pages/movimientos/movimientos';
import { Login } from './pages/login/login';
import { SharedModule } from '../shared/shared-module';
import { Ventas } from './pages/ventas/ventas';



@NgModule({
  declarations: [
    Usuarios,
    Productos,
    Movimientos,
    Login,
    Ventas
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LucideAngularModule.pick({ Plus, Eye, EyeOff, Pencil, X, Check, Package, Lock, Mail }),
  ]
})
export class FeaturesModule { }
