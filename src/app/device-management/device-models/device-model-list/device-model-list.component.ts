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
import { SnackbarService } from '../../../core/services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceModelService } from '../device-model.service';
import { DeviceModelDialogComponent } from '../device-model-dialog/device-model-dialog.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-device-model-list',
  templateUrl: './device-model-list.component.html',
  styleUrls: ['./device-model-list.component.scss'],
})
export class DeviceModelListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  @ViewChild('navigationBar') navigationBar: NavigationBarComponent;
  filterValues: any;
  displayedColumns: string[] = ['name', 'deviceType', 'vendor', 'action'];
  dataSource: MatTableDataSource<any>;
  pageSizeOptions = [10, 25, 100];
  length = -1;
  pageIndex = 0;
  public deviceModelfilter: FormGroup;
  isEnableGlobalSearch: boolean;
  showValidTextMessage = false;
  userRole;

  constructor(
    private router: Router,
    public entityModalPopup: MatDialog,
    public deviceModelservice: DeviceModelService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    public authService: AuthService,
    private filterService: FilterSharedService,
    private renderer: Renderer2,
  ) {
    this.getDeviceModels();
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.filterService.globalDeviceModel.subscribe((res) => {
      if (Object.keys(res).length) {
        this.filterValues = res;
        this.onDeviceModelFilter(res);
      } else {
        this.getDeviceModels();
      }
    });
  }
  scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {

    this.sort?.sortChange.subscribe((val) => {
      this.scrollToTop();
      this.getDeviceModels(this.filterValues);
    });
  }

  addDeviceModel(data): void {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '44%'),
      (createEntityModalConfig.data = data);
    this.entityModalPopup
      .open(DeviceModelDialogComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.navigationBar?.resetStatusFilter();
          this.getDeviceModels();
        }
      });
  }

  editSpecialty(entity): void {
    const editEntityModalConfig = new MatDialogConfig();
    localStorage.setItem('speciality_id', entity.id);
    editEntityModalConfig.disableClose = true;
    (editEntityModalConfig.maxWidth = '100vw'),
      (editEntityModalConfig.maxHeight = '120vh'),
      (editEntityModalConfig.width = '600px'),
      (editEntityModalConfig.data = { add: 'edit', value: entity });
    this.entityModalPopup
      .open(DeviceModelDialogComponent, editEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        if (e) {
          this.navigationBar?.resetStatusFilter();
          this.getDeviceModels();
        }
      });
  }

  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();

    this.length = event.length;
    this.getDeviceModels(event.pageIndex, event.pageSize);
  }

  getDeviceModels(
    pageNumber = 0,
    pageSize = 10,

    searchQuery = null
  ): void {
    this.deviceModelservice.getAllModels(pageNumber, pageSize).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.length = data.totalElements;
        this.pageIndex = pageNumber;
      },
      (error) => {
        this.snackBarService.error(error.message);
      }
    );
  }
  onDeviceModelFilter(res): void {
    this.paginator.pageIndex = 0;
    if (!Object.keys(res).length) {
      return;
    } else if (res.searchQuery) {
      this.deviceModelservice
        .getAllModels(
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          res.searchQuery
        )
        .subscribe((data) => {
          this.dataSource = new MatTableDataSource(data.content);
          this.length = data.totalElements;
        });
    } else {
      this.getDeviceModels();
    }
  }
  // // global Search
  // unselectGlobalSearch(): void {
  //   this.paginator.pageIndex = 0;
  //   this.deviceModelfilter.get('searchQuery').reset();
  //   this.onDeviceModelFilter();
  //   this.isEnableGlobalSearch = false;
  // }

  // isEnableGlobalSearchFunc(): any {
  //   if (this.deviceModelfilter.get('searchQuery').value.length > 2) {
  //     this.onDeviceModelFilter();
  //     this.isEnableGlobalSearch = true;
  //   } else if (!this.deviceModelfilter.get('searchQuery').value.length) {
  //     this.getDeviceModels();
  //     this.isEnableGlobalSearch = false;
  //     localStorage.removeItem('searchDataLength');
  //     this.showValidTextMessage = false;
  //   }
  // }
}
