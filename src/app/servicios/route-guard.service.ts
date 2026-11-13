import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { GlobalCostants } from '../shared/global-constants';
import { Grupo, leerToken, puede } from '../shared/permisos';

/**
 * Protege las pantallas internas.
 * - Sin sesión (o sesión vencida): vuelve al inicio.
 * - data.grupo: grupo de permisos requerido (ver shared/permisos.ts). Sin grupo: cualquier usuario con sesión.
 */
@Injectable({ providedIn: 'root' })
export class RouteGuardService {
  constructor(public router: Router, private snackbarService: SnackbarService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const datos = leerToken();
    const vencido = !datos || (datos.exp && datos.exp * 1000 < Date.now());
    if (vencido) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
      return false;
    }
    const grupo = route.data?.['grupo'] as Grupo | undefined;
    if (!grupo || puede(grupo, datos.role ?? null)) return true;

    this.snackbarService.openSnackBar(GlobalCostants.unauthorized, GlobalCostants.error);
    this.router.navigate(['/integracion/dashboard']);
    return false;
  }
}
