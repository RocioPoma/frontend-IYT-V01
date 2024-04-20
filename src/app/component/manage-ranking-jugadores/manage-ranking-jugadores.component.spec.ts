import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRankingJugadoresComponent } from './manage-ranking-jugadores.component';

describe('ManageRankingJugadoresComponent', () => {
  let component: ManageRankingJugadoresComponent;
  let fixture: ComponentFixture<ManageRankingJugadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRankingJugadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRankingJugadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
