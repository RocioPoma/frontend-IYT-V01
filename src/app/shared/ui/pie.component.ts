import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Pie de página. El año se calcula solo, así que se actualiza cada año. */
@Component({
  selector: 'app-pie',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <footer class="pie" [class.pie-oscuro]="oscuro">
      <span>© {{ anio }} AlphaSoft. Todos los derechos reservados.</span>
      <span class="pie-sep">·</span>
      <span>Developed by <strong>Rocio Poma Silvestre</strong></span>
    </footer>
  `,
})
export class PieComponent {
  @Input() oscuro = false;
  readonly anio = new Date().getFullYear();
}
