import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClubComponent } from './manage-club.component';

describe('ManageClubComponent', () => {
  let component: ManageClubComponent;
  let fixture: ComponentFixture<ManageClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
