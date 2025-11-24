import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Productos } from './features/pages/productos/productos';
import { Movimientos } from './features/pages/movimientos/movimientos';
import { Usuarios } from './features/pages/usuarios/usuarios';

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: Productos },
  { path: 'movimientos', component: Movimientos },
  { path: 'usuarios', component: Usuarios },
  { path: '**', redirectTo: '/productos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
