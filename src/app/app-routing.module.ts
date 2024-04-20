import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { RouteGuardService } from './servicios/route-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'integracion',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/integracion/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren:
          () => import('./component/material.module').then(m => m.MaterialComponentsModule),
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user']
        }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user']
        }
      }
    ]
  },/*
  {
    path: 'pie/:xnom',
    component: FullComponent,
    outlet: 'pie'
  },*/

  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
