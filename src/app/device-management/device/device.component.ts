import { DeviceBulkUploadDialogComponent } from './device-bulk-upload-dialog/device-bulk-upload-dialog.component';

import { Component, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DateAdapter } from '@angular/material/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { merge } from 'rxjs';

import { tap } from 'rxjs/operators';

import { AddEditDeviceComponent } from './add-edit-device/add-edit-device.component';

import { DeviceManagementService } from '../service/device.management.service';

import { SnackbarService } from 'src/app/core/services/snackbar.service';

import { DeviceDataSource } from '../service/device-data-source';

import { DeviceResponse } from '../entities/device';

import { HttpParams } from '@angular/common/http';

import { FiltersStateService } from '../../core/services/filters-state.service';

import { AssignDeviceComponent } from './assign-device/assign-device.component';

import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';

import { Router } from '@angular/router';

import { FilterSharedService } from 'src/app/core/services/filter-shared.service';

import { AuthService } from 'src/app/core/services/auth.service';

import { viewDeviceService } from '../../hospital-management/service/view-device.service';

import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';

import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';

import { TitleCasePipe } from '@angular/common';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-device',

  templateUrl: './device.component.html',

  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent implements OnDestroy {
  deviceHeaders: string[] = [
    'deviceCode',

    'category',

    'deviceVersion',

    'vendorName',

    'imei',

    'connectivity',

    'currency',

    'price',

    'procurementDate',

    'assignedTo',

    'dateAssigned',

    'assignStatus',

    'Action',
  ];

  deviceHeadersDevice: string[] = [
    'deviceCode',

    'category',

    'deviceVersion',

    'vendorName',

    'imei',

    'connectivity',

    'patientName',

    'dateAssigned',

    'assignStatus',

    'Action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  // @ViewChild('table', { read: ElementRef }) table: ElementRef;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;


  @ViewChild(NavigationBarComponent) navBar;

  public dataSource: DeviceDataSource;

  public dataSourceList;

  public device: DeviceResponse;

  filterValues: any;

  deviceFilterForm: FormGroup;

  deviceDataList: any;

  showValidTextMessage = false;

  statuslist = [
    { value: 'ASSIGNED', viewValue: 'ASSIGNED' },

    { value: 'UNASSIGNED', viewValue: 'UNASSIGNED' },
  ];

  deviceType = [];

  searchFilterValues: any;

  isEnableGlobalSearch: boolean;

  isEnableStatus: boolean;

  isEnableDeviceType: boolean;

  messageSuccess: boolean;

  userRole: any;

  filterValuesType: any;

  filterValuesStatus: any;
  leavingComponent: boolean = false;

  // pageSizeOptions = [10, 25, 100];

  length = -1;

  pageIndex = 0;

  dialogClosed: boolean = false;

  adminAccess: string;

  constructor(
    private router: Router,

    public dialog: MatDialog,

    private dateAdapter: DateAdapter<Date>,

    private deviceService: DeviceManagementService,

    private filterService: FilterSharedService,

    private snackBarService: SnackbarService,

    private deviceTypeService: DeviceTypeService,

    private fb: FormBuilder,

    public authService: AuthService,

    private filterstateServce: FiltersStateService,

    private viewDeviceService: viewDeviceService,

    private titlecase: TitleCasePipe,
    private renderer: Renderer2,
  ) {
    this.leavingComponent = false;

    this.dataSource = new DeviceDataSource(
      this.deviceService,

      this.snackBarService
    );

    const user = this.authService.authData;

    this.userRole = user.userDetails?.userRole;

    this.dateAdapter.setLocale('en-GB'); // dd/MM/yyyy, date format in manufactured date field

    this.adminAccess = localStorage.getItem('adminAccess');

    // console.log(this.adminAccess);

    // if(this.adminAccess == 'false'){

    //   this.deviceHeadersDevice.pop();

    // }

    // this.deviceTypeService.getDeviceTypeDropdownList().subscribe((data) => {

    //   this.deviceType = data.filter((ele) => {

    //     return ele.name == 'BP';

    //   })

    // });

    // this.deviceTypeService.getNewDeviceTypes().subscribe((res) => {
    //   if (res.content.length) {
    //     this.deviceType = res.content;
    //   }
    // });

    this.filterstateServce.getFiltersArrayValues().subscribe((res: any) => {
      this.searchFilterValues = res;
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface

  ngOnInit(): void {
    this.leavingComponent = false;
    const token = localStorage.getItem('auth');

    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }

    // this.dataSource.loadDevice(0, 0);

    this.deviceFilterForm = this.fb.group({
      searchQuery: [],

      deviceName: [],

      status: [],
    });

    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });

    if (this.userRole !== 'RPM_ADMIN') {
      // this.deviceByHospital(0, 10);

      this.filterService.globalDevice.subscribe((res) => {
        this.filterValues = res;

        if (Object.keys(res).length) {
          this.paginator.pageIndex = 0;

          this.onSearchRole();
        } else {
          this.onSearchRole();
        }
      });

      this.filterService.deviceTypeFilter.subscribe((res) => {
        if (res.deviceName !== 'ALL') {
          this.filterValuesType = res;

          if (Object.keys(res).length) {
            this.paginator.pageIndex = 0;

            this.onSearchRole();
          }
        } else {
          this.filterValuesType = '';

          this.onSearchRole();
        }
      });

      this.filterService.deviceStatusFilter.subscribe((res) => {
        if (res.status !== 'ALL') {
          this.filterValuesStatus = res;

          if (Object.keys(res).length) {
            this.paginator.pageIndex = 0;

            this.onSearchRole();
          }
        } else {
          this.filterValuesStatus = '';

          this.onSearchRole();
        }
      });
    } else {
      this.filterService.globalDevice.subscribe((res) => {
        this.filterValues = res;

        if (Object.keys(res).length) {
          this.paginator.pageIndex = 0;

          this.onSearch();
        } else {
          this.onSearch();
        }
      });

      this.filterService.deviceTypeFilter.subscribe((res) => {
        if (res.deviceName !== 'ALL') {
          this.filterValuesType = res;

          if (Object.keys(res).length) {
            this.paginator.pageIndex = 0;

            this.onSearch();
          }
        } else {
          this.filterValuesType = '';

          this.onSearch();
        }
      });

      this.filterService.deviceStatusFilter.subscribe((res) => {
        this.dialogClosed = false;

        if (res.status !== 'ALL') {
          this.filterValuesStatus = res;

          if (Object.keys(res).length) {
            this.paginator.pageIndex = 0;

            this.onSearch();
          }
        } else {
          this.filterValuesStatus = '';

          this.onSearch();
        }
      });
    }

    // this.dataSource.totalElemObservable.subscribe((data) => {
    //   if (data > 0) {
    //     this.messageSuccess = true;
    //   } else if (data === 0) {
    //     this.messageSuccess = false;
    //   }
    // });
  }

  ngOnDestroy(): void {
    // This method is called just before the component is destroyed

    // Unsubscribe from subscriptions and perform cleanup here

    this.leavingComponent = true;
  }

  // -----Renders data for paginator and sort

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }
  ngAfterViewInit(): void {
    this.leavingComponent = false;

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          // this.table.nativeElement.scrollIntoView();
          this.scrollToTop()
          this.loadDevicePage();
        })
      )

      .subscribe();
  }

  // private _statusfilter(value): any {

  //   const filterStatusValue = value.toLowerCase();

  //   return this.statuslist.filter((option) => option.viewValue.toLowerCase().indexOf(filterStatusValue) === 0);

  // }

  formatDate(date) {
    if (date) {
      let splittedDate = date?.split('T');

      return splittedDate[0];
    }
  }

  public loadDevicePage(): void {
    if (this.leavingComponent) {
      return;
    }

    // if (Object.keys(res).length === 0) {

    //   this.dataSource.loadDevice(

    //     this.paginator ? this.paginator.pageIndex : 0,

    //     this.paginator ? this.paginator.pageSize : 10

    //   );

    // } else if (!res.searchQuery && !res.status && !res.deviceName) {

    //   this.dataSource.loadDevice(

    //     this.paginator ? this.paginator.pageIndex : 0,

    //     this.paginator ? this.paginator.pageSize : 10

    //   );

    // } else {

    // if (res.searchQuery || res.deviceName) {

    //   this.paginator.pageIndex = 0;

    // }

    let params;

    if (this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',

        deviceName: this.filterValuesType?.deviceName
          ? this.filterValuesType.deviceName
          : '',
      };
    } else {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        deviceName: this.filterValuesType?.deviceName
          ? this.filterValuesType.deviceName
          : '',
      };
    }

    const searchData = new HttpParams({
      fromObject: params,
    });

    this.dataSource.loadDeviceSearch(
      this.paginator.pageIndex,

      this.paginator.pageSize,

      this.sort.active,

      this.sort.direction,

      searchData
    );

    // }
  }

  // -----Function to open modal pop-up to edit device data---------

  public editDevice(data: any): void {
    const editModalDeviceConfig = new MatDialogConfig();

    editModalDeviceConfig.disableClose = true; // The user can't close the dialog by clicking outside it''s body

    (editModalDeviceConfig.maxWidth = '100vw'), // Modal maximum width
      (editModalDeviceConfig.maxHeight = '100vh'), // Modal maximum height
      // editModalDeviceConfig.height = "78vh"; // Modal height

      (editModalDeviceConfig.width = '65%'); // Modal width

    editModalDeviceConfig.data = data; // Passing each recor data by id to modal pop-up fields

    this.dialog

      .open(AddEditDeviceComponent, editModalDeviceConfig)

      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.filterService.deviceStatusFilter.next({ status: 'ALL' });

          this.filterService.deviceTypeFilter.next({ deviceName: 'ALL' });

          this.filterService.changeDeviceInfo(true);

          this.isEnableGlobalSearch = false;

          this.isEnableStatus = false;

          this.isEnableDeviceType = false;

          this.dialogClosed = true;

          this.onSearch();
        }
      });
  }

  public unAssignDevice(recordId): void {
    // this.imeiNumber = recordId.IMEInumber;

    const weightModalConfig: MatDialogConfig = {
      disableClose: true,

      width: '385px',

      height: '185px',

      data: {
        content: `You are Unassigning device "${
          recordId?.deviceModelName ? recordId?.deviceModelName : 'N/A'
        }" from "${
          recordId?.patientName
            ? this.titlecase.transform(recordId?.patientName)
            : 'N/A'
        }".`,

        title: 'Unassign Device',
      },
    };

    this.dialog

      .open(ActionToggleDialogComponent, weightModalConfig)

      .afterClosed()

      .subscribe((res) => {
        if (res == true) {
          this.viewDeviceService

            .unAssignHealthDeviceToPatient(
              recordId.imeinumber,

              recordId.patient
            )

            .subscribe((res) => {
              this.snackBarService.success('Unassigned Successfully');

              // this.getHealthDeviceListByHospital();

              this.onSearchRole();

              // this.getHealthDeviceListByHospitalUnassined();
            });
        }

        // this.getHealthDeviceListByHospital();

        // this.getHealthDeviceListByHospitalUnassined();
      });
  }

  getDevcieList(): void {
    this.paginator.pageIndex = 0;

    this.dataSource = new DeviceDataSource(
      this.deviceService,

      this.snackBarService
    );

    this.dataSource.loadDevice(0, 0);

    this.filterstateServce.setFiltersArrayValues(null);
  }

  deviceByHospital(pageNumber, pageSize) {
    let params;

    if (this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',

        deviceName: this.filterValuesType?.deviceName
          ? this.filterValuesType.deviceName
          : '',
      };
    } else {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        deviceName: this.filterValuesType?.deviceName
          ? this.filterValuesType.deviceName
          : '',
      };
    }

    const searchData = new HttpParams({ fromObject: params });

    this.viewDeviceService

      .getUnassignedDeviceList(searchData, pageNumber, pageSize)

      .subscribe((res) => {
        this.dataSourceList = res.content;

        this.length = res.totalElements;
      });
  }

  handlePageEvent(event: PageEvent): void {
    this.scrollToTop()

    this.length = event.length;

    this.deviceByHospital(event.pageIndex, event.pageSize);
  }

  onSearch(): void {
    // alert(this.leavingComponent)

    if (this.leavingComponent) {
      return;
    }

    const formValue = this.deviceFilterForm.value;

    let params;

    if (this.filterValuesStatus?.status && !this.dialogClosed) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        status:
          this.filterValuesStatus?.status && !this.dialogClosed
            ? this.filterValuesStatus.status
            : (this.filterValuesStatus.status = ''),

        deviceName:
          this.filterValuesType?.deviceName && !this.dialogClosed
            ? this.filterValuesType.deviceName
            : '',
      };
    } else {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        deviceName:
          this.filterValuesType?.deviceName && !this.dialogClosed
            ? this.filterValuesType.deviceName
            : '',
      };
    }

    // eslint-disable-next-line guard-for-in

    for (const prop in formValue) {
      if (!formValue[prop]) {
        delete formValue[prop];
      }

      if (Array.isArray(formValue[prop])) {
        const resultArray = formValue[prop].filter((item) => item);

        if (resultArray.length > 0) {
          formValue[prop] = resultArray;
        } else {
          delete formValue[prop];
        }
      }
    }

    this.filterstateServce.setFiltersArrayValues(formValue);

    const searchData = new HttpParams({ fromObject: params });

    this.dataSource.loadDeviceSearch(
      this.paginator?.pageIndex ? this.paginator?.pageIndex : 0,

      this.paginator?.pageSize ? this.paginator?.pageSize : 10,

      this.sort.active,

      this.sort.direction,

      searchData
    );
  }

  onSearchRole(): void {
    if (this.leavingComponent) {
      return;
    }

    const formValue = this.deviceFilterForm.value;

    let params;

    if (this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',

        deviceName: this.filterValuesType?.deviceName
          ? this.filterValuesType.deviceName
          : '',
      };
    } else {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',

        deviceName: this.filterValuesType?.deviceName
          ? this.filterValuesType.deviceName
          : '',
      };
    }

    const searchData = new HttpParams({ fromObject: params });

    // eslint-disable-next-line guard-for-in

    for (const prop in formValue) {
      if (!formValue[prop]) {
        delete formValue[prop];
      }

      if (Array.isArray(formValue[prop])) {
        const resultArray = formValue[prop].filter((item) => item);

        if (resultArray.length > 0) {
          formValue[prop] = resultArray;
        } else {
          delete formValue[prop];
        }
      }
    }

    this.filterstateServce.setFiltersArrayValues(formValue);

    this.viewDeviceService

      .getUnassignedDeviceList(
        searchData,
        this.paginator?.pageIndex ? this.paginator?.pageIndex : 0,

        this.paginator?.pageSize ? this.paginator?.pageSize : 10
      )

      .subscribe((res) => {
        this.dataSourceList = res.content;

        this.length = res.totalElements;
      });
  }

  // global Search

  unselectGlobalSearch(): void {
    this.deviceFilterForm.get('searchQuery').reset();

    this.onSearch();

    this.isEnableGlobalSearch = false;

    this.getDevcieList();

    this.messageSuccess = true;
  }

  isEnableGlobalSearchFunc(): any {
    if (
      this.deviceFilterForm.get('searchQuery').value &&
      this.deviceFilterForm.get('searchQuery').value.length > 2
    ) {
      this.onSearch();

      this.isEnableGlobalSearch = true;
    } else if (!this.deviceFilterForm.get('searchQuery').value.length) {
      this.messageSuccess = true;

      this.onSearch();

      this.isEnableGlobalSearch = false;

      this.showValidTextMessage = false;
    }
  }

  // status

  unselectStatus(): void {
    this.deviceFilterForm.get('status').reset();

    this.onSearch();

    this.isEnableStatus = false;
  }

  isEnableStatusFunc(): any {
    this.isEnableStatus = true;
  }

  // Device type

  unselectDeviceType(): void {
    this.deviceFilterForm.get('deviceName').reset();

    this.onSearch();

    this.isEnableDeviceType = false;
  }

  isEnableDeviceTypeFunc(): any {
    this.isEnableDeviceType = true;
  }

  // -----Function to open modal pop-up to edit device data---------

  public assignDevice(data: any): void {
    const assignModalDeviceConfig = new MatDialogConfig();

    assignModalDeviceConfig.disableClose = true; // The user can't close the dialog by clicking outside it''s body

    (assignModalDeviceConfig.maxWidth = '100vw'), // Modal maximum width
      (assignModalDeviceConfig.maxHeight = '100vh'), // Modal maximum height
      // editModalDeviceConfig.height = "78vh"; // Modal height

      (assignModalDeviceConfig.width = '450px'); // Modal width

    assignModalDeviceConfig.data = { mode: 'assign', deviceDetails: data }; // Passing each recor data by id to modal pop-up fields

    this.dialog

      .open(AssignDeviceComponent, assignModalDeviceConfig)

      .afterClosed()

      .subscribe((e) => {
        this.getDevcieList();

        this.deviceFilterForm.reset();

        this.isEnableGlobalSearch = false;

        this.isEnableDeviceType = false;

        this.isEnableStatus = false;
      });
  }

  public openBulkDialog(): void {
    const addDialogRef = this.dialog.open(DeviceBulkUploadDialogComponent, {
      disableClose: true,

      maxWidth: '100vw',

      maxHeight: '150vh',

      width: '33%',
    });

    addDialogRef.afterClosed().subscribe(() => {
      // this.updateTable();
    });
  }

  logBook(item) {
    this.router.navigate(['home/devices/log-book'], {
      // queryParams: { name: hospital.name, org_id: hospital.id },

      skipLocationChange: false,
    });
  }
}
