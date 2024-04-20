import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNoticiaComponent } from './manage-noticia.component';

describe('ManageNoticiaComponent', () => {
  let component: ManageNoticiaComponent;
  let fixture: ComponentFixture<ManageNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNoticiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
