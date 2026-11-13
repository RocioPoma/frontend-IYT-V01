import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompetenciaService, Partido } from '../servicios/competencia.service';
import { environment } from 'src/environments/environment';
import { puede } from '../shared/permisos';
import { ProgramarPartidoComponent } from './programar-partido.component';

/** Fixture agrupado por fecha (ronda). Con permiso de partidos permite programar fecha, hora, cancha y árbitro. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./competencia.scss'],
})
export class FixtureComponent implements OnChanges {
  @Input() idContempla: number | string | null = null;
  @Input() idSerie: number | string = 0;
  /** Muestra el botón "Programar" (solo en el panel interno) */
  @Input() editable = false;

  rondas: { numero: number | null; partidos: Partido[] }[] = [];
  todos: Partido[] = [];
  clubs: string[] = [];
  filtroClub = '';
  cargando = false;
  imgUrl = environment.apiUrl + '/uploads/img/';

  constructor(private competencia: CompetenciaService, private dialog: MatDialog) {}

  get puedeProgramar(): boolean {
    return this.editable && puede('PARTIDOS');
  }

  ngOnChanges(): void {
    this.cargar();
  }

  cargar(): void {
    if (!this.idContempla) return;
    this.cargando = true;
    this.competencia.partidos(this.idContempla, this.idSerie).subscribe({
      next: (p) => {
        this.todos = p;
        this.clubs = [...new Set(p.flatMap((x) => [x.equipo1, x.equipo2]))].sort();
        this.agrupar();
        this.cargando = false;
      },
      error: () => { this.todos = []; this.rondas = []; this.cargando = false; },
    });
  }

  /** RF05.9.2.8.2.3: filtrar el fixture por club */
  agrupar(): void {
    const lista = this.filtroClub
      ? this.todos.filter((p) => p.equipo1 === this.filtroClub || p.equipo2 === this.filtroClub)
      : this.todos;
    const mapa = new Map<number | null, Partido[]>();
    for (const p of lista) {
      const k = p.ronda ?? null;
      mapa.set(k, [...(mapa.get(k) || []), p]);
    }
    this.rondas = [...mapa.entries()].map(([numero, partidos]) => ({ numero, partidos }));
  }

  programar(p: Partido): void {
    const ref = this.dialog.open(ProgramarPartidoComponent, { width: '480px', data: p });
    ref.afterClosed().subscribe((ok) => ok && this.cargar());
  }

  claseEstado(estado: string): string {
    return estado === 'En vivo' ? 'vivo' : estado === 'Cerrado' ? 'cerrado' : '';
  }
}
