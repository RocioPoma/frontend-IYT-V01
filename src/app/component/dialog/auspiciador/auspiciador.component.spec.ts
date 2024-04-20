import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuspiciadorComponent } from './auspiciador.component';

describe('AuspiciadorComponent', () => {
  let component: AuspiciadorComponent;
  let fixture: ComponentFixture<AuspiciadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuspiciadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuspiciadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
