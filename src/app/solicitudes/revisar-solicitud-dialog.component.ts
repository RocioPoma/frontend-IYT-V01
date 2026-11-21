import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SolicitudesService, SolicitudJugador } from './solicitudes.service';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';

type Vista = 'pdf' | 'imagen' | 'otro' | 'ninguno';

/**
 * Revisión de una solicitud de jugador por el comité técnico:
 * a la izquierda el formulario con todos los datos (se pueden corregir),
 * a la derecha el documento adjunto (PDF o imagen) para compararlos.
 */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-revisar-solicitud-dialog',
  template: `
    <mat-toolbar class="barra-revisar">
      <div class="titulo">
        <span>Revisar solicitud · {{ s.tipo === 'alta' ? 'Jugador nuevo' : 'Actualización' }}</span>
        <small>{{ s.club }}{{ s.comunidad_club ? ' - ' + s.comunidad_club : '' }} · enviada {{ s.fecha_solicitud_f }}{{ s.solicitado_por_nombre ? ' por ' + s.solicitado_por_nombre : '' }}</small>
      </div>
    </mat-toolbar>

    <mat-dialog-content class="contenido">
      <div class="paneles">
        <!-- ============ DATOS ============ -->
        <section class="panel datos">
          <div class="foto">
            <img [src]="urlFoto || 'assets/img/user1.png'" alt="Foto del jugador" />
            <div>
              <b>{{ nombreCompleto }}</b>
              <span>CI {{ s.ci }}</span>
              <span class="aviso-edicion" *ngIf="corregido"><mat-icon>edit</mat-icon> Datos corregidos sin guardar</span>
            </div>
          </div>

          <form [formGroup]="form" class="form">
            <mat-form-field appearance="outline">
              <mat-label>CI</mat-label>
              <input matInput formControlName="ci" />
              <mat-hint *ngIf="s.tipo === 'actualizacion'">No se puede modificar</mat-hint>
              <mat-error>CI obligatorio (4 a 15 caracteres)</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Club</mat-label>
              <input matInput [value]="s.club" disabled />
            </mat-form-field>
            <mat-form-field appearance="outline" class="ancho">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" />
              <mat-hint *ngIf="antes('nombre') as a">Lista oficial: {{ a }}</mat-hint>
              <mat-error>El nombre es obligatorio</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Apellido paterno</mat-label>
              <input matInput formControlName="ap_paterno" />
              <mat-hint *ngIf="antes('ap_paterno') as a">Lista oficial: {{ a }}</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Apellido materno</mat-label>
              <input matInput formControlName="ap_materno" />
              <mat-hint *ngIf="antes('ap_materno') as a">Lista oficial: {{ a }}</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Fecha de nacimiento</mat-label>
              <input matInput type="date" formControlName="fecha_nacimiento" />
              <mat-hint>{{ edad }}<ng-container *ngIf="antes('fecha_nacimiento') as a"> · Lista oficial: {{ a }}</ng-container></mat-hint>
              <mat-error>La fecha de nacimiento es obligatoria</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Sexo</mat-label>
              <mat-select formControlName="sexo">
                <mat-option *ngFor="let x of sexos" [value]="x">{{ x }}</mat-option>
              </mat-select>
              <mat-hint *ngIf="antes('sexo') as a">Lista oficial: {{ a }}</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline" class="ancho">
              <mat-label>Descendencia</mat-label>
              <mat-select formControlName="decendencia">
                <mat-option *ngFor="let x of decendencias" [value]="x">{{ x }}</mat-option>
              </mat-select>
              <mat-hint *ngIf="antes('decendencia') as a">Lista oficial: {{ a }}</mat-hint>
            </mat-form-field>
          </form>

          <div class="observar" *ngIf="modoObservar">
            <mat-form-field appearance="outline" class="ancho-total" floatLabel="always">
              <mat-label>Observación para el delegado</mat-label>
              <textarea matInput rows="3" [(ngModel)]="observacion" placeholder="Indique qué debe corregir" maxlength="500"></textarea>
              <mat-hint align="end">{{ observacion.length }}/500</mat-hint>
            </mat-form-field>
          </div>
        </section>

        <!-- ============ DOCUMENTO ============ -->
        <section class="panel documento">
          <div class="doc-cab">
            <span><mat-icon>description</mat-icon> {{ s.documento ? 'Documento adjunto' : (s.actual_documento ? 'Documento de la lista oficial' : 'Documento') }}</span>
            <a *ngIf="urlAbrir" mat-button [href]="urlAbrir" target="_blank" rel="noopener"><mat-icon>open_in_new</mat-icon> Abrir en otra pestaña</a>
          </div>
          <div class="visor">
            <mat-progress-bar *ngIf="cargandoDoc" mode="indeterminate"></mat-progress-bar>
            <iframe *ngIf="vista === 'pdf' && urlVisor" [src]="urlVisor" title="Documento del jugador"></iframe>
            <img *ngIf="vista === 'imagen' && urlVisor" [src]="urlVisor" alt="Documento del jugador" />
            <div class="sin-doc" *ngIf="vista === 'otro'">
              <mat-icon>insert_drive_file</mat-icon>
              <p>Este archivo no se puede mostrar aquí.<br />Ábralo en otra pestaña para revisarlo.</p>
            </div>
            <div class="sin-doc" *ngIf="vista === 'ninguno' && !cargandoDoc">
              <mat-icon>block</mat-icon>
              <p>La solicitud no tiene documento adjunto.</p>
            </div>
          </div>
        </section>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="acciones">
      <ng-container *ngIf="!modoObservar">
        <button mat-flat-button color="primary" (click)="aceptar()" [disabled]="guardando || form.invalid">
          <mat-icon>check</mat-icon> {{ corregido ? 'Guardar correcciones y aceptar' : 'Aceptar' }}
        </button>
        <button mat-stroked-button color="primary" *ngIf="corregido" (click)="guardar()" [disabled]="guardando || form.invalid">
          <mat-icon>save</mat-icon> Solo guardar correcciones
        </button>
        <button mat-stroked-button color="primary" (click)="modoObservar = true" [disabled]="guardando">
          <mat-icon>feedback</mat-icon> Observar
        </button>
      </ng-container>
      <ng-container *ngIf="modoObservar">
        <button mat-flat-button color="primary" (click)="observar()" [disabled]="guardando || observacion.trim().length < 3">
          <mat-icon>send</mat-icon> Enviar observación
        </button>
        <button mat-stroked-button (click)="modoObservar = false">Volver</button>
      </ng-container>
      <span class="espaciador"></span>
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .barra-revisar { height: auto !important; min-height: 64px !important; padding: 10px 20px !important; }
    .titulo { display: flex; flex-direction: column; line-height: 1.3; white-space: normal; }
    .titulo span { font-size: 17px; font-weight: 500; }
    .titulo small { font-size: 12.5px; opacity: .8; }
    .contenido { max-height: 78vh !important; }
    .paneles { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 16px; align-items: stretch; }
    .panel { border: 1px solid #e1e8e6; border-radius: 12px; padding: 14px; min-width: 0; background: #fff; }
    .foto { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; text-align: left; }
    .foto img { width: 84px; height: 84px; border-radius: 12px; object-fit: cover; border: 2px solid #e0f2f1; }
    .foto div { display: flex; flex-direction: column; gap: 2px; }
    .foto b { font-size: 16px; text-transform: uppercase; }
    .foto span { color: #5f7176; font-size: 13px; }
    .aviso-edicion { display: inline-flex; align-items: center; gap: 4px; color: #e65100 !important; font-weight: 500; }
    .aviso-edicion mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .form { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; }
    .form .ancho { grid-column: 1 / -1; }
    .ancho-total { width: 100%; }
    .observar { margin-top: 10px; }
    .documento { display: flex; flex-direction: column; padding: 0; overflow: hidden; }
    .doc-cab { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;
               padding: 6px 8px 6px 14px; background: #f6f9f8; border-bottom: 1px solid #e1e8e6; }
    .doc-cab span { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: #053a31; font-size: 14px; }
    .doc-cab span mat-icon { color: #00796b; }
    .visor { flex: 1 1 auto; min-height: 62vh; display: flex; flex-direction: column; background: #525659; }
    .visor iframe { flex: 1 1 auto; width: 100%; min-height: 62vh; border: 0; background: #fff; }
    .visor img { max-width: 100%; max-height: 70vh; object-fit: contain; margin: auto; display: block; background: #fff; }
    .sin-doc { margin: auto; text-align: center; color: #eceff1; padding: 24px; }
    .sin-doc mat-icon { font-size: 44px; width: 44px; height: 44px; opacity: .7; }
    .acciones { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 24px 18px !important; justify-content: flex-start !important; }
    .espaciador { flex: 1 1 auto; }
    @media (max-width: 900px) {
      .paneles { grid-template-columns: 1fr; }
      .visor, .visor iframe { min-height: 55vh; }
    }
    @media (max-width: 520px) { .form { grid-template-columns: 1fr; } }
  `],
})
export class RevisarSolicitudDialogComponent implements OnInit, OnDestroy {
  readonly sexos = ['Femenino', 'Masculino'];
  readonly decendencias = ['Neto', 'Yern@', 'Nieto'];
  private readonly base = environment.apiUrl + '/uploads/img/';

