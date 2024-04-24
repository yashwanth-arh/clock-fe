import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAssignDevicesComponent } from './un-assign-devices.component';

describe('UnAssignDevicesComponent', () => {
  let component: UnAssignDevicesComponent;
  let fixture: ComponentFixture<UnAssignDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnAssignDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnAssignDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
