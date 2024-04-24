import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { PatientDeviceAddEditComponent } from '../patient-device-add-edit/patient-device-add-edit.component';
import { PatientDeviceService } from '../patient-device.service';
import { ToolbarService } from 'src/app/core/services/toolbar.service';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';

import { map, startWith } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { viewDeviceService } from 'src/app/hospital-management/service/view-device.service';
import { UnAssignDevicesComponent } from 'src/app/hospital-management/view-devices/un-assign-devices/un-assign-devices.component';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';

@Component({
  selector: 'app-patient-device-list',
  templateUrl: './patient-device-list.component.html',
  styleUrls: ['./patient-device-list.component.scss'],
})
export class PatientDeviceListComponent implements OnInit {
  public uploadForm: FormGroup;
  userColumnHeaders: string[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  // @ViewChild(MatSort) sort: MatSort = new MatSort();
  status: string[] = ['ACTIVE', 'INACTIVE'];

  dataSource!: any;
  statusFilter = new FormControl();
  nameFilter = new FormControl();

  organzationId: string;
  messageSuccess: boolean;
  hospitalName: any;
  userStatus: string;
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<any[]>;
  imeiNumber: any = '';
  modelName: any = '';
  onSelect: boolean;
  fileName: any = '';
  queryParamsValues: any;
  patientId: string;
  showAssignedMsg: boolean;
  pageSizeOptions = [10, 25, 100];
  length = -1;
  pageIndex = 0;
  onTextCancel: boolean = false;
  adminAccess: string;
  userRole: any;

  constructor(
    public userModalPopup: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public toolbarService: ToolbarService,
    private auth: AuthService,
    // private organizatioUserService: viewDeviceService,
    public fb: FormBuilder,
    private viewDeviceService: viewDeviceService,
    private snackBarService: SnackbarService,
    public deviceModal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>,
    private patientdeviceservice: PatientDeviceService,
    private deviceTypeService: DeviceTypeService,
    private caregiverSharedService: CaregiverSharedService,
    private renderer: Renderer2,
    private filterService: FilterSharedService
  ) {
    const user = this.auth.authData;
    this.userRole = user?.userDetails?.userRole;
  }

  ngOnInit(): void {
    this.caregiverSharedService.triggeredHeaderTitle.next('Devices');
    this.adminAccess = localStorage.getItem('adminAccess');
    this.filterService.subModule.next('');
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
      // this.route.queryParams.subscribe((params) => {
      this.activatedRoute.queryParams.subscribe((params) => {
        this.queryParamsValues = params;
        this.hospitalName = params.name;

        this.toolbarService.setToolbarLabel(params.providerName);
        this.patientId = localStorage.getItem('patient_id');
        this.getHealthDeviceListByPatient(0, 10);
        this.getHealthDeviceListByPatientUnassined();
      });
    });

    // this.route.data.subscribe((res) => {
    //   this.route.queryParams.subscribe((params) => {

    //     res.id = params.org_id;
    //     this.organzationId = res.id;
    //     localStorage.setItem('orgId', this.organzationId);
    //     this.getHealthDeviceListByPatient();
    //     this.getHealthDeviceListByPatientUnassined();
    //   });
    // });

    if (this.adminAccess == 'false') {
      this.userColumnHeaders.pop();
    }
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
  // customPatternValidator(control: FormControl) {
  //   const pattern = /^[a-zA-Z0-9]+$/;
  //   const value = control.value;

  //   if (pattern.test(value)) {
  //     return null; // Validation passed
  //   } else {
  //     // Prevent default behavior
  //     event.preventDefault();

  //     return {
  //       patternValidation: {
  //         valid: false,
  //       },
  //     };
  //   }
  // }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface

  // userFilter(filterValue: string): void {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  // }

