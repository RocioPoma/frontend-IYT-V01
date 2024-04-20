import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasejugadorComponent } from './pasejugador.component';

describe('PasejugadorComponent', () => {
  let component: PasejugadorComponent;
  let fixture: ComponentFixture<PasejugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasejugadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasejugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
