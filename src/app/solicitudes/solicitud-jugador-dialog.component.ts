import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SolicitudesService, SolicitudJugador } from './solicitudes.service';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';
import { leerToken, urlDocumentoPrivado } from '../shared/permisos';
import { HttpClient } from '@angular/common/http';

export interface DatosSolicitudJugador {
  /** alta = jugador nuevo; actualizacion = editar un jugador oficial; editar = corregir una solicitud */
  modo: 'alta' | 'actualizacion' | 'editar';
  jugador?: any;
  solicitud?: SolicitudJugador;
}

/**
 * Formulario del delegado para registrar un jugador nuevo o pedir la actualización de uno de su club.
 * El CI y el club no se pueden cambiar en una actualización. Nada cambia en la lista oficial
 * hasta que el comité técnico acepta la solicitud.
 */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-solicitud-jugador-dialog',
  templateUrl: './solicitud-jugador-dialog.component.html',
  styleUrls: ['./solicitudes.scss'],
})
export class SolicitudJugadorDialogComponent {
  form: FormGroup;
  sexos = ['Femenino', 'Masculino'];
  decendencias = ['Neto', 'Yern@', 'Nieto'];
  foto: File | null = null;
  documento: File | null = null;
  vistaFoto: string | null = null;
  guardando = false;
  imgUrl = environment.apiUrl + '/uploads/img/';
  tipo: 'alta' | 'actualizacion';
  observacion: string | null = null;
  nombreClub = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DatosSolicitudJugador,
    fb: FormBuilder,
    private solicitudes: SolicitudesService,
    private snackbar: SnackbarService,
    private ref: MatDialogRef<SolicitudJugadorDialogComponent>,
    http: HttpClient
  ) {
    const idClub = data.solicitud?.id_club || data.jugador?.clubId || leerToken()?.id_club;
    if (idClub && !data.solicitud?.club && !data.jugador?.NombreClub) {
      http.get<any[]>(`${environment.apiUrl}/club/get/${idClub}`).subscribe((c) => (this.nombreClub = c?.[0]?.nombre || ''));
    }
    const base: any = data.solicitud || data.jugador || {};
    this.tipo = data.solicitud ? data.solicitud.tipo : data.modo === 'actualizacion' ? 'actualizacion' : 'alta';
    this.observacion = data.solicitud?.estado === 'observado' ? data.solicitud.observacion : null;
    const fechaNac = base.fecha_nacimiento ? String(base.fecha_nacimiento).substring(0, 10) : null;
    this.form = fb.group({
      ci: [{ value: base.ci || '', disabled: this.tipo === 'actualizacion' }, [Validators.required, Validators.pattern('^[0-9A-Za-z-]{4,15}$')]],
      nombre: [base.nombre || '', [Validators.required, Validators.minLength(2)]],
      ap_paterno: [base.ap_paterno || ''],
      ap_materno: [base.ap_materno || ''],
      fecha_nacimiento: [fechaNac, Validators.required],
      sexo: [base.sexo || null, Validators.required],
      decendencia: [base.decendencia || null],
    });
    const fotoActual = data.solicitud?.foto || base.foto || data.solicitud?.actual_foto;
    this.vistaFoto = fotoActual ? this.imgUrl + fotoActual : null;
  }

  get titulo(): string {
    if (this.tipo === 'alta') return this.data.modo === 'editar' ? 'Corregir solicitud de jugador nuevo' : 'Registrar jugador nuevo';
    return 'Solicitar actualización de jugador';
  }

  get club(): string {
    return this.data.solicitud?.club || this.data.jugador?.NombreClub || this.nombreClub || 'su club';
  }

  get documentoActual(): string | null {
    const d = this.data.solicitud?.documento || this.data.jugador?.documento;
    return d ? urlDocumentoPrivado(this.imgUrl, d) : null;
  }

  elegirFoto(ev: Event): void {
    const f = (ev.target as HTMLInputElement).files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return this.snackbar.openSnackBar('La foto debe ser una imagen', GlobalCostants.error);
    this.foto = f;
    const lector = new FileReader();
    lector.onload = () => (this.vistaFoto = lector.result as string);
    lector.readAsDataURL(f);
  }

  elegirDocumento(ev: Event): void {
    const f = (ev.target as HTMLInputElement).files?.[0];
    if (f) this.documento = f;
  }

  guardar(enviar: boolean): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (!v.ap_paterno && !v.ap_materno) {
      this.snackbar.openSnackBar('Registre al menos un apellido', GlobalCostants.error);
      return;
    }
    const fd = new FormData();
    for (const [k, val] of Object.entries(v)) if (val !== null && val !== undefined) fd.append(k, String(val));
    if (this.foto) fd.append('foto', this.foto);
    if (this.documento) fd.append('documento', this.documento);

    this.guardando = true;
    const peticion = this.data.solicitud
      ? this.solicitudes.editarSolicitud(this.data.solicitud.id, fd)
      : this.tipo === 'alta'
        ? (fd.append('enviar', String(enviar)), this.solicitudes.altaJugador(fd))
        : (fd.append('enviar', String(enviar)), this.solicitudes.actualizarJugador(fd));

    peticion.subscribe({
      next: (r) => {
        // Al corregir una solicitud existente, el envío es un segundo paso
        if (this.data.solicitud && enviar) {
          this.solicitudes.enviarSolicitud(this.data.solicitud.id).subscribe({
            next: (r2) => this.terminar(r2.message),
            error: (e) => this.fallo(e),
          });
        } else {
          this.terminar(r.message);
        }
      },
      error: (e) => this.fallo(e),
    });
  }

  private terminar(mensaje: string): void {
    this.snackbar.openSnackBar(mensaje, 'success');
    this.ref.close(true);
  }

  private fallo(e: any): void {
    this.guardando = false;
    this.snackbar.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error);
  }
}
