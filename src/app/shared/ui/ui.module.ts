import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OrdenTablaDirective } from './orden-tabla.directive';
import { EncabezadoComponent } from './encabezado.component';
import { PieComponent } from './pie.component';

@NgModule({
  declarations: [OrdenTablaDirective, EncabezadoComponent, PieComponent],
  imports: [CommonModule, MatIconModule],
  exports: [OrdenTablaDirective, EncabezadoComponent, PieComponent],
})
export class UiModule {}
