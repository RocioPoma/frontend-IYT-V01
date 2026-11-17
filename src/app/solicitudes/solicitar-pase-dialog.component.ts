import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SolicitudesService } from './solicitudes.service';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';
import { leerToken } from '../shared/permisos';

/** Paso 1 del pase: el delegado del club de destino busca al jugador por CI y solicita el pase. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-solicitar-pase-dialog',
  template: `
    <mat-toolbar color="primary"><mat-toolbar-row><span class="title-center">Solicitar pase de jugador</span></mat-toolbar-row></mat-toolbar>
    <mat-dialog-content>
      <p class="aviso-flujo">
        <mat-icon>info</mat-icon>
        <span>1) Usted solicita el pase · 2) el club de origen lo acepta · 3) el comité técnico lo aprueba y el jugador pasa a su club.</span>
      </p>
      <div class="buscar">
        <mat-form-field appearance="fill">
          <mat-label>CI del jugador</mat-label>
          <input matInput [formControl]="ci" (keyup.enter)="buscar()" autocomplete="off" />
        </mat-form-field>
        <button mat-stroked-button color="primary" (click)="buscar()" [disabled]="ci.invalid || buscando"><mat-icon>search</mat-icon> Buscar</button>
      </div>
      <p class="error" *ngIf="mensaje">{{ mensaje }}</p>
      <div class="jugador" *ngIf="jugador">
        <mat-icon>person</mat-icon>
        <div>
          <b>{{ jugador.nombre }} {{ jugador.ap_paterno }} {{ jugador.ap_materno }}</b><br />
          <small>CI {{ jugador.ci }} · Club actual: <b>{{ jugador.club }}</b></small>
        </div>
      </div>
      <ng-container *ngIf="jugador && !mismoClub">
        <mat-form-field appearance="fill" class="ancho">
          <mat-label>Comentario (opcional)</mat-label>
          <textarea matInput [formControl]="observacion" rows="2" maxlength="500"></textarea>
        </mat-form-field>
        <input type="file" class="ocultar" accept="application/pdf,image/*" (change)="elegir($event)" #inputDoc />
        <button mat-stroked-button type="button" (click)="inputDoc.click()"><mat-icon>attach_file</mat-icon> Hoja de pase (opcional)</button>
        <span class="nombre-archivo"> {{ documento?.name }}</span>
      </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-flat-button color="primary" [disabled]="!jugador || mismoClub || enviando" (click)="solicitar()"><mat-icon>send</mat-icon> Solicitar pase</button>
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./solicitudes.scss'],
  styles: [`.buscar { display: flex; gap: 12px; align-items: center; } .jugador { display: flex; gap: 10px; align-items: center; padding: 10px; background: #f5f5f5; border-radius: 8px; margin-bottom: 12px; }
            .error { color: #c62828; } .ancho { width: 100%; }`],
})
export class SolicitarPaseDialogComponent {
  ci = new FormControl('', [Validators.required, Validators.minLength(4)]);
  observacion = new FormControl('');
  jugador: any = null;
  documento: File | null = null;
  mensaje = '';
  buscando = false;
  enviando = false;
  private miClub = leerToken()?.id_club;

  constructor(private solicitudes: SolicitudesService, private snackbar: SnackbarService, private ref: MatDialogRef<SolicitarPaseDialogComponent>) {}

  get mismoClub(): boolean {
    return !!this.jugador && String(this.jugador.clubId) === String(this.miClub);
  }

  buscar(): void {
    this.mensaje = '';
    this.jugador = null;
    this.buscando = true;
    this.solicitudes.buscarJugador(String(this.ci.value).trim()).subscribe({
      next: (j) => {
        this.buscando = false;
        this.jugador = j;
        if (this.mismoClub) this.mensaje = 'Este jugador ya pertenece a su club.';
      },
      error: (e) => { this.buscando = false; this.mensaje = e?.error?.message || 'No se encontró el jugador'; },
    });
  }

  elegir(ev: Event): void {
    this.documento = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  solicitar(): void {
    const fd = new FormData();
    fd.append('ci', this.jugador.ci);
    if (this.observacion.value) fd.append('observacion', this.observacion.value);
    if (this.documento) fd.append('documento', this.documento);
    this.enviando = true;
    this.solicitudes.solicitarPase(fd).subscribe({
      next: (r) => { this.snackbar.openSnackBar(r.message, 'success'); this.ref.close(true); },
      error: (e) => { this.enviando = false; this.snackbar.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error); },
    });
  }
}
