import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CompetenciaService } from '../servicios/competencia.service';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';
import { puede } from '../shared/permisos';

/** Medallero de una categoría (RF05.9.2.8.5): 1.º, 2.º y 3.º lugar. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-medallero-categoria',
  templateUrl: './medallero-categoria.component.html',
  styleUrls: ['./competencia.scss'],
})
export class MedalleroCategoriaComponent implements OnChanges {
  @Input() idContempla: number | string | null = null;
  @Input() editable = false;

  puestos: { puesto: number; club: string; id_club: number }[] = [];
  equipos: { id_club: number; nombre_club: string }[] = [];
  seleccion: { primero: number | null; segundo: number | null; tercero: number | null } = { primero: null, segundo: null, tercero: null };
  guardando = false;

  readonly nombres = ['', 'Primer lugar', 'Segundo lugar', 'Tercer lugar'];
  readonly clases = ['', 'oro', 'plata', 'bronce'];

  constructor(private competencia: CompetenciaService, private snackbar: SnackbarService) {}

  get puedeEditar(): boolean {
    return this.editable && puede('PARTIDOS');
  }

  ngOnChanges(): void {
    this.cargar();
  }

  cargar(): void {
    if (!this.idContempla) return;
    this.competencia.medalleroCategoria(this.idContempla).subscribe((m) => {
      this.puestos = m;
      this.seleccion = {
        primero: m.find((x) => x.puesto === 1)?.id_club ?? null,
        segundo: m.find((x) => x.puesto === 2)?.id_club ?? null,
        tercero: m.find((x) => x.puesto === 3)?.id_club ?? null,
      };
    });
    if (this.puedeEditar) {
      this.competencia.equipos(this.idContempla).subscribe((e) => (this.equipos = e.filter((x) => x.estado !== 'rechazado')));
    }
  }

  guardar(): void {
    if (!this.seleccion.primero || !this.idContempla) return;
    this.guardando = true;
    this.competencia.registrarMedallero({ id_contempla: this.idContempla, ...this.seleccion } as any).subscribe({
      next: (r) => { this.guardando = false; this.snackbar.openSnackBar(r.message, 'success'); this.cargar(); },
      error: (e) => { this.guardando = false; this.snackbar.openSnackBar(e.error?.message || GlobalCostants.genericError, GlobalCostants.error); },
    });
  }

  eliminar(): void {
    if (!this.idContempla) return;
    this.competencia.eliminarMedallero(this.idContempla).subscribe({
      next: (r) => { this.snackbar.openSnackBar(r.message, 'success'); this.cargar(); },
      error: (e) => this.snackbar.openSnackBar(e.error?.message || GlobalCostants.genericError, GlobalCostants.error),
    });
  }
}
