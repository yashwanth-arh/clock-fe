import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceLogBookComponent } from './device-log-book.component';

describe('DeviceLogBookComponent', () => {
  let component: DeviceLogBookComponent;
  let fixture: ComponentFixture<DeviceLogBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceLogBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceLogBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
