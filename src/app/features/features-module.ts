import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuarios } from './pages/usuarios/usuarios';
import { Eye, EyeOff, LucideAngularModule, Lock, Mail, Package, Pencil, Plus, X } from 'lucide-angular';
import { Productos } from './pages/productos/productos';
import { Movimientos } from './pages/movimientos/movimientos';
import { Login } from './pages/login/login';



@NgModule({
  declarations: [
    Usuarios,
    Productos,
    Movimientos,
    Login
  ],
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule.pick({ Plus, Eye, EyeOff, Pencil, X, Package, Lock, Mail }),
  ]
})
export class FeaturesModule { }
