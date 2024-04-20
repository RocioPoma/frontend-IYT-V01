import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDcategoriaFutbolComponent } from './manage-dcategoria-futbol.component';

describe('ManageDcategoriaFutbolComponent', () => {
  let component: ManageDcategoriaFutbolComponent;
  let fixture: ComponentFixture<ManageDcategoriaFutbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDcategoriaFutbolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDcategoriaFutbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
