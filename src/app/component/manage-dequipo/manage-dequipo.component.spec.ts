import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDequipoComponent } from './manage-dequipo.component';

describe('ManageDequipoComponent', () => {
  let component: ManageDequipoComponent;
  let fixture: ComponentFixture<ManageDequipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDequipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDequipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
