import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuarios } from './pages/usuarios/usuarios';
import { Check, Eye, EyeOff, LucideAngularModule, Lock, Mail, Package, Pencil, Plus, X, TrendingUp, Users, Activity, ShoppingCart, Minus, Trash2, CheckCircle } from 'lucide-angular';
import { Productos } from './pages/productos/productos';
import { Movimientos } from './pages/movimientos/movimientos';
import { Login } from './pages/login/login';
import { Index } from './pages/index/index';
import { SharedModule } from '../shared/shared-module';
import { Ventas } from './pages/ventas/ventas';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    Usuarios,
    Productos,
    Movimientos,
    Login,
    Index,
    Ventas
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    LucideAngularModule.pick({ 
      Plus, Eye, EyeOff, Pencil, X, Check, Package, Lock, Mail,
      TrendingUp, Users, Activity, ShoppingCart, Minus, Trash2, CheckCircle
    }),
  ]
})
export class FeaturesModule { }
