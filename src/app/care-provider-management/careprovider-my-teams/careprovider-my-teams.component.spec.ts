import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareproviderMyTeamsComponent } from './careprovider-my-teams.component';

describe('CareproviderMyTeamsComponent', () => {
  let component: CareproviderMyTeamsComponent;
  let fixture: ComponentFixture<CareproviderMyTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareproviderMyTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareproviderMyTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
