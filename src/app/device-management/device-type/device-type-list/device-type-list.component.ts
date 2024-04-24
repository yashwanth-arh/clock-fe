import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeviceTypeAddComponent } from '../device-type-add/device-type-add.component';
import { DeviceTypeEditComponent } from '../device-type-edit/device-type-edit.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
import { DeviceManagementSharedService } from '../../device.management.shared-service';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-device-type-list',
  templateUrl: './device-type-list.component.html',
  styleUrls: ['./device-type-list.component.scss'],
})
export class DeviceTypeListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  @ViewChild(NavigationBarComponent) navigationBar;
  vendorName = new FormControl();
  statusSelected = new FormControl();
  deviceName = new FormControl();
  filteredStatus: Observable<any>;
  filteredVendor: Observable<any>;
  filteredDevice: Observable<any>;
  isEnableGlobalSearch: boolean;
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  displayedColumns: string[] = ['name', 'description', 'action'];
  dataSource: MatTableDataSource<any>;
  public deviceTypefilter: FormGroup;
  userRole: string;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private deviceService: DeviceTypeService,
    private snackBarService: SnackbarService,
    private deviceSharedService: DeviceManagementSharedService,
    private fb: FormBuilder,
    public authService: AuthService,
    private renderer: Renderer2,
  ) {
    this.deviceSharedService.changeDeviceType('');
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    this.getDeviceTypeList();
    if (!this.router?.routerState?.snapshot?.url?.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.deviceTypefilter = this.fb.group({
      searchquery: [''],
    });
  }
  scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }
  ngAfterViewInit(): void {
    if (this.userRole === 'RPM_ADMIN') {
      this.sort?.sortChange.subscribe((val) => {
        this.scrollToTop();
        this.getDeviceTypeList(0, 10);
      });
    }
  }

  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();
    this.length = event.length;
    this.getDeviceTypeList(event.pageIndex, event.pageSize);
  }

  editDeviceType(clinicdata: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    (dialogConfig.maxWidth = '100vw'),
      (dialogConfig.maxHeight = '100vh'),
      // (dialogConfig.width = '750px'),
      (dialogConfig.data = clinicdata);
    this.dialog
      .open(DeviceTypeEditComponent, dialogConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.navigationBar?.resetStatusFilter();
          this.getDeviceTypeList(0, 10);
        }
      });
  }

  getDeviceTypeList(pageNumber = 0, pageSize = 10): void {
    this.deviceService.getAllDeviceType(pageNumber, pageSize).subscribe(
      (data) => {
        // if (data['err'] === 403) {
        //   this.snackBarService.error(data['message']);
        // }
        const devicelist = data.content;
        this.dataSource = new MatTableDataSource(devicelist);
        this.length = data.totalElements;
        this.pageIndex = pageNumber;
        // this.snackBarService.openSnackBar("Successfull!", "close", 3000);
      },
      (error) => {
        this.snackBarService.error(error.message);
      }
    );
  }

  onDeviceTypeFilter(): void {
    this.deviceService
      .getAllDeviceType(
        this.pageIndex,
        1,

        this.deviceTypefilter.get('searchquery').value !== ''
          ? this.deviceTypefilter.get('searchquery').value
          : null
      )
      .subscribe((e) => {
        const devicelist = e.content;
        this.dataSource = new MatTableDataSource(devicelist);
      });
  }
}
