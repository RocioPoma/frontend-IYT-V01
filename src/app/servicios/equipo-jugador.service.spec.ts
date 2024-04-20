import { TestBed } from '@angular/core/testing';

import { EquipoJugadorService } from './equipo-jugador.service';

describe('EquipoJugadorService', () => {
  let service: EquipoJugadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipoJugadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
