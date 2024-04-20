import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManajePaseJugadorComponent } from './manaje-pase-jugador.component';

describe('ManajePaseJugadorComponent', () => {
  let component: ManajePaseJugadorComponent;
  let fixture: ComponentFixture<ManajePaseJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManajePaseJugadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManajePaseJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
