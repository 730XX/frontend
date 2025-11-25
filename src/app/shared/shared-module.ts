import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Package, TrendingUp, Users, LogOut } from 'lucide-angular';
import { Sidebar } from './sidebar/sidebar';
import { RouterLink } from '@angular/router';
import { ProductosModal } from './productos-modal/productos-modal';
import { ProductoDetalleModal } from './producto-detalle-modal/producto-detalle-modal';
import { AgregarProductosModal } from './agregar-productos-modal/agregar-productos-modal';

// PrimeNG modules
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MovimientosDetalleModal } from './movimientos-detalle-modal/movimientos-detalle-modal';

@NgModule({
  declarations: [
    Sidebar,
    ProductosModal,
    ProductoDetalleModal,
    AgregarProductosModal,
    MovimientosDetalleModal
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ Package, TrendingUp, Users, LogOut }),
    RouterLink,
    Dialog,
    Button,
    InputText,
    InputNumber,
    Select,
    Toast
  ],
  exports: [
    Sidebar,
    ProductosModal,
    ProductoDetalleModal,
    AgregarProductosModal,
    Toast,
    MovimientosDetalleModal
  ]
})
export class SharedModule { }
