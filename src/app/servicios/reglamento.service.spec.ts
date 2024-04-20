import { TestBed } from '@angular/core/testing';

import { ReglamentoService } from './reglamento.service';

describe('ReglamentoService', () => {
  let service: ReglamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReglamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
