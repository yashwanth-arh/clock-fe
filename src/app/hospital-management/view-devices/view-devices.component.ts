import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AssignDevicesComponent } from './assign-devices/assign-devices.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UnAssignDevicesComponent } from './un-assign-devices/un-assign-devices.component';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { hospitalUserService } from '../service/hospital-user.service';
import { ToolbarService } from 'src/app/core/services/toolbar.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { viewDeviceService } from '../service/view-device.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { environment } from 'src/environments/environment';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
import { MatTable } from '@angular/material/table';

// export interface User {
//   name: string;
// }
@Component({
  selector: 'app-view-devices',
  templateUrl: './view-devices.component.html',
  styleUrls: ['./view-devices.component.scss'],
})
export class ViewDevicesComponent implements OnInit {
  public uploadForm: FormGroup;
  userColumnHeaders: string[];
  previousSelected: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  // @ViewChild(MatSort) sort: MatSort = new MatSort();
  status: string[] = ['ACTIVE', 'INACTIVE'];
  hospitalDeviceUrl: string;
  dataSource!: any;
  statusFilter = new FormControl();
  nameFilter = new FormControl();

  organzationId: string;
  messageSuccess: boolean;
  hospitalName: any;
  userStatus: string;
  myControl = new FormControl('');
  options: any[] = [];
  filteredOptions: Observable<any[]>;
  imeiNumber;
  modelName;
  onSelect: boolean;
  fileName: any = '';
  showAssignedMsg: boolean;
  pageSizeOptions = [10, 25, 100];
  length = -1;
  pageIndex = 0;
  searchText: any;
  onTextCancel: boolean = false;

  constructor(
    public userModalPopup: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public toolbarService: ToolbarService,
    public fb: FormBuilder,

    private deviceTypeService: DeviceTypeService,
    private viewDeviceService: viewDeviceService,
    private snackBarService: SnackbarService,
    private renderer: Renderer2
  ) {
    this.hospitalDeviceUrl = environment.hospitalDeviceUrl;
  }

  ngOnInit(): void {
    this.userColumnHeaders = [
      'Name',
      // 'Device Type',
      // 'Version',
      // 'Vendor',
      'IMEI',
      'Date Assigned',
      'Status',
      'Action',
    ];
    this.route.data.subscribe((res) => {
      this.route.queryParams.subscribe((params) => {
        res.id = params.org_id;
        this.organzationId = res.id;
        this.hospitalName = params.name;
        localStorage.setItem('orgId', this.organzationId);
        this.getHealthDeviceListByHospital();
        this.getHealthDeviceListByHospitalUnassined();
      });
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),

      map((value) => {
        if (value.length > 0) {
          this.onTextCancel = true;
          // this.onSelect = true;
        } else {
          this.onTextCancel = false;
          this.onSelect = false;
        }
        return value.length ? this._filter(value as any) : [];
      })
    );

    this.uploadForm = this.fb.group({
      uploadFile: ['', Validators.required],
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface

  // userFilter(filterValue: string): void {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  // }
  scrollToTop() {
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }

  createUser(imei): void {
    this.viewDeviceService
      .assignHealthDeviceToHospital(this.imeiNumber, this.organzationId)
      .subscribe((res) => {
        this.showAssignedMsg = true;
        const showAssignedMsg = () => {
          this.showAssignedMsg = false;
          this.imeiNumber = '';
          this.modelName = '';
          this.onSelect = false;
          this.myControl.setValue('');
        };
        setTimeout(showAssignedMsg, 3000);
        this.getHealthDeviceListByHospital();
        this.getHealthDeviceListByHospitalUnassined();
      });
  }

  public unAssignDevice(recordId): void {
    this.imeiNumber = recordId.IMEInumber;
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '382px',
      height: '182px',
      data: {
        content: `You are Unassigning device "${
          recordId?.deviceModelName ? recordId?.deviceModelName : 'N/A'
        }" from "${recordId?.hospitalName ? recordId?.hospitalName : 'N/A'}".`,
        title: 'Unassign Device',
      },
    };
    this.userModalPopup
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.viewDeviceService
            .unAssignHealthDeviceToHospital(this.imeiNumber, this.organzationId)
            .subscribe((res) => {
              this.snackBarService.success('Unassigned Successfully');
              this.getHealthDeviceListByHospital();
              this.getHealthDeviceListByHospitalUnassined();
              this.paginator.pageIndex = 0;
            });
        }

        this.getHealthDeviceListByHospital();
        this.getHealthDeviceListByHospitalUnassined();
      });
  }

  getHealthDeviceListByHospital(pageNo = 0, pageSize = 10): void {
    this.viewDeviceService
      .getHealthDeviceByHospitalId(
        this.organzationId,
        'ASSIGNED_HOS',
        pageNo,
        pageSize
      )
      .subscribe((res) => {
        this.dataSource = res['content'];
        this.length = res['totalElements'];
      });
  }
  getHealthDeviceListByHospitalUnassined(): void {
    this.viewDeviceService
      .getHealthDeviceByHospitalWithoutPaginationId('AVAILABLE_CH')
      .subscribe((res) => {
        this.options = res['healthDevices'];
      });
  }

  viewhospital(): void {
    this.router.navigate(['home/hospitals']);
  }

  displayFn(user): any {
    return user && user.imeinumber ? user.imeinumber : '';
  }

  private _filter(name: any): any[] {
    const filterValue = name.toLowerCase();
    return this.options.filter((option) =>
      (option.imeinumber || '').toLowerCase().includes(filterValue)
    );
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('uploadFile').value);
      this.viewDeviceService.bulkUploadDevice(formData).subscribe(
        (res) => {
          this.snackBarService.success('File uploaded successfully');
          this.getHealthDeviceListByHospital();
          this.getHealthDeviceListByHospitalUnassined();

          if (res && res?.['blob']) {
            this.deviceTypeService.downloadFileForHospital(res);
          }
          // this.dialogRef.close();
        },
        () => {
          // this.snackBarService.error('Device bulk upload failed!', 2000);
        }
      );
    } else {
      this.snackBarService.error('Please select file!');
    }
  }

  selectedItem(e) {
    this.imeiNumber = e.option.value;
    this.modelName = e.option.id;

    this.onSelect = true;
  }
  onDisSelect() {
    this.imeiNumber = '';
    this.modelName = '';
    this.onSelect = false;
    this.onTextCancel = false;
    this.myControl.setValue('');
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;

      this.uploadForm.get('uploadFile').setValue(file);
    }
  }
  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();

    this.length = event.length;
    this.getHealthDeviceListByHospital(event.pageIndex, event.pageSize);
  }
}
