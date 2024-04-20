import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../servicios/route-guard.service';
import { ManageClubComponent } from './manage-club/manage-club.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageJugadorComponent } from './manage-jugador/manage-jugador.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
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
        data: {
            expectedRole: ['admin']
        }
    },

    {
        path: 'jugador',
        component: ManageJugadorComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'pase',
        component: ManajePaseJugadorComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'user',
        component: ManageUserComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'club',
        component: ManageClubComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'reglamento',
        component: ManageReglamentoComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'disciplina',
        component: ManageDisciplinaComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'arbitro',
        component: ManageArbitroComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'categoria',
        component: ManageCategoriaComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'sitio',
        component: ManageCampoDeJuegoComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'auspiciador',
        component: ManageAuspiciadorComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'reporte',
        component: ManageReporteComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'noticia',
        component: ManageNoticiaComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'noticia/:id',
        component: ManageNoticiaComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'dcampeonato/:id',
        component: ManageDetalleCampeonatoComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'auspiciador/:id',
        component: ManageAuspiciadorComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'dcategoria_campeonato/:id',
        component: ManageDcategoriaCampeonatoComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'dcategoria_f/:idc/:id_contempla',
        component: ManageDcategoriaFutbolComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'pie/:xnom',
        component: FullComponent,
        outlet: 'pie'
    }

];
