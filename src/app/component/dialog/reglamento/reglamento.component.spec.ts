import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglamentoComponent } from './reglamento.component';

describe('ReglamentoComponent', () => {
  let component: ReglamentoComponent;
  let fixture: ComponentFixture<ReglamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReglamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
