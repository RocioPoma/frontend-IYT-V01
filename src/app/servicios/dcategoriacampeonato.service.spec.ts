import { TestBed } from '@angular/core/testing';

import { DcategoriacampeonatoService } from './dcategoriacampeonato.service';

describe('DcategoriacampeonatoService', () => {
  let service: DcategoriacampeonatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DcategoriacampeonatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
