import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Productos } from './features/pages/productos/productos';
import { Movimientos } from './features/pages/movimientos/movimientos';
import { Usuarios } from './features/pages/usuarios/usuarios';
import { Login } from './features/pages/login/login';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'productos', component: Productos },
  { path: 'movimientos', component: Movimientos },
  { path: 'usuarios', component: Usuarios },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
