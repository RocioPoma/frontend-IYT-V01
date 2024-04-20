import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageArbitroComponent } from './manage-arbitro.component';

describe('ManageArbitroComponent', () => {
  let component: ManageArbitroComponent;
  let fixture: ComponentFixture<ManageArbitroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageArbitroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageArbitroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
