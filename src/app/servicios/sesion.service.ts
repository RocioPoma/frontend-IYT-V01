// Requisito 3.3.2: si la sesión queda inactiva 30 minutos, se vuelve a pedir el inicio de sesión.
// Mientras el usuario usa el sistema (clics, teclado), el token se renueva automáticamente.
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { leerToken } from '../shared/permisos';
import { UserService } from './user.service';
import { SnackbarService } from './snackbar.service';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private ultimaActividad = Date.now();
  private renovando = false;
  private iniciado = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private zone: NgZone,
    private snackbar: SnackbarService
  ) {}

  iniciar(): void {
    if (this.iniciado) return;
    this.iniciado = true;
    const marcar = () => (this.ultimaActividad = Date.now());
    this.zone.runOutsideAngular(() => {
      for (const ev of ['click', 'keydown', 'touchstart', 'scroll']) {
        window.addEventListener(ev, marcar, { passive: true });
      }
      setInterval(() => this.zone.run(() => this.revisar()), 60 * 1000);
    });
  }

  private revisar(): void {
    const datos = leerToken();
    if (!datos?.exp) return;
    const restante = datos.exp * 1000 - Date.now();
    if (restante <= 0) {
      this.cerrar('Su sesión expiró por inactividad. Inicie sesión nuevamente.');
      return;
    }
    // Hubo actividad en los últimos 5 minutos y quedan menos de 20 minutos: renovar
    const activo = Date.now() - this.ultimaActividad < 5 * 60 * 1000;
    if (activo && restante < 20 * 60 * 1000 && !this.renovando) {
      this.renovando = true;
      this.userService.refresh().subscribe({
        next: (r) => {
          localStorage.setItem('token', r.token);
          this.renovando = false;
        },
        error: () => (this.renovando = false),
      });
    }
  }

  cerrar(mensaje?: string): void {
    const habiaSesion = !!localStorage.getItem('token');
    localStorage.removeItem('token');
    if (habiaSesion && mensaje) this.snackbar.openSnackBar(mensaje, 'error');
    this.router.navigate(['/']);
  }
}
