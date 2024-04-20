import { TestBed } from '@angular/core/testing';

import { DpartidoService } from './dpartido.service';

describe('DpartidoService', () => {
  let service: DpartidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DpartidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
