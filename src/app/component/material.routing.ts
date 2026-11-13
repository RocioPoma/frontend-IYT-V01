import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../servicios/route-guard.service';
import { ManageClubComponent } from './manage-club/manage-club.component';
import { ManageJugadorComponent } from './manage-jugador/manage-jugador.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageCampeonatoComponent } from './manage-campeonato/manage-campeonato.component';
import { ManageNoticiaComponent } from './manage-noticia/manage-noticia.component';
import { ManageDetalleCampeonatoComponent } from './manage-detalle-campeonato/manage-detalle-campeonato.component';
import { ManageAuspiciadorComponent } from './manage-auspiciador/manage-auspiciador.component';
import { ManageReporteComponent } from './manage-reporte/manage-reporte.component';
import { ManageCategoriaComponent } from './manage-categoria/manage-categoria.component';
import { ManageReglamentoComponent } from './manage-reglamento/manage-reglamento.component';
import { ManageDisciplinaComponent } from './manage-disciplina/manage-disciplina.component';
import { ManageArbitroComponent } from './manage-arbitro/manage-arbitro.component';
import { ManageDcategoriaCampeonatoComponent } from './manage-dcategoria-campeonato/manage-dcategoria-campeonato.component';
import { ManageDcategoriaFutbolComponent } from './manage-dcategoria-futbol/manage-dcategoria-futbol.component';
import { FullComponent } from '../layouts/full/full.component';
import { ManajePaseJugadorComponent } from './manaje-pase-jugador/manaje-pase-jugador.component';
import { ManageCampoDeJuegoComponent } from './manage-campo-de-juego/manage-campo-de-juego.component';



export const MaterialRoutes: Routes = [
    {
        path: 'campeonato',
        component: ManageCampeonatoComponent,
        canActivate: [RouteGuardService],
        data: {}
    },

    {
        path: 'jugador',
        component: ManageJugadorComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'pase',
        component: ManajePaseJugadorComponent,
        canActivate: [RouteGuardService],
        data: { grupo: 'GESTION' }
    },
    {
        path: 'user',
        component: ManageUserComponent,
        canActivate: [RouteGuardService],
        data: { grupo: 'ADMIN' }
    },
    {
        path: 'club',
        component: ManageClubComponent,
        canActivate: [RouteGuardService],
        data: { grupo: 'GESTION' }
    },
    {
        path: 'reglamento',
        component: ManageReglamentoComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'disciplina',
        component: ManageDisciplinaComponent,
        canActivate: [RouteGuardService],
        data: { grupo: 'GESTION' }
    },
    {
        path: 'arbitro',
        component: ManageArbitroComponent,
        canActivate: [RouteGuardService],
        data: { grupo: 'GESTION' }
    },
    {
        path: 'categoria',
        component: ManageCategoriaComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'sitio',
        component: ManageCampoDeJuegoComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'auspiciador',
        component: ManageAuspiciadorComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'reporte',
        component: ManageReporteComponent,
        canActivate: [RouteGuardService],
        data: { grupo: 'GESTION' }
    },
    {
        path: 'noticia',
        component: ManageNoticiaComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'noticia/:id',
        component: ManageNoticiaComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'dcampeonato/:id',
        component: ManageDetalleCampeonatoComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'auspiciador/:id',
        component: ManageAuspiciadorComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'dcategoria_campeonato/:id',
        component: ManageDcategoriaCampeonatoComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'dcategoria_f/:idc/:id_contempla',
        component: ManageDcategoriaFutbolComponent,
        canActivate: [RouteGuardService],
        data: {}
    },
    {
        path: 'pie/:xnom',
        component: FullComponent,
        outlet: 'pie'
    }

];
