import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitroComponent } from './arbitro.component';

describe('ArbitroComponent', () => {
  let component: ArbitroComponent;
  let fixture: ComponentFixture<ArbitroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArbitroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
