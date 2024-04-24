import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceTypeAddComponent } from './device-type-add.component';

describe('DeviceTypeAddComponent', () => {
  let component: DeviceTypeAddComponent;
  let fixture: ComponentFixture<DeviceTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceTypeAddComponent],
      imports: [ReactiveFormsModule, MatDialogModule, RouterTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    component.initializeCreateDeviceForm();
    expect(component.deviceTypeForm).toBeDefined();
  });

  it('should have a valid deviceType', () => {
    component.initializeCreateDeviceForm();
    const deviceTypeControl = component.deviceTypeForm.controls['deviceType'];
    deviceTypeControl.setValue('Test Device');
    expect(deviceTypeControl.valid).toBeTruthy();
  });

  it('should have a required deviceType', () => {
    component.initializeCreateDeviceForm();
    const deviceTypeControl = component.deviceTypeForm.controls['deviceType'];
    deviceTypeControl.setValue('');
    expect(deviceTypeControl.valid).toBeFalsy();
    expect(component.deviceTypeErr()).toBe('Device Type is required');
  });

  it('should have a whitespace-free deviceType', () => {
    component.initializeCreateDeviceForm();
    const deviceTypeControl = component.deviceTypeForm.controls['deviceType'];
    deviceTypeControl.setValue('    ');
    expect(deviceTypeControl.valid).toBeFalsy();
    expect(component.deviceTypeErr()).toBe('Only spaces are not allowed');
  });

  it('should have a deviceType with min 2 characters', () => {
    component.initializeCreateDeviceForm();
    const deviceTypeControl = component.deviceTypeForm.controls['deviceType'];
    deviceTypeControl.setValue('A');
    expect(deviceTypeControl.valid).toBeFalsy();
    expect(component.deviceTypeErr()).toBe('Min 2 characters is required');
  });

  it('should have a valid deviceDescription', () => {
    component.initializeCreateDeviceForm();
    const deviceDescriptionControl =
      component.deviceTypeForm.controls['deviceDescription'];
    deviceDescriptionControl.setValue('Test Description');
    expect(deviceDescriptionControl.valid).toBeTruthy();
  });

  it('should have a required deviceDescription', () => {
    component.initializeCreateDeviceForm();
    const deviceDescriptionControl =
      component.deviceTypeForm.controls['deviceDescription'];
    deviceDescriptionControl.setValue('');
    expect(deviceDescriptionControl.valid).toBeFalsy();
    expect(component.deviceDecErr()).toBe('Description is required');
  });

  it('should have a whitespace-free deviceDescription', () => {
    component.initializeCreateDeviceForm();
    const deviceDescriptionControl =
      component.deviceTypeForm.controls['deviceDescription'];
    deviceDescriptionControl.setValue('    ');
    expect(deviceDescriptionControl.valid).toBeFalsy();
    expect(component.deviceDecErr()).toBe('Only spaces are not allowed');
  });

  it('should have a deviceDescription with min 3 characters', () => {
    component.initializeCreateDeviceForm();
    const deviceDescriptionControl =
      component.deviceTypeForm.controls['deviceDescription'];
    deviceDescriptionControl.setValue('AB');
    expect(deviceDescriptionControl.valid).toBeFalsy();
    expect(component.deviceDecErr()).toBe('Min 3 characters is required');
  });

  it('should create a device type', () => {
    component.initializeCreateDeviceForm();
    const deviceTypeControl = component.deviceTypeForm.controls['deviceType'];
    deviceTypeControl.setValue('Test Device');
    const deviceDescriptionControl =
      component.deviceTypeForm.controls['deviceDescription'];
    deviceDescriptionControl.setValue('Test Description');
    spyOn(component, 'createDeviceType');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(component.createDeviceType).toHaveBeenCalled();
  });

  it('should call dialog close when device type creation is successful', () => {
    component.initializeCreateDeviceForm();
    const deviceTypeControl = component.deviceTypeForm.controls['deviceType'];
    deviceTypeControl.setValue('Test Device');
    const deviceDescriptionControl =
      component.deviceTypeForm.controls['deviceDescription'];
    deviceDescriptionControl.setValue('Test Description');
    spyOn(component, 'createDeviceType').and.returnValue(); // set the createDeviceType to return true
    spyOn(component.dialogRef, 'close'); // spyOn the close method
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(component.createDeviceType).toHaveBeenCalled();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
