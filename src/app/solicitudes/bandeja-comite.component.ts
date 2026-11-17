import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SolicitudesService } from './solicitudes.service';
import { MotivoDialogComponent } from './motivo-dialog.component';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';
import { urlDocumentoPrivado } from '../shared/permisos';

/** Bandeja del comité técnico: jugadores nuevos/actualizaciones, inscripciones de equipos y pases por aprobar. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-bandeja-comite',
  templateUrl: './bandeja-comite.component.html',
  styleUrls: ['./solicitudes.scss'],
  styles: [`.cabecera { padding: 12px 16px; } .cabecera b { font-size: 18px; } .cabecera p { margin: 4px 0 0; color: #616161; font-size: 13px; }
            .pestana { padding: 12px 4px; }`],
})
export class BandejaComiteComponent implements OnInit {
  nJugadores = 0;
  equipos: any[] = [];
  pases: any[] = [];
  colEquipos = ['club', 'categoria', 'jugadores', 'fecha', 'acciones'];
  colPases = ['jugador', 'origen', 'destino', 'documento', 'fecha', 'acciones'];
  imgUrl = environment.apiUrl + '/uploads/img/';

  constructor(
    private solicitudes: SolicitudesService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
    this.cargarPases();
  }

  cargarEquipos(): void {
    this.solicitudes.equiposPorRevisar().subscribe({ next: (e) => (this.equipos = e), error: (e) => this.error(e) });
  }

  cargarPases(): void {
    this.solicitudes.pases('aceptado_origen').subscribe({ next: (p) => (this.pases = p), error: (e) => this.error(e) });
  }

  verEquipo(e: any): void {
    this.router.navigate(['/integracion/dcategoria_f', e.id_campeonato, e.id_contempla]);
  }

  doc(nombre: string): string {
    return urlDocumentoPrivado(this.imgUrl, nombre);
  }

  revisarEquipo(e: any, estado: 'aprobado' | 'observado' | 'rechazado'): void {
    const titulos = { aprobado: 'Aprobar inscripción', observado: 'Observar inscripción', rechazado: 'Rechazar inscripción' };
    this.dialog
      .open(MotivoDialogComponent, {
        width: '440px',
        data: {
          titulo: titulos[estado],
          mensaje: `${e.nombre_club} — ${e.disciplina} ${e.categoria} (${e.genero}), ${e.total_jugadores} jugadores.`,
          obligatorio: estado !== 'aprobado',
          etiqueta: estado === 'aprobado' ? 'Comentario (opcional)' : 'Motivo para el delegado',
          boton: titulos[estado].split(' ')[0],
          color: estado === 'aprobado' ? 'primary' : 'warn',
        },
      })
      .afterClosed()
      .subscribe((texto) => {
        if (texto === undefined) return;
        this.solicitudes
          .revisarEquipo({ id_club: e.id_club, id_contempla: e.id_contempla, estado, observacion: texto || undefined })
          .subscribe({ next: (r) => { this.ok(r.message); this.cargarEquipos(); }, error: (x) => this.error(x) });
      });
  }

  revisarPase(p: any, decision: 'aprobar' | 'rechazar'): void {
    this.dialog
      .open(MotivoDialogComponent, {
        width: '440px',
        data: {
          titulo: decision === 'aprobar' ? 'Aprobar pase' : 'Rechazar pase',
          mensaje: `${p.nombre} ${p.ap_paterno} (CI ${p.ci}): ${p.club_solicitado} → ${p.club_solicitante}.`,
          obligatorio: decision === 'rechazar',
          etiqueta: decision === 'aprobar' ? 'Comentario (opcional)' : 'Motivo del rechazo',
          boton: decision === 'aprobar' ? 'Aprobar' : 'Rechazar',
          color: decision === 'aprobar' ? 'primary' : 'warn',
        },
      })
      .afterClosed()
      .subscribe((texto) => {
        if (texto === undefined) return;
        this.solicitudes.revisarPase(p.id_pase, decision, texto || undefined).subscribe({
          next: (r) => { this.ok(r.message); this.cargarPases(); },
          error: (x) => this.error(x),
        });
      });
  }

  private ok(m: string): void {
    this.snackbar.openSnackBar(m, 'success');
  }

  private error(e: any): void {
    this.snackbar.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error);
  }
}