  s: SolicitudJugador;
  form: FormGroup;
  vista: Vista = 'ninguno';
  urlVisor: SafeResourceUrl | string | null = null;
  urlAbrir: string | null = null;
  urlFoto: string | null = null;
  cargandoDoc = false;
  guardando = false;
  modoObservar = false;
  observacion = '';
  private blobUrl: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { solicitud: SolicitudJugador },
    private ref: MatDialogRef<RevisarSolicitudDialogComponent, boolean>,
    private fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private solicitudes: SolicitudesService,
    private snackbar: SnackbarService,
  ) {
    this.s = data.solicitud;
    this.form = this.fb.group({
      ci: [{ value: this.s.ci, disabled: this.s.tipo !== 'alta' }, [Validators.required, Validators.pattern(/^[0-9A-Za-z-]{4,15}$/)]],
      nombre: [this.s.nombre, [Validators.required, Validators.minLength(2)]],
      ap_paterno: [this.s.ap_paterno || ''],
      ap_materno: [this.s.ap_materno || ''],
      fecha_nacimiento: [this.s.fecha_nacimiento, Validators.required],
      sexo: [this.s.sexo, Validators.required],
      decendencia: [this.s.decendencia || null],
    });
  }

  ngOnInit(): void {
    const foto = this.s.foto || this.s.actual_foto;
    if (foto) this.urlFoto = this.conToken(foto);
    this.cargarDocumento();
  }

  ngOnDestroy(): void {
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
  }

  /** Hay datos distintos a los enviados por el delegado */
  get corregido(): boolean {
    const v = this.form.getRawValue();
    return ['ci', 'nombre', 'ap_paterno', 'ap_materno', 'fecha_nacimiento', 'sexo', 'decendencia']
      .some((k) => String(v[k] ?? '').trim() !== String((this.s as any)[k] ?? '').trim());
  }

  get nombreCompleto(): string {
    const v = this.form.getRawValue();
    return [v.nombre, v.ap_paterno, v.ap_materno].filter(Boolean).join(' ');
  }

  get edad(): string {
    const f = this.form.value.fecha_nacimiento;
    if (!f) return '';
    const n = new Date(f + 'T12:00:00');
    const h = new Date();
    let e = h.getFullYear() - n.getFullYear();
    if (h < new Date(h.getFullYear(), n.getMonth(), n.getDate())) e--;
    return isNaN(e) ? '' : `${e} años`;
  }

  /** En actualizaciones, el valor de la lista oficial si es distinto al solicitado */
  antes(campo: string): string | null {
    if (this.s.tipo !== 'actualizacion') return null;
    const a = (this.s as any)['actual_' + campo];
    const v = this.form.getRawValue()[campo];
    return a != null && String(a) !== String(v ?? '') ? String(a) : null;
  }

  private conToken(nombre: string): string {
    const token = localStorage.getItem('token') || '';
    return `${this.base}${encodeURIComponent(nombre)}?token=${encodeURIComponent(token)}`;
  }

  /** El documento se descarga y se muestra desde la memoria del navegador (funciona aunque el servidor esté en otro dominio). */
  private async cargarDocumento(): Promise<void> {
    const nombre = this.s.documento || this.s.actual_documento;
    if (!nombre) { this.vista = 'ninguno'; return; }
    this.urlAbrir = this.conToken(nombre);
    const ext = (nombre.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) { this.vista = 'otro'; return; }
    this.cargandoDoc = true;
    try {
      const blob = await firstValueFrom(this.http.get(this.base + encodeURIComponent(nombre), { responseType: 'blob' }));
      const tipo = ext === 'pdf' ? 'application/pdf' : blob.type || 'image/' + ext;
      this.blobUrl = URL.createObjectURL(new Blob([blob], { type: tipo }));
      if (ext === 'pdf') {
        this.vista = 'pdf';
        this.urlVisor = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl + '#navpanes=0&view=FitH');
      } else {
        this.vista = 'imagen';
        this.urlVisor = this.sanitizer.bypassSecurityTrustUrl(this.blobUrl) as any;
      }
    } catch {
      this.vista = 'otro';
    } finally {
      this.cargandoDoc = false;
    }
  }

  private datos(): FormData {
    const v = this.form.getRawValue();
    const fd = new FormData();
    for (const k of ['nombre', 'ap_paterno', 'ap_materno', 'fecha_nacimiento', 'sexo', 'decendencia']) fd.append(k, v[k] ?? '');
    if (this.s.tipo === 'alta') fd.append('ci', String(v.ci || '').trim());
    return fd;
  }

  async guardar(cerrar = true): Promise<boolean> {
    this.guardando = true;
    try {
      const r = await firstValueFrom(this.solicitudes.editarSolicitud(this.s.id, this.datos()));
      Object.assign(this.s, this.form.getRawValue());
      if (cerrar) { this.snackbar.openSnackBar(r.message, 'success'); this.ref.close(true); }
      return true;
    } catch (e) {
      this.error(e);
      return false;
    } finally {
      this.guardando = false;
    }
  }

  async aceptar(): Promise<void> {
    if (this.corregido && !(await this.guardar(false))) return;
    this.guardando = true;
    try {
      const r = await firstValueFrom(this.solicitudes.revisarJugador(this.s.id, 'aceptar'));
      this.snackbar.openSnackBar(r.message, 'success');
      this.ref.close(true);
    } catch (e) {
      this.error(e);
    } finally {
      this.guardando = false;
    }
  }

  async observar(): Promise<void> {
    this.guardando = true;
    try {
      const r = await firstValueFrom(this.solicitudes.revisarJugador(this.s.id, 'observar', this.observacion.trim()));
      this.snackbar.openSnackBar(r.message, 'success');
      this.ref.close(true);
    } catch (e) {
      this.error(e);
    } finally {
      this.guardando = false;
    }
  }

  private error(e: any): void {
    this.snackbar.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error);
  }
}
