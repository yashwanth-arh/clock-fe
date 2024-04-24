import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { hospitalUserService } from '../../service/hospital-user.service';
import { UnAssignDevicesComponent } from '../un-assign-devices/un-assign-devices.component';
import { viewDeviceService } from '../../service/view-device.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-assign-devices',
  templateUrl: './assign-devices.component.html',
  styleUrls: ['./assign-devices.component.scss'],
})
export class AssignDevicesComponent implements OnInit {
  userColumnHeaders: string[];
  dataSource: any;
  constructor(
    private viewDeviceService: viewDeviceService,
    public userModalPopup: MatDialog,
    public dialogRef: MatDialogRef<AssignDevicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private organizatioUserService: hospitalUserService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userColumnHeaders = [
      'Name',
      'deviceType',
      'version',
      'vendor',
      'imei',
      'status',
      'action',
    ];

    this.getUnAssiigned();
  }

  getUnAssiigned() {
    this.viewDeviceService.getAllUnsignedHealthDevice().subscribe((res) => {
      this.dataSource = res;
    });
  }
  assignDevice(element) {
    const editUserModalConfig = new MatDialogConfig();
    editUserModalConfig.disableClose = true;
    editUserModalConfig.data = {
      // paginator: this.paginator,
      add: 'assign',
      value: element.id,
    };
    this.userModalPopup
      .open(UnAssignDevicesComponent, editUserModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.viewDeviceService
            .assignHealthDeviceToHospital(
              element.imeinumber,
              element.hospitalId
            )
            .subscribe((res) => {
              this.snackBarService.success('Assigned Successfully');
              this.getUnAssiigned();
            });
        }

        // this.getHealthDeviceListByHospital();
      });
  }
}
