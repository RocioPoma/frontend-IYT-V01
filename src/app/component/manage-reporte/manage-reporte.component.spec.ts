import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReporteComponent } from './manage-reporte.component';

describe('ManageReporteComponent', () => {
  let component: ManageReporteComponent;
  let fixture: ComponentFixture<ManageReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
