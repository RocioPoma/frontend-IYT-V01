import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJugadorComponent } from './manage-jugador.component';

describe('ManageJugadorComponent', () => {
  let component: ManageJugadorComponent;
  let fixture: ComponentFixture<ManageJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJugadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
