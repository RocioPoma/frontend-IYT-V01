import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Encabezado estándar de las pantallas: título a la izquierda y botones (contenido) a la derecha. */
@Component({
  selector: 'app-encabezado',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="pagina-cabecera">
      <div class="pagina-titulo">
        <span class="pagina-icono" *ngIf="icono"><mat-icon>{{ icono }}</mat-icon></span>
        <div>
          <h1>{{ titulo }}</h1>
          <p *ngIf="subtitulo">{{ subtitulo }}</p>
        </div>
      </div>
      <div class="pagina-acciones"><ng-content></ng-content></div>
    </div>
  `,
})
export class EncabezadoComponent {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() icono = '';
}
