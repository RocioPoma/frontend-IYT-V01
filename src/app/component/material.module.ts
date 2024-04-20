import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ManageClubComponent } from './manage-club/manage-club.component';
import { ClubComponent } from './dialog/club/club.component';
import { ManageJugadorComponent } from './manage-jugador/manage-jugador.component';
import { JugadorComponent } from './dialog/jugador/jugador.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageCampeonatoComponent } from './manage-campeonato/manage-campeonato.component';
import { CampeonatoComponent } from './dialog/campeonato/campeonato.component';
import { ManageNoticiaComponent } from './manage-noticia/manage-noticia.component';
import { NoticiaComponent } from './dialog/noticia/noticia.component';
import { ManageDetalleCampeonatoComponent } from './manage-detalle-campeonato/manage-detalle-campeonato.component';
import { ManageAuspiciadorComponent } from './manage-auspiciador/manage-auspiciador.component';
import { ManageCategoriaComponent } from './manage-categoria/manage-categoria.component';
import { ManageDisciplinaComponent } from './manage-disciplina/manage-disciplina.component';
import { ManageReglamentoComponent } from './manage-reglamento/manage-reglamento.component';
import { ManageReporteComponent } from './manage-reporte/manage-reporte.component';
import { ManageArbitroComponent } from './manage-arbitro/manage-arbitro.component';
import { ReglamentoComponent } from './dialog/reglamento/reglamento.component';
import { ArbitroComponent } from './dialog/arbitro/arbitro.component';
import { CategoriaComponent } from './dialog/categoria/categoria.component';
import { ManageDcategoriaCampeonatoComponent } from './manage-dcategoria-campeonato/manage-dcategoria-campeonato.component';
import { DcategoriaCampeonatoComponent } from './dialog/dcategoria-campeonato/dcategoria-campeonato.component';
import { ManageDcategoriaFutbolComponent } from './manage-dcategoria-futbol/manage-dcategoria-futbol.component';
import { ManageDequipoComponent } from './manage-dequipo/manage-dequipo.component';
import { EquipoComponent } from './dialog/equipo/equipo.component';
import { ManageDpartidoComponent } from './manage-dpartido/manage-dpartido.component';
import { JugadorEquipoComponent } from './dialog/jugador-equipo/jugador-equipo.component';
import { PartidoComponent } from './dialog/partido/partido.component';
import { HechosPartidoComponent } from './dialog/hechos-partido/hechos-partido.component';
import { ManageTablaPosicionesComponent } from './manage-tabla-posiciones/manage-tabla-posiciones.component';
import { ManageRankingJugadoresComponent } from './manage-ranking-jugadores/manage-ranking-jugadores.component';
import { ManajePaseJugadorComponent } from './manaje-pase-jugador/manaje-pase-jugador.component';
import { PasejugadorComponent } from './dialog/pasejugador/pasejugador.component';
import { ManageCampoDeJuegoComponent } from './manage-campo-de-juego/manage-campo-de-juego.component';
import { AuspiciadorComponent } from './dialog/auspiciador/auspiciador.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  declarations: [
    ViewBillProductsComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageClubComponent,
    ClubComponent,
    ManageJugadorComponent,
    JugadorComponent,
    ManageOrderComponent,
    ViewBillComponent,
    ManageUserComponent,
    ManageCampeonatoComponent,
    CampeonatoComponent,
    ManageNoticiaComponent,
    NoticiaComponent,
    ManageDetalleCampeonatoComponent,
    ManageAuspiciadorComponent,
    ManageCategoriaComponent,
    ManageDisciplinaComponent,
    ManageReglamentoComponent,
    ManageReporteComponent,
    ManageArbitroComponent,
    ReglamentoComponent,
    ArbitroComponent,
    CategoriaComponent,
    ManageDcategoriaCampeonatoComponent,
    DcategoriaCampeonatoComponent,
    ManageDcategoriaFutbolComponent,
    ManageDequipoComponent,
    EquipoComponent,
    ManageDpartidoComponent,
    JugadorEquipoComponent,
    PartidoComponent,
    HechosPartidoComponent,
    ManageTablaPosicionesComponent,
    ManageRankingJugadoresComponent,
    ManajePaseJugadorComponent,
    PasejugadorComponent,
    ManageCampoDeJuegoComponent,
    AuspiciadorComponent    
  ]
})
export class MaterialComponentsModule {}
