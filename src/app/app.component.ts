import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SesionService } from './servicios/sesion.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Integración Yaretanense';

  constructor(sesion: SesionService) {
    sesion.iniciar();
  }
}
