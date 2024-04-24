import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCareTeamComponent } from './my-care-team.component';

describe('MyCareTeamComponent', () => {
  let component: MyCareTeamComponent;
  let fixture: ComponentFixture<MyCareTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCareTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCareTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
