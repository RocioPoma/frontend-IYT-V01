import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HechosPartidoComponent } from './hechos-partido.component';

describe('HechosPartidoComponent', () => {
  let component: HechosPartidoComponent;
  let fixture: ComponentFixture<HechosPartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HechosPartidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HechosPartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
