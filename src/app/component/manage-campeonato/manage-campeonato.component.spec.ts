import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampeonatoComponent } from './manage-campeonato.component';

describe('ManageCampeonatoComponent', () => {
  let component: ManageCampeonatoComponent;
  let fixture: ComponentFixture<ManageCampeonatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCampeonatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
