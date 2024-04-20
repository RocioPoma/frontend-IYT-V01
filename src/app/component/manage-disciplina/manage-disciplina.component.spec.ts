import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDisciplinaComponent } from './manage-disciplina.component';

describe('ManageDisciplinaComponent', () => {
  let component: ManageDisciplinaComponent;
  let fixture: ComponentFixture<ManageDisciplinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDisciplinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDisciplinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
