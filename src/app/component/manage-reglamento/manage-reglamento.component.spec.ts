import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReglamentoComponent } from './manage-reglamento.component';

describe('ManageReglamentoComponent', () => {
  let component: ManageReglamentoComponent;
  let fixture: ComponentFixture<ManageReglamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageReglamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReglamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
