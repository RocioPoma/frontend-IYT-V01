import { TestBed } from '@angular/core/testing';

import { PasejugadorService } from './pasejugador.service';

describe('PasejugadorService', () => {
  let service: PasejugadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasejugadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
