import { TestBed } from '@angular/core/testing';

import { AuspiciadorService } from './auspiciador.service';

describe('AuspiciadorService', () => {
  let service: AuspiciadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuspiciadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
