import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { DeviceModelDialogComponent } from '../device-models/device-model-dialog/device-model-dialog.component';
import { DeviceTypeAddComponent } from '../device-type/device-type-add/device-type-add.component';
import { AddEditDeviceComponent } from '../device/add-edit-device/add-edit-device.component';
import { DeviceBulkUploadDialogComponent } from '../device/device-bulk-upload-dialog/device-bulk-upload-dialog.component';
import { AddVendorsComponent } from '../vendors/add-vendors/add-vendors.component';
import { DeviceManagementSharedService } from '../device.management.shared-service';
import { DeviceComponent } from '../device/device.component';
import { VendorsListComponent } from '../vendors/vendors-list/vendors-list.component';
import { DeviceTypeListComponent } from '../device-type/device-type-list/device-type-list.component';
import { DeviceModelListComponent } from '../device-models/device-model-list/device-model-list.component';
import { AllFiltersComponent } from 'src/app/core/components/all-filters/all-filters.component';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeviceInfoComponent implements OnInit, OnDestroy {
  deviceFilterForm: FormGroup;
  isEnableGlobalSearch: boolean = false;
  showValidTextMessage: boolean = false;
  isEnableDeviceType: boolean = false;
  deviceType: any[] = [];
  statuslist: any[] = [];
  isEnableStatus: boolean = false;
  showDevice: boolean = true;
  showDeviceType: boolean = false;
  showDeviceModel: boolean = false;
  showVendor: boolean = false;
  selectedTabName: string;
  deviceModelfilter: FormGroup;
  role: any;
  @ViewChild(DeviceComponent) deviceComponent;
  @ViewChild(VendorsListComponent) vendorComponent;
  @ViewChild(DeviceTypeListComponent) deviceTypeComponent;
  @ViewChild(DeviceModelListComponent) deviceModelComponent;
  @ViewChild(AllFiltersComponent) allFilter;
  @ViewChild('navigationBar') navigationBar: NavigationBarComponent;
  @ViewChild('devices') devices: DeviceComponent;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private filterService: FilterSharedService,
    private deviceSharedService: DeviceManagementSharedService
  ) {}

  ngOnInit(): void {
    this.filterService.globalDeviceCall('');
    this.filterService.deviceTypeFilterCall('');
    this.filterService.deviceStatusFilterCall('');
    this.filterService.globalDeviceModelCall('');
    this.role = localStorage.getItem('role');
    this.deviceFilterForm = this.fb.group({
      searchQuery: [],
      deviceName: [],
      status: [],
    });
    this.deviceModelfilter = this.fb.group({
      searchQuery: [''],
    });
    this.filterService.subModuleCall('Devices');
    this.filterService.triggeredDeviceInfo.subscribe((res) => {
      if (res) {
        this.navigationBar.resetStatusFilter();
      }
    });
  }
  getTabDetails(event) {
    this.selectedTabName = event.tab.textLabel;
    if (this.selectedTabName === 'Devices') {
      this.filterService.globalDevice.next('');
      this.showDevice = true;
      this.showDeviceModel = false;
      this.showVendor = false;
      this.showDeviceType = false;
    } else if (this.selectedTabName === 'Device Types') {
      this.showDevice = false;
      this.showDeviceModel = false;
      this.showVendor = false;
      this.showDeviceType = true;
    } else if (this.selectedTabName === 'Vendors') {
      this.showDevice = false;
      this.showDeviceModel = false;
      this.showVendor = true;
      this.showDeviceType = false;
    } else if (this.selectedTabName === 'Device Models') {
      this.showDevice = false;
      this.showDeviceModel = true;
      this.showVendor = false;
      this.showDeviceType = false;
    }
    this.filterService.subModuleCall(this.selectedTabName);
  }
  isEnableGlobalSearchFunc(): any {
    if (
      this.deviceFilterForm.get('searchQuery').value &&
      this.deviceFilterForm.get('searchQuery').value.length > 2
    ) {
      this.onSearch();
      // this.isEnableGlobalSearch = true;
    } else if (!this.deviceFilterForm.get('searchQuery').value.length) {
      // this.messageSuccess = true;
      this.onSearch();
      // this.isEnableGlobalSearch = false;
      // this.showValidTextMessage = false;
    }
  }
  unselectStatus(): void {
    this.deviceFilterForm.get('status').reset();
    this.onSearch();
    // this.isEnableStatus = false;
  }

  isEnableStatusFunc(): any {
    // this.isEnableStatus = true;
  }

  // Device type
  unselectDeviceType(): void {
    this.deviceFilterForm.get('deviceName').reset();
    this.onSearch();
    // this.isEnableDeviceType = false;
  }

  isEnableDeviceTypeFunc(): any {
    // this.isEnableDeviceType = true;
  }

  onSearch(): void {
    // this.paginator.pageIndex = 0;
    // if (
    //   !this.isEnableGlobalSearch &&
    //   !this.isEnableDeviceType &&
    //   !this.isEnableStatus &&
    //   !this.deviceFilterForm.value.searchQuery &&
    //   !this.deviceFilterForm.value.deviceName &&
    //   !this.deviceFilterForm.value.status
    // ) {
    //   return;
    // }
    // const regExp = /[a-zA-Z0-9_.-]/g;
    // const testString = this.deviceFilterForm.value.searchQuery;
    // if (this.deviceFilterForm.value.searchQuery && !regExp.test(testString)) {
    //   this.showValidTextMessage = true;
    //   return;
    // }
    // const formValue = this.deviceFilterForm.value;
    // // eslint-disable-next-line guard-for-in
    // for (const prop in formValue) {
    //   if (!formValue[prop]) {
    //     delete formValue[prop];
    //   }
    //   if (Array.isArray(formValue[prop])) {
    //     const resultArray = formValue[prop].filter((item) => item);
    //     if (resultArray.length > 0) {
    //       formValue[prop] = resultArray;
    //     } else {
    //       delete formValue[prop];
    //     }
    //   }
    // }
    // this.filterstateServce.setFiltersArrayValues(formValue);
    // const searchData = new HttpParams({ fromObject: formValue });
    // this.dataSource.loadDeviceSearch(
    //   0,
    //   this.paginator.pageSize,
    //   this.sort.active,
    //   this.sort.direction,
    //   searchData
    // );
  }

  // global Search
  unselectGlobalSearch(): void {
    // this.deviceFilterForm.get('searchQuery').reset();
    // this.onSearch();
    // this.isEnableGlobalSearch = false;
    // this.getDevcieList();
    // this.messageSuccess = true;
  }
  // -----Function to open modal pop-up for creating device data---------
  createDevice(addDevice: string): void {
    const createModalDeviceConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside it's body
    createModalDeviceConfig.disableClose = true;
    (createModalDeviceConfig.maxWidth = '100vw'), // Modal maximum width
      (createModalDeviceConfig.maxHeight = '100vh'), // Modal maximum height
      //  createModalDeviceConfig.height = "78vh"; // Modal height
      (createModalDeviceConfig.width = '65%'); // Modal width
    createModalDeviceConfig.data = { add: addDevice };
    this.dialog
      .open(AddEditDeviceComponent, createModalDeviceConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.filterService.deviceStatusFilter.next({ status: 'ALL' });
          this.filterService.deviceTypeFilter.next({ deviceName: 'ALL' });
          this.isEnableStatus = false;
          this.isEnableGlobalSearch = false;
          this.isEnableDeviceType = false;
        }
      });
    this.filterService.deviceStatusFilterCall({ status: 'ALL' });
  }
  ngOnDestroy() {
    this.filterService.deviceStatusFilterCall({ status: null });
  }
  public openBulkDialog(): void {
    const addDialogRef = this.dialog.open(DeviceBulkUploadDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '150vh',
      width: '33%',
    });

    addDialogRef.afterClosed().subscribe((e) => {
      if (e) {
        this.filterService.deviceStatusFilter.next({ status: 'ALL' });
        this.filterService.deviceTypeFilter.next({ deviceName: 'ALL' });
        this.isEnableStatus = false;
        this.isEnableGlobalSearch = false;
        this.isEnableDeviceType = false;
      }
      // this.updateTable();
    });
  }
  addDeviceType(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    (dialogConfig.maxWidth = '100vw'),
      (dialogConfig.maxHeight = '100vh'),
      // (dialogConfig.width = '750px'),
      this.dialog
        .open(DeviceTypeAddComponent, dialogConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.navigationBar?.resetStatusFilter();
            this.deviceTypeComponent.getDeviceTypeList();
            this.deviceSharedService.changeDeviceType(e);
            this.deviceTypeComponent.getDeviceTypeList();
          }
        });
  }
  addDeviceModel(data): void {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '44%'),
      (createEntityModalConfig.data = data);
    this.dialog
      .open(DeviceModelDialogComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.navigationBar?.resetStatusFilter();
          this.deviceModelComponent.getDeviceModels();
        }
      });
  }
  openVendorDialog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    (dialogConfig.maxWidth = '100vw'),
      (dialogConfig.maxHeight = '100vh'),
      (dialogConfig.width = '350px'),
      (dialogConfig.data = data),
      this.dialog
        .open(AddVendorsComponent, dialogConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.vendorComponent.getVendorList();
          }
        });
  }
}
