// Componentes de la competencia, usados en el panel interno y en la página pública.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material-module';
import { TablaPosicionesComponent } from './tabla-posiciones.component';
import { RankingJugadoresComponent } from './ranking-jugadores.component';
import { FixtureComponent } from './fixture.component';
import { ProgramarPartidoComponent } from './programar-partido.component';
import { MedalleroCategoriaComponent } from './medallero-categoria.component';
import { MedalleroCampeonatoComponent } from './medallero-campeonato.component';

const COMPONENTES = [
  TablaPosicionesComponent,
  RankingJugadoresComponent,
  FixtureComponent,
  ProgramarPartidoComponent,
  MedalleroCategoriaComponent,
  MedalleroCampeonatoComponent,
];

@NgModule({
  declarations: COMPONENTES,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: COMPONENTES,
})
export class CompetenciaModule {}
