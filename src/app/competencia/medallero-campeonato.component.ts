import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CompetenciaService, Medallero } from '../servicios/competencia.service';

/** Medallero general de un campeonato: medallas por club. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-medallero-campeonato',
  template: `
    <div class="bloque">
      <div class="bloque-cabecera"><h3>Medallero del campeonato</h3></div>
      <p class="vacio" *ngIf="!datos?.resumen?.length">Todavía no hay medallas registradas.</p>
      <div class="tabla-scroll" *ngIf="datos?.resumen?.length">
        <table mat-table [dataSource]="datos!.resumen" class="tabla-competencia">
          <ng-container matColumnDef="pos"><th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let f; let i = index"><span class="pos" [class.podio]="i < 3">{{ i + 1 }}</span></td></ng-container>
          <ng-container matColumnDef="club"><th mat-header-cell *matHeaderCellDef class="izq">Club</th>
            <td mat-cell *matCellDef="let f" class="izq"><b>{{ f.club }}</b></td></ng-container>
          <ng-container matColumnDef="oro"><th mat-header-cell *matHeaderCellDef>🥇</th><td mat-cell *matCellDef="let f">{{ f.oro }}</td></ng-container>
          <ng-container matColumnDef="plata"><th mat-header-cell *matHeaderCellDef>🥈</th><td mat-cell *matCellDef="let f">{{ f.plata }}</td></ng-container>
          <ng-container matColumnDef="bronce"><th mat-header-cell *matHeaderCellDef>🥉</th><td mat-cell *matCellDef="let f">{{ f.bronce }}</td></ng-container>
          <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th><td mat-cell *matCellDef="let f">{{ f.total }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas"></tr>
        </table>
      </div>
    </div>`,
  styleUrls: ['./competencia.scss'],
})
export class MedalleroCampeonatoComponent implements OnChanges {
  @Input() idCampeonato: number | string | null = null;
  datos: Medallero | null = null;
  columnas = ['pos', 'club', 'oro', 'plata', 'bronce', 'total'];

  constructor(private competencia: CompetenciaService) {}

  ngOnChanges(): void {
    if (!this.idCampeonato) return;
    this.competencia.medalleroCampeonato(this.idCampeonato).subscribe({ next: (d) => (this.datos = d), error: () => (this.datos = null) });
  }
}
