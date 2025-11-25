import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Productos } from './features/pages/productos/productos';
import { Movimientos } from './features/pages/movimientos/movimientos';
import { Usuarios } from './features/pages/usuarios/usuarios';
import { Login } from './features/pages/login/login';
import { AuthGuard } from './core/interceptors/auth.guard';
import { LoginGuard } from './core/interceptors/login.guard';
import { RoleGuard } from './core/interceptors/role.guard';
import { Ventas } from './features/pages/ventas/ventas';

const routes: Routes = [
  // Ruta raíz - redirige según autenticación
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  
  // Ruta de Login - protegida con LoginGuard (redirige si ya está autenticado)
  { 
    path: 'login', 
    component: Login,
    canActivate: [LoginGuard]
  },
  
  // Rutas protegidas - requieren autenticación
  { 
    path: 'productos', 
    component: Productos,
    canActivate: [AuthGuard]
  },
  { 
    path: 'movimientos', 
    component: Movimientos,
    canActivate: [AuthGuard]
  },
  { 
    path: 'ventas', 
    component: Ventas,
    canActivate: [AuthGuard]
  },
  
  // Ruta de usuarios - solo para ADMIN
  { 
    path: 'usuarios', 
    component: Usuarios,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  
  // Wildcard - redirige a login
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
