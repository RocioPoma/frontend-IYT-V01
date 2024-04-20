import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDetalleCampeonatoComponent } from './manage-detalle-campeonato.component';

describe('ManageDetalleCampeonatoComponent', () => {
  let component: ManageDetalleCampeonatoComponent;
  let fixture: ComponentFixture<ManageDetalleCampeonatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDetalleCampeonatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDetalleCampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