  createUser(imei): void {
    const body = {
      patientId: this.patientId,
    };
    this.patientdeviceservice
      .assignHealthDevicesToPatient(this.imeiNumber, body)
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
        this.getHealthDeviceListByPatient(0, 10);
        this.getHealthDeviceListByPatientUnassined();
      });

    // const editUserModalConfig = new MatDialogConfig();
    // editUserModalConfig.disableClose = true;
    // editUserModalConfig.data = {
    //   paginator: this.paginator,
    //   add: 'assign',
    //   value: imei,
    // };
    // this.userModalPopup
    //   .open(UnAssignDevicesComponent, editUserModalConfig)
    //   .afterClosed()
    //   .subscribe((res) => {
    //     if (res == true) {
    //       this.viewDeviceService
    //         .assignHealthDeviceToHospital(this.imeiNumber, this.organzationId)
    //         .subscribe((res) => {
    //           this.snackBarService.success('Assigned Successfully');
    //           this.getHealthDeviceListByPatient();
    //           this.getHealthDeviceListByPatientUnassined();
    //         });
    //     }
    //   });
  }

  public unAssignDevice(recordId): void {
    this.imeiNumber = recordId.imeinumber;
    const hospitalId = recordId;

    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Unassign Device',
        content: `You are Unassigning device "${
          recordId?.deviceModelName ? recordId?.deviceModelName : 'N/A'
        }" from patient "${
          recordId?.patientName ? recordId?.patientName : 'N/A'
        }".`,
      },
    };
    this.userModalPopup
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.patientdeviceservice
            .unAssignPatientForFacilityUser(this.imeiNumber, this.patientId)
            .subscribe((res) => {
              this.snackBarService.success('Unassigned Successfully');
              this.getHealthDeviceListByPatient(0, 10);
              this.paginator.pageIndex = 0;
              this.getHealthDeviceListByPatientUnassined();
            });
        }

        this.getHealthDeviceListByPatient(0, 10);
        this.getHealthDeviceListByPatientUnassined();
      });
  }

  getHealthDeviceListByPatient(pageNum, pageSize): void {
    this.patientdeviceservice
      .getAllDeviceList(this.patientId, 'ASSIGNED_PAT', pageNum, pageSize)
      .subscribe((data) => {
        this.dataSource = data['content'];
        this.length = data.totalElements;
        // this.options = this.dataSource;
      });
  }
  getHealthDeviceListByPatientUnassined(): void {
    this.viewDeviceService
      .getHealthDeviceByHospitalWithoutPaginationId('ASSIGNED_HOS')
      .subscribe((res) => {
        // this.dataSource = res['content'];
        this.options = res['healthDevices'];
      });
  }

  viewhospital(): void {
    if (this.userRole === 'CARECOORDINATOR') {
      this.router.navigate(['careproviderDashboard/totalPatients']);
    } else {
      this.router.navigate(['home/patients']);
    }
  }

  displayFn(user): any {
    return user && user.imeinumber ? user.imeinumber : '';
  }

  private _filter(name: any): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      (option?.imeinumber || '').toLowerCase().includes(filterValue)
    );
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('uploadFile').value);
      this.viewDeviceService.bulkUploadDevice(formData).subscribe(
        (res) => {
          this.snackBarService.success('File uploaded successfully');
          // if (res && res?.blob) {
          //   this.deviceTypeService.downloadFile(res);
          // }
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
  scrollToTop() {
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }

  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();

    this.length = event.length;
    this.getHealthDeviceListByPatient(event.pageIndex, event.pageSize);
  }
  // getPatientDeviceList(
  //   ): void {
  //     this.patientdeviceservice
  //       .getAllDeviceList(
  //         this.patientId,
  //       )
  //       .subscribe(
  //         (data) => {
  //           if (data?.length) {
  //             localStorage.setItem('assignedDeviceId', data[0]?.id);
  //           }
  //           this.dataSource = new MatTableDataSource(data);
  //           this.length = data?.length;
  //           // this.pageIndex = pageNumber;
  //         },
  //         (error) => {
  //           return error;
  //           //this.snackBarService.error(error.message, 2000);
  //         }
  //       );
  //   }
}
