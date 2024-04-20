import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTablaPosicionesComponent } from './manage-tabla-posiciones.component';

describe('ManageTablaPosicionesComponent', () => {
  let component: ManageTablaPosicionesComponent;
  let fixture: ComponentFixture<ManageTablaPosicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTablaPosicionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTablaPosicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
