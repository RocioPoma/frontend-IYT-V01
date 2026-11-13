import { Component, Input, OnChanges, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CompetenciaService, FilaRanking } from '../servicios/competencia.service';
import { environment } from 'src/environments/environment';

/** Ranking de jugadores (RF05.9.2.8.4): goleadores, encestadores, etc. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manage-ranking-jugadores',
  templateUrl: './ranking-jugadores.component.html',
  styleUrls: ['./competencia.scss'],
})
export class RankingJugadoresComponent implements OnInit, OnChanges {
  @Input() idContempla: number | string | null = null;

  tipos: { id_hecho: number; nombre: string }[] = [];
  idHecho = 1;
  filas: FilaRanking[] = [];
  cargando = false;
  columnas = ['posicion', 'jugador', 'club', 'total'];
  imgUrl = environment.apiUrl + '/uploads/img/';

  constructor(private competencia: CompetenciaService) {}

  ngOnInit(): void {
    this.competencia.tiposHecho().subscribe({ next: (t) => (this.tipos = t), error: () => (this.tipos = []) });
  }

  ngOnChanges(): void {
    this.cargar();
  }

  cargar(): void {
    if (!this.idContempla) return;
    this.cargando = true;
    this.competencia.ranking(this.idContempla, this.idHecho).subscribe({
      next: (f) => { this.filas = f; this.cargando = false; },
      error: () => { this.filas = []; this.cargando = false; },
    });
  }
}
