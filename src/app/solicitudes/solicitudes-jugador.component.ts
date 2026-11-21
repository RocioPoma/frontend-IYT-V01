import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ESTADOS, SolicitudesService, SolicitudJugador } from './solicitudes.service';
import { SolicitudJugadorDialogComponent } from './solicitud-jugador-dialog.component';
import { MotivoDialogComponent } from './motivo-dialog.component';
import { RevisarSolicitudDialogComponent } from './revisar-solicitud-dialog.component';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';
import { urlDocumentoPrivado } from '../shared/permisos';

const CAMPOS: [keyof SolicitudJugador, string][] = [
  ['nombre', 'Nombre'], ['ap_paterno', 'Ap. paterno'], ['ap_materno', 'Ap. materno'],
  ['fecha_nacimiento', 'Nacimiento'], ['sexo', 'Sexo'], ['decendencia', 'Descendencia'],
];

/**
 * Lista de solicitudes de jugadores.
 * - modo "delegado": sus solicitudes, con Editar / Solicitar / Anular.
 * - modo "comite": las pendientes de revisión, con Aceptar / Observar.
 */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-solicitudes-jugador',
  templateUrl: './solicitudes-jugador.component.html',
  styleUrls: ['./solicitudes.scss'],
})
export class SolicitudesJugadorComponent implements OnInit {
  @Input() modo: 'delegado' | 'comite' = 'delegado';
  @Output() cambio = new EventEmitter<number>();

  filas: SolicitudJugador[] = [];
  cargando = false;
  estados = ESTADOS;
  imgUrl = environment.apiUrl + '/uploads/img/';

  constructor(private solicitudes: SolicitudesService, private dialog: MatDialog, private snackbar: SnackbarService) {}

  get columnas(): string[] {
    return this.modo === 'comite'
      ? ['foto', 'tipo', 'jugador', 'club', 'cambios', 'documento', 'fecha', 'acciones']
      : ['foto', 'tipo', 'jugador', 'estado', 'fecha', 'acciones'];
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.solicitudes.jugadores(this.modo === 'comite' ? { estado: 'pendiente' } : {}).subscribe({
      next: (f) => {
        this.filas = this.modo === 'delegado' ? f.filter((x) => x.estado !== 'anulado') : f;
        this.cargando = false;
        this.cambio.emit(this.filas.filter((x) => x.estado === 'pendiente').length);
      },
      error: (e) => { this.cargando = false; this.error(e); },
    });
  }

  nombre(s: SolicitudJugador): string {
    return [s.nombre, s.ap_paterno, s.ap_materno].filter(Boolean).join(' ');
  }

  /** Para las actualizaciones: qué campos cambian respecto a la lista oficial */
  cambios(s: SolicitudJugador): { campo: string; antes: string; despues: string }[] {
    if (s.tipo !== 'actualizacion') return [];
    const lista = CAMPOS
      .filter(([k]) => String((s as any)['actual_' + k] ?? '') !== String(s[k] ?? ''))
      .map(([k, campo]) => ({ campo, antes: String((s as any)['actual_' + k] ?? '—'), despues: String(s[k] ?? '—') }));
    if (s.foto) lista.push({ campo: 'Foto', antes: '', despues: 'nueva' });
    if (s.documento) lista.push({ campo: 'Archivo', antes: '', despues: 'nuevo' });
    return lista;
  }

  urlFoto(s: SolicitudJugador): string | null {
    const f = s.foto || s.actual_foto;
    return f ? urlDocumentoPrivado(this.imgUrl, f) : null;
  }

  urlDocumento(s: SolicitudJugador): string | null {
    return s.documento ? urlDocumentoPrivado(this.imgUrl, s.documento) : null;
  }

  editable(s: SolicitudJugador): boolean {
    return s.estado === 'borrador' || s.estado === 'observado';
  }

  // ----- Delegado -----
  editar(s: SolicitudJugador): void {
    this.dialog
      .open(SolicitudJugadorDialogComponent, { width: '760px', maxWidth: '96vw', data: { modo: 'editar', solicitud: s } })
      .afterClosed()
      .subscribe((ok) => ok && this.cargar());
  }

  enviar(s: SolicitudJugador): void {
    this.solicitudes.enviarSolicitud(s.id).subscribe({ next: (r) => this.ok(r.message), error: (e) => this.error(e) });
  }

  anular(s: SolicitudJugador): void {
    this.dialog
      .open(MotivoDialogComponent, {
        width: '420px',
        data: { titulo: 'Anular solicitud', mensaje: `¿Anular la solicitud de ${this.nombre(s)}?`, obligatorio: false, etiqueta: 'Comentario (opcional)', boton: 'Anular', color: 'warn' },
      })
      .afterClosed()
      .subscribe((r) => {
        if (r === undefined) return;
        this.solicitudes.anularSolicitud(s.id).subscribe({ next: (x) => this.ok(x.message), error: (e) => this.error(e) });
      });
  }

  // ----- Comité técnico -----
  /** Formulario con los datos a la izquierda y el documento a la derecha; permite corregir, aceptar u observar */
  revisar(s: SolicitudJugador): void {
    this.dialog
      .open(RevisarSolicitudDialogComponent, { width: '1280px', maxWidth: '98vw', maxHeight: '96vh', data: { solicitud: s }, autoFocus: false })
      .afterClosed()
      .subscribe((ok) => ok && this.cargar());
  }

  aceptar(s: SolicitudJugador): void {
    this.dialog
      .open(MotivoDialogComponent, {
        width: '440px',
        data: {
          titulo: s.tipo === 'alta' ? 'Aceptar jugador nuevo' : 'Aceptar actualización',
          mensaje: `${this.nombre(s)} (CI ${s.ci}) — ${s.club}. ${s.tipo === 'alta' ? 'Se agregará a la lista oficial.' : 'Los cambios se aplicarán a la lista oficial.'}`,
          obligatorio: false, etiqueta: 'Comentario (opcional)', boton: 'Aceptar',
        },
      })
      .afterClosed()
      .subscribe((texto) => {
        if (texto === undefined) return;
        this.solicitudes.revisarJugador(s.id, 'aceptar', texto || undefined).subscribe({ next: (r) => this.ok(r.message), error: (e) => this.error(e) });
      });
  }

  observar(s: SolicitudJugador): void {
    this.dialog
      .open(MotivoDialogComponent, {
        width: '440px',
        data: { titulo: 'Observar solicitud', mensaje: `Indique al delegado qué debe corregir (${this.nombre(s)}).`, etiqueta: 'Observación', boton: 'Observar', color: 'warn' },
      })
      .afterClosed()
      .subscribe((texto) => {
        if (!texto) return;
        this.solicitudes.revisarJugador(s.id, 'observar', texto).subscribe({ next: (r) => this.ok(r.message), error: (e) => this.error(e) });
      });
  }

  private ok(mensaje: string): void {
    this.snackbar.openSnackBar(mensaje, 'success');
    this.cargar();
  }

  private error(e: any): void {
    this.snackbar.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error);
  }
}
