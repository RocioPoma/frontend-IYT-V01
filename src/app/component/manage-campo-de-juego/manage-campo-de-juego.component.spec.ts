import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampoDeJuegoComponent } from './manage-campo-de-juego.component';

describe('ManageCampoDeJuegoComponent', () => {
  let component: ManageCampoDeJuegoComponent;
  let fixture: ComponentFixture<ManageCampoDeJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCampoDeJuegoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCampoDeJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
