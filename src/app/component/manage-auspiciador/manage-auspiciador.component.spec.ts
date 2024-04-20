import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAuspiciadorComponent } from './manage-auspiciador.component';

describe('ManageAuspiciadorComponent', () => {
  let component: ManageAuspiciadorComponent;
  let fixture: ComponentFixture<ManageAuspiciadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAuspiciadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAuspiciadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
