import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompetenciaService, Partido } from '../servicios/competencia.service';
import { CanchaService, Cancha } from '../servicios/cancha.service';
import { ArbitroService } from '../servicios/arbitro.service';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';

/** Asignar fecha, hora, campo de juego y árbitro a un partido (RF05.9.2.8.2.4.1 a .3). */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-programar-partido',
  template: `
    <h2 mat-dialog-title>Programar partido</h2>
    <mat-dialog-content>
      <p class="titulo-partido"><b>{{ p.equipo1 }}</b> vs <b>{{ p.equipo2 }}</b></p>
      <form [formGroup]="form" class="form-programar">
        <mat-form-field appearance="outline">
          <mat-label>Fecha</mat-label>
          <input matInput type="date" formControlName="fecha" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Hora</mat-label>
          <input matInput type="time" formControlName="hora" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Campo de juego</mat-label>
          <mat-select formControlName="id_cancha">
            <mat-option [value]="null">Sin asignar</mat-option>
            <mat-option *ngFor="let c of canchas" [value]="c.id_cancha">{{ c.nombre }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Árbitro</mat-label>
          <mat-select formControlName="id_arbitro">
            <mat-option [value]="null">Sin asignar</mat-option>
            <mat-option *ngFor="let a of arbitros" [value]="a.ci">{{ a.nombre }} {{ a.ap_paterno }} {{ a.ap_materno }}</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="guardar()" [disabled]="guardando">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-programar { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; } .titulo-partido { text-align: center; margin-bottom: 12px; }
            @media (max-width: 500px) { .form-programar { grid-template-columns: 1fr; } }`],
})
export class ProgramarPartidoComponent implements OnInit {
  form: FormGroup;
  canchas: Cancha[] = [];
  arbitros: any[] = [];
  guardando = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public p: Partido,
    fb: FormBuilder,
    private competencia: CompetenciaService,
    private canchaService: CanchaService,
    private arbitroService: ArbitroService,
    private snackbar: SnackbarService,
    private ref: MatDialogRef<ProgramarPartidoComponent>
  ) {
    this.form = fb.group({
      fecha: [p.fecha ? String(p.fecha).substring(0, 10) : null],
      hora: [p.hora_f || null],
      id_cancha: [p.id_cancha ?? null],
      id_arbitro: [p.id_arbitro ?? null],
    });
  }

  ngOnInit(): void {
    this.canchaService.listar(true).subscribe((c) => (this.canchas = c));
    this.arbitroService.getArbitro().subscribe((a: any) => (this.arbitros = (a || []).filter((x: any) => x.estado !== 'false')));
  }

  guardar(): void {
    this.guardando = true;
    this.competencia.programar({ id_partido: this.p.id_partido, ...this.form.value }).subscribe({
      next: (r) => { this.snackbar.openSnackBar(r.message, 'success'); this.ref.close(true); },
      error: (e) => {
        this.guardando = false;
        this.snackbar.openSnackBar(e.error?.message || GlobalCostants.genericError, GlobalCostants.error);
      },
    });
  }
}
