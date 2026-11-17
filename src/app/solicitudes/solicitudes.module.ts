// Flujos de aprobación (delegado → comité técnico).
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material-module';
import { MotivoDialogComponent } from './motivo-dialog.component';
import { SolicitudJugadorDialogComponent } from './solicitud-jugador-dialog.component';
import { SolicitudesJugadorComponent } from './solicitudes-jugador.component';
import { SolicitarPaseDialogComponent } from './solicitar-pase-dialog.component';
import { BandejaComiteComponent } from './bandeja-comite.component';

const COMPONENTES = [
  MotivoDialogComponent,
  SolicitudJugadorDialogComponent,
  SolicitudesJugadorComponent,
  SolicitarPaseDialogComponent,
  BandejaComiteComponent,
];

@NgModule({
  declarations: COMPONENTES,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: COMPONENTES,
})
export class SolicitudesModule {}
