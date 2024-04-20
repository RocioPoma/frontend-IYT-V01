import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcategoriaCampeonatoComponent } from './dcategoria-campeonato.component';

describe('DcategoriaCampeonatoComponent', () => {
  let component: DcategoriaCampeonatoComponent;
  let fixture: ComponentFixture<DcategoriaCampeonatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcategoriaCampeonatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcategoriaCampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
