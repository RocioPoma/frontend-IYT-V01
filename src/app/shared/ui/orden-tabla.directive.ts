import { Directive, DoCheck, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

/** Valor comparable de una celda: números como número, fechas dd-mm-aaaa como aaaammdd, texto sin tildes ni mayúsculas. */
export function valorOrden(fila: any, columna: string): string | number {
  const v = columna.split('.').reduce((o, k) => (o == null ? o : o[k]), fila);
  if (v == null) return '';
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const s = String(v).trim();
  const fecha = /^(\d{2})[-/](\d{2})[-/](\d{4})/.exec(s);
  if (fecha) return Number(fecha[3] + fecha[2] + fecha[1]);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return Number(s.slice(0, 10).replace(/-/g, ''));
  if (s !== '' && !isNaN(Number(s))) return Number(s);
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function comparar(a: any, b: any, orden: Sort): number {
  const x = valorOrden(a, orden.active);
  const y = valorOrden(b, orden.active);
  const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'es');
  return orden.direction === 'asc' ? r : -r;
}

/**
 * Hace ordenables todas las tablas que tengan `matSort`: conecta el MatSort con el
 * MatTableDataSource (aunque se reemplace al recargar datos) y también ordena
 * tablas alimentadas con un arreglo simple.
 */
@Directive({ selector: 'table[mat-table][matSort]', standalone: false })
export class OrdenTablaDirective implements OnInit, DoCheck, OnDestroy {
  @Input() dataSource: any;
  private readonly sort = inject(MatSort);
  private readonly tabla = inject(MatTable, { optional: true });
  private conectado: any = null;
  private sub?: Subscription;

  ngOnInit(): void {
    this.sort.disableClear = true;
    this.sub = this.sort.sortChange.subscribe((s) => this.ordenarArreglo(s));
  }

  ngDoCheck(): void {
    const ds = this.dataSource;
    if (ds instanceof MatTableDataSource && ds !== this.conectado) {
      this.conectado = ds;
      ds.sortingDataAccessor = valorOrden;
      ds.sort = this.sort;
    }
  }

  private ordenarArreglo(s: Sort): void {
    if (!Array.isArray(this.dataSource) || !s.direction) return;
    this.dataSource.sort((a, b) => comparar(a, b, s));
    this.tabla?.renderRows();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
