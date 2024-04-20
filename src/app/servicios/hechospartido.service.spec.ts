import { TestBed } from '@angular/core/testing';

import { HechospartidoService } from './hechospartido.service';

describe('HechospartidoService', () => {
  let service: HechospartidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HechospartidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
