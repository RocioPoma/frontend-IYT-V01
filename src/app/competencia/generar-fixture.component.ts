import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

export interface DatosGenerarFixture {
  categoria: string;
  porSerie: boolean;
  equipos: { id_club: number; nombre_club: string; comunidad?: string; logo?: string | null; id_serie?: number | null }[];
}

export interface OpcionesFixture {
  fecha_inicio: string | null;
  dias_entre_fechas: number;
  hora: string | null;
}

/** Vista previa de los equipos (logo y nombre) y opciones del fixture: fecha de inicio y hora, ambas opcionales. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-generar-fixture',
  template: `
    <mat-toolbar><span>Generar fixture</span></mat-toolbar>
    <mat-dialog-content>
      <p class="categoria">{{ d.categoria }}</p>

      <div class="series">
        <div class="serie" *ngFor="let s of series">
          <div class="serie-titulo">
            <span>{{ s.nombre }}</span>
            <small>{{ s.equipos.length }} equipos · {{ partidos(s.equipos.length) }} partido{{ partidos(s.equipos.length) === 1 ? '' : 's' }} · {{ jornadas(s.equipos.length) }} fecha{{ jornadas(s.equipos.length) === 1 ? '' : 's' }}</small>
          </div>
          <div class="equipo" *ngFor="let e of s.equipos; index as i">
            <span class="num">{{ i + 1 }}</span>
            <span class="escudo">
              <img *ngIf="e.logo; else sinLogo" [src]="urlArchivos + e.logo + '?ancho=128'" alt="" />
              <ng-template #sinLogo><mat-icon>shield</mat-icon></ng-template>
            </span>
            <span class="nombre">{{ e.nombre_club }}<small *ngIf="e.comunidad">{{ e.comunidad }}</small></span>
          </div>
          <p class="aviso" *ngIf="s.equipos.length < 2"><mat-icon>warning</mat-icon> Se necesitan al menos 2 equipos aprobados.</p>
        </div>
      </div>

      <h3>Programación (opcional)</h3>
      <p class="nota">Si indica la fecha de la primera jornada, cada fecha siguiente se programa con los días indicados. La hora tampoco es obligatoria y se puede cambiar en cada partido.</p>
      <form [formGroup]="form" class="opciones">
        <mat-form-field appearance="outline">
          <mat-label>Fecha de la primera jornada</mat-label>
          <input matInput type="date" formControlName="fecha_inicio" />
          <mat-hint>Opcional</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Días entre jornadas</mat-label>
          <input matInput type="number" min="1" max="60" formControlName="dias_entre_fechas" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Hora de los partidos</mat-label>
          <input matInput type="time" formControlName="hora" />
          <mat-hint>Opcional</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button color="primary" (click)="generar()" [disabled]="form.invalid || !puedeGenerar">
        <mat-icon>auto_awesome</mat-icon> Generar
      </button>
      <button mat-raised-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .categoria { margin: 0 0 12px; font-weight: 600; text-transform: uppercase; color: #24343a; }
    .series { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
    .serie { border: 1px solid #e1e8e6; border-radius: 12px; padding: 10px 12px; background: #f9fbfa; }
    .serie-titulo { display: flex; flex-direction: column; margin-bottom: 6px; }
    .serie-titulo span { font-weight: 600; color: #00796b; }
    .serie-titulo small { color: #5f7176; font-size: 12px; }
    .equipo { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-top: 1px solid #edf1f0; text-align: left; }
    .num { width: 18px; color: #5f7176; font-size: 12px; text-align: right; }
    .escudo { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: #e0f2f1; color: #00796b;
              display: inline-flex; align-items: center; justify-content: center; flex: 0 0 34px; }
    .escudo img { width: 100%; height: 100%; object-fit: cover; }
    .escudo mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .nombre { display: flex; flex-direction: column; font-weight: 500; font-size: 14px; }
    .nombre small { font-weight: 400; color: #5f7176; font-size: 12px; }
    .aviso { display: flex; align-items: center; gap: 6px; color: #e65100; font-size: 13px; margin: 6px 0 0; }
    h3 { margin: 18px 0 4px; font-size: 15px; font-weight: 600; }
    .nota { margin: 0 0 12px; font-size: 12.5px; color: #5f7176; }
    .opciones { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 12px; }
    @media (max-width: 700px) { .opciones { grid-template-columns: 1fr; } }
  `],
})
export class GenerarFixtureComponent {
  readonly urlArchivos = environment.apiUrl + '/uploads/img/';
  form: FormGroup;
  series: { nombre: string; equipos: DatosGenerarFixture['equipos'] }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: DatosGenerarFixture,
    private ref: MatDialogRef<GenerarFixtureComponent, OpcionesFixture>,
    fb: FormBuilder,
  ) {
    this.form = fb.group({
      fecha_inicio: [null],
      dias_entre_fechas: [7, [Validators.required, Validators.min(1), Validators.max(60)]],
      hora: [null],
    });
    this.series = d.porSerie
      ? [1, 2].map((n) => ({ nombre: 'Serie ' + (n === 1 ? 'A' : 'B'), equipos: d.equipos.filter((e) => Number(e.id_serie) === n) }))
      : [{ nombre: 'Todos contra todos', equipos: d.equipos }];
  }

  get puedeGenerar(): boolean {
    return this.series.some((s) => s.equipos.length >= 2);
  }

  partidos(n: number): number {
    return (n * (n - 1)) / 2;
  }

  jornadas(n: number): number {
    return n < 2 ? 0 : n % 2 === 0 ? n - 1 : n;
  }

  generar(): void {
    const v = this.form.value;
    this.ref.close({ fecha_inicio: v.fecha_inicio || null, dias_entre_fechas: Number(v.dias_entre_fechas) || 7, hora: v.hora || null });
  }
}
