import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDcategoriaCampeonatoComponent } from './manage-dcategoria-campeonato.component';

describe('ManageDcategoriaCampeonatoComponent', () => {
  let component: ManageDcategoriaCampeonatoComponent;
  let fixture: ComponentFixture<ManageDcategoriaCampeonatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDcategoriaCampeonatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDcategoriaCampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
