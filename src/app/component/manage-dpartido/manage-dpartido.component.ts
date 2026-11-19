import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';
import { DpartidoService } from 'src/app/servicios/dpartido.service';
import { EquipoService } from 'src/app/servicios/equipo.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { PartidoComponent } from '../dialog/partido/partido.component';
import { rolPantalla } from '../../shared/permisos';
import { environment } from 'src/environments/environment';
import { ProgramarPartidoComponent } from 'src/app/competencia/programar-partido.component';
import { GenerarFixtureComponent, OpcionesFixture } from 'src/app/competencia/generar-fixture.component';
import { exportarFixturePDF } from 'src/app/shared/reporte-fixture';

interface Ronda { numero: number; fecha: string | null; partidos: any[]; descansa: string[]; }
interface Grupo { titulo: string; serie: number; partidos: any[]; rondas: Ronda[]; }

/** Fixture - Partidos de una categoría: generar (con logos, fecha y hora opcionales), programar, administrar y reporte PDF. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manage-dpartido',
  templateUrl: './manage-dpartido.component.html',
  styleUrls: ['./manage-dpartido.component.scss'],
})
export class ManageDpartidoComponent implements OnInit {
  readonly urlArchivos = environment.apiUrl + '/uploads/img/';
  id: string | null = '';
  role: any;
  dataCategoriad: any;
  grupos: Grupo[] = [];
  serieFiltro = '';
  texto = '';
  cargando = false;
  generandoPDF = false;

  constructor(
    private dpartidoService: DpartidoService,
    private dcategoriacampeonatoService: DcategoriacampeonatoService,
    private equipoService: EquipoService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id_contempla');
    this.role = rolPantalla('PARTIDOS'); // 'admin' = puede modificar en este módulo
    this.dcategoriacampeonatoService.getById(this.id).subscribe({
      next: (res) => {
        this.dataCategoriad = res;
        this.cargar();
      },
      error: () => this.cargar(),
    });
  }

  get porSerie(): boolean {
    return this.dataCategoriad?.sistema_de_juego === 'por serie';
  }

  get hayPartidos(): boolean {
    return this.grupos.some((g) => g.partidos.length > 0);
  }

  get resumen(): string {
    const c = this.dataCategoriad;
    const total = this.grupos.reduce((s, g) => s + g.partidos.length, 0);
    const base = c ? `${c.nombre_disciplina} ${c.nombre_categoria} · ${this.porSerie ? 'Por series' : 'Todos contra todos'}` : '';
    return total ? `${base} · ${total} partidos` : base;
  }

  /** Grupos con el filtro de serie y la búsqueda aplicados */
  get gruposVisibles(): Grupo[] {
    const t = this.normalizar(this.texto);
    return this.grupos
      .filter((g) => g.partidos.length && (!this.serieFiltro || g.titulo === this.serieFiltro))
      .map((g) => ({
        ...g,
        rondas: g.rondas
          .map((r) => ({ ...r, partidos: r.partidos.filter((p) => !t || this.normalizar(p.equipo1 + ' ' + p.equipo2).includes(t)) }))
          .filter((r) => r.partidos.length),
      }));
  }

  cargar(): void {
    this.cargando = true;
    // por series: serie 1 (A) y 2 (B); todos contra todos: serie 1 y, por compatibilidad, la 0
    const series = this.porSerie ? [1, 2] : [1, 0];
    forkJoin(series.map((s) => this.dpartidoService.get(this.id, s).pipe(catchError(() => of([]))))).subscribe((res: any[]) => {
      this.cargando = false;
      if (this.porSerie) {
        this.grupos = res.map((partidos, i) => this.armarGrupo('Serie ' + (i === 0 ? 'A' : 'B'), series[i], partidos || []));
      } else {
        this.grupos = [this.armarGrupo('Todos contra todos', 1, [...(res[0] || []), ...(res[1] || [])])];
      }
    });
  }

  private armarGrupo(titulo: string, serie: number, partidos: any[]): Grupo {
    const mapa = new Map<number, any[]>();
    partidos.forEach((p) => {
      const r = p.ronda || 1;
      if (!mapa.has(r)) mapa.set(r, []);
      mapa.get(r)!.push(p);
    });
    const equipos = new Set<string>();
    partidos.forEach((p) => { equipos.add(p.equipo1); equipos.add(p.equipo2); });
    const rondas = [...mapa.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([numero, ps]) => {
        const fechas = [...new Set(ps.map((p) => p.fecha_f).filter(Boolean))];
        const juegan = new Set<string>(ps.flatMap((p) => [p.equipo1, p.equipo2]));
        const descansa = [...equipos].filter((e) => !juegan.has(e));
        return { numero, fecha: fechas.length === 1 ? fechas[0] : fechas.length ? fechas.join(' / ') : null, partidos: ps, descansa };
      });
    return { titulo, serie, partidos, rondas };
  }

  applyFilter(event: Event): void {
    this.texto = (event.target as HTMLInputElement).value;
  }

  private normalizar(s: string): string {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  //--------------------------------- GENERAR FIXTURE ---------------------------------
  handleAddAction(): void {
    this.equipoService.get(this.id).subscribe({
      next: (equipos: any) => {
        const aprobados = (equipos || []).filter((e: any) => (e.estado || 'aprobado') === 'aprobado');
        const c = this.dataCategoriad || {};
        const ref = this.dialog.open(GenerarFixtureComponent, {
          width: '760px',
          maxWidth: '96vw',
          data: { categoria: `${c.nombre_disciplina || ''} ${c.nombre_categoria || ''}`.trim(), porSerie: this.porSerie, equipos: aprobados },
        });
        ref.afterClosed().subscribe((op?: OpcionesFixture) => op && this.generar(op, aprobados));
      },
      error: (e: any) => this.error(e),
    });
  }

  private generar(op: OpcionesFixture, equipos: any[]): void {
    const series = this.porSerie
      ? [1, 2].filter((s) => equipos.filter((e) => Number(e.id_serie) === s).length >= 2)
      : [1];
    if (!series.length) {
      this.snackbarService.openSnackBar('Se necesitan al menos 2 equipos aprobados', GlobalCostants.error);
      return;
    }
    this.cargando = true;
    forkJoin(series.map((s) => this.dpartidoService.addFixture({ id_contempla: this.id, id_serie: s, ...op }))).subscribe({
      next: (r: any[]) => {
        this.snackbarService.openSnackBar(r.map((x) => x.message).join(' · '), 'success');
        this.cargar();
      },
      error: (e: any) => {
        this.error(e);
        this.cargar();
      },
    });
  }

  handleDeleteAction(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { message: ' eliminar el presente fixture' };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe(() => {
      dialogRef.close();
      this.dpartidoService.deleteFixture(this.id).subscribe({
        next: (r: any) => {
          this.snackbarService.openSnackBar(r?.message, 'success');
          this.cargar();
        },
        error: (e: any) => this.error(e),
      });
    });
  }

  //--------------------------------- PROGRAMAR Y ADMINISTRAR ---------------------------------
  programar(p: any): void {
    const ref = this.dialog.open(ProgramarPartidoComponent, { width: '520px', maxWidth: '96vw', data: p });
    ref.afterClosed().subscribe((ok) => ok && this.cargar());
  }

  hechosPartido(id_partido: any, id_equipo1: any, id_equipo2: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { action: 'addHechos', id_partido, id_equipo1, id_equipo2, id_contempla: this.id };
    dialogConfig.width = '900px';
    dialogConfig.maxWidth = '96vw';
    const dialogRef = this.dialog.open(PartidoComponent, dialogConfig);
    this.router.events.subscribe(() => dialogRef.close());
    dialogRef.componentInstance.onAdd.subscribe(() => this.cargar());
  }

  //--------------------------------- REPORTE PDF ---------------------------------
  async reportePDF(): Promise<void> {
    const c = this.dataCategoriad || {};
    this.generandoPDF = true;
    try {
      await exportarFixturePDF({
        titulo: `FIXTURE ${c.nombre_disciplina || ''} ${c.nombre_categoria || ''}`.toUpperCase().trim(),
        subtitulo: [c.nombre_campeonato, c.gestion ? 'Gestión ' + c.gestion : '', c.genero].filter(Boolean).join(' · '),
        grupos: this.grupos.filter((g) => g.partidos.length).map((g) => ({ titulo: this.porSerie ? g.titulo.toUpperCase() : '', partidos: g.partidos })),
        urlArchivos: this.urlArchivos,
        archivo: 'fixture',
      });
    } finally {
      this.generandoPDF = false;
    }
  }

  private error(e: any): void {
    this.snackbarService.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error);
  }
}
