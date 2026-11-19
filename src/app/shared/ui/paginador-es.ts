import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/** Textos del paginador en español */
@Injectable()
export class PaginadorEs extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Filas por página:';
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
  override getRangeLabel = (pagina: number, tamano: number, total: number): string => {
    if (total === 0 || tamano === 0) return `0 de ${total}`;
    const inicio = pagina * tamano;
    const fin = Math.min(inicio + tamano, total);
    return `${inicio + 1} – ${fin} de ${total}`;
  };
}
