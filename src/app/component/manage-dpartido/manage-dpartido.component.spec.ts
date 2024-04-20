import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDpartidoComponent } from './manage-dpartido.component';

describe('ManageDpartidoComponent', () => {
  let component: ManageDpartidoComponent;
  let fixture: ComponentFixture<ManageDpartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDpartidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDpartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
