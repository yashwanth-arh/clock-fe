import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientDeviceService } from '../patient-device.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/CommonComponents/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-patient-device-add-edit',
  templateUrl: './patient-device-add-edit.component.html',
  styleUrls: ['./patient-device-add-edit.component.scss'],
})
export class PatientDeviceAddEditComponent implements OnInit {
  addEditDevice: FormGroup;
  private recordId: string[] = [];
  private paginator: string[] = [];
  private dataSource: string[] = [];
  private deviceData: string[] = [];
  orgId: string;
  device_type = new FormControl();
  deviceList: any;
  deviceMessage: any;
  filteredDeviceList: Observable<any>;
  isSubmitted = false;
  userRole: string;
  deviceId: string;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PatientDeviceAddEditComponent>,
    private patientdeviceservice: PatientDeviceService,
    private snackBarService: SnackbarService
  ) {
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
  }

  ngOnInit(): void {
    this.deviceId = localStorage.getItem('assignedDeviceId');
    this.orgId = localStorage.getItem('org_id');
    this.validateForm();
    if (this.data.add == 'add') {
      this.addEditDevice.removeControl('status');
    }
    this.getDeviceList();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    return this.deviceList.filter((option) =>
      option.deviceCode.toLowerCase().includes(filterValue)
    );
  }
  // private devicefilter(value): any {
  //   if (value) {
  //     const filterDeviceValue = value.toLowerCase();
  //     return this.deviceList.filter(
  //       (option) => option.toLowerCase().indexOf(filterDeviceValue) === 0
  //     );
  //   } else {
  //     return this.deviceList;
  //   }
  // }
  dispSelDevice() {
    return (val) => this.formatDevice(val);
  }
  formatDevice(_val) {
    if (_val) {return _val.deviceCode;}
    return '';
  }

  selectedDevice(e): any {
    return e.deviceCode;
  }

  private validateForm(): void {
    this.addEditDevice = this.fb.group({
      id: [''],
      device_type: ['', Validators.required],
    });
  }

  onSubmit(deviceDetails: any): void {
    this.isSubmitted = true;
    const body = {
      patient_id: localStorage.getItem('patient_id'),
    };
    if (this.data.add == 'add') {
      if (this.device_type.value === null) {
        this.snackBarService.error('Enter device type');
        this.isSubmitted = false;
        return;
      }
      this.patientdeviceservice
        .assignDevice(this.device_type.value?.id, body)
        .subscribe(
          () => {
            this.dialogRef.close();
            this.snackBarService.success('Assigned successfully!', 2000);
            this.isSubmitted = false;
          },
          (e) => {
            this.isSubmitted = false;
            if (e.err == 400) {
              this.dialog.open(ConfirmDialogComponent, {
                disableClose: true,
                maxWidth: '100vw',
                maxHeight: '120vh',
                width: '30%',
                data: {
                  tit:'msg',
                  title: e.message,
                  subtitle: 'Click `Confirm` to proceed'
                }
              })
                .afterClosed().subscribe(
                  (flag: boolean) => {
                    if (flag) {

                      this.patientdeviceservice
                        .unassignDevice(this.deviceId, body)
                        .subscribe(
                          () => {
                            this.isSubmitted = false;
                            this.dialogRef.close();
                            this.snackBarService.success('Deassigned successfully!', 2000);
                          },
                          () => {
                            this.snackBarService.error('Unsuccessfull!', 2000);
                            this.isSubmitted = false;
                          }
                        );

                    }
                    else {
                      this.dialogRef.close();
                    }


                  }
                )
              // this.snackBarService.error('Unsuccessfull!', 2000);
            }
          }
        );
    } else {
      this.patientdeviceservice
        .unassignDevice(this.data.value?.id, body)
        .subscribe(
          () => {
            this.isSubmitted = false;
            this.dialogRef.close();
            this.snackBarService.success('Deassigned successfully!', 2000);
          },
          () => {
            this.snackBarService.error('Unsuccessfull!', 2000);
            this.isSubmitted = false;
          }
        );
    }
  }

  getDeviceList() {
    if (this.userRole === 'RPM_ADMIN') {
      this.patientdeviceservice
        .getDevicesByOrgId(this.orgId)
        .subscribe((data) => {
          if (data.length === 0) {
            this.deviceMessage = 'There is no  devices available to assign ';
            this.deviceList = data.content;
            this.deviceList?.sort((a, b) =>
              a.deviceCode > b.deviceCode ? 1 : -1
            );
          } else {
            this.deviceMessage = '';
            this.deviceList = data.content;
            this.deviceList?.sort((a, b) =>
              a.deviceCode > b.deviceCode ? 1 : -1
            );
            this.filteredDeviceList = this.device_type.valueChanges.pipe(
              startWith(''),
              map((value) => this._filter(value))
            );
          }
        });
    } else if (this.userRole === 'BRANCH_USER') {
      this.patientdeviceservice.getDevicesClinicAdmin().subscribe((data) => {
        if (data.length === 0) {
          this.deviceMessage = 'There is no  devices available to assign ';
          this.deviceList = data;
          this.deviceList?.sort((a, b) =>
            a.deviceCode > b.deviceCode ? 1 : -1
          );
        } else {
          this.deviceMessage = '';
          this.deviceList = data;
          this.deviceList?.sort((a, b) =>
            a.deviceCode > b.deviceCode ? 1 : -1
          );
          this.filteredDeviceList = this.device_type.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
          );

        }
      });
    } else {
      this.patientdeviceservice.getDevicesPracticeAdmin().subscribe((data) => {
        if (data.length === 0) {
          this.deviceMessage = 'There is no  devices available to assign ';
          this.deviceList = data.content;
          this.deviceList?.sort((a, b) =>
            a.deviceCode > b.deviceCode ? 1 : -1
          );
        } else {
          this.deviceMessage = '';
          this.deviceList = data.content;
          this.deviceList?.sort((a, b) =>
            a.deviceCode > b.deviceCode ? 1 : -1
          );
          this.filteredDeviceList = this.device_type.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
          );
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
