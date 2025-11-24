import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Package, TrendingUp, Users } from 'lucide-angular';
import { Sidebar } from './sidebar/sidebar';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    Sidebar
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({ Package, TrendingUp, Users }),
    RouterLink
  ],
  exports: [
    Sidebar
  ]
})
export class SharedModule { }
