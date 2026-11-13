import { Component, Input, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CompetenciaService, FilaPosicion } from '../servicios/competencia.service';
import { environment } from 'src/environments/environment';

/** Tabla de posiciones (RF05.9.2.8.3): PTS, PJ, PG, PE, PP, GF, GC, DG. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manage-tabla-posiciones',
  templateUrl: './tabla-posiciones.component.html',
  styleUrls: ['./competencia.scss'],
})
export class TablaPosicionesComponent implements OnChanges, OnDestroy {
  @Input() idContempla: number | string | null = null;
  @Input() idSerie: number | string | null = null;

  filas: FilaPosicion[] = [];
  enVivo = false;
  cargando = false;
  error = '';
  columnas = ['posicion', 'equipo', 'pts', 'pj', 'pg', 'pe', 'pp', 'gf', 'gc', 'dg', 'rendimiento'];
  imgUrl = environment.apiUrl + '/uploads/img/';
  private temporizador: any;

  constructor(private competencia: CompetenciaService) {}

  ngOnChanges(): void {
    this.cargar();
  }

  cambiarEnVivo(valor: boolean): void {
    this.enVivo = valor;
    clearInterval(this.temporizador);
    // En vivo: se actualiza sola cada 30 segundos (tabla "en tiempo real", RF01)
    if (valor) this.temporizador = setInterval(() => this.cargar(true), 30000);
    this.cargar();
  }

  cargar(silencioso = false): void {
    if (!this.idContempla) return;
    if (!silencioso) this.cargando = true;
    this.competencia.tabla(this.idContempla, { idSerie: this.idSerie ?? undefined, enVivo: this.enVivo }).subscribe({
      next: (f) => { this.filas = f; this.cargando = false; this.error = ''; },
      error: () => { this.cargando = false; this.error = 'No se pudo cargar la tabla de posiciones'; },
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }
}
