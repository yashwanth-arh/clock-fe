import { element } from 'protractor';
import { ClinicTimingsComponent } from './../clinic-timings/clinic-timings.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { BranchAddEditComponent } from '../branch-add-edit/branch-add-edit.component';
import { BranchService } from '../branch.service';
import { BranchDataSource } from './branc-data-source';
import { LocationService } from 'src/app/core/services/location.service';
import { HospitalManagementService } from '../../../hospital-management/service/hospital-management.service';
import { Status } from 'src/app/shared/entities/status.enum';
import { ToolbarService } from 'src/app/core/services/toolbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { tap } from 'rxjs/operators';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { TitleCasePipe } from '@angular/common';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';
import { MatTable } from '@angular/material/table';
@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
})
export class BranchListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  @ViewChild(NavigationBarComponent) navBar;

  displayedColumns: string[] = [
    'name',
    // 'noOfAdmins',
    // 'hospital',
    // 'address.addressLine',
    // 'address.city',
    // 'address.state',
    'primaryContactNumber',
    'email',
    'city',
    'clinicNPI',
    // 'timing',
    'status',
    'action',
  ];
  dataSource: BranchDataSource;
  hospitalName = new FormControl();
  leavingComponent: boolean = false;
  statusName = new FormControl();
  cityName = new FormControl();
  searchquery = new FormControl();
  filteredHospital: Observable<any>;
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  statusList = [];
  city: string[] = [];
  practiceList = [];
  public status = Status;
  isEnableGlobalSearch: boolean;
  isEnableStatus: boolean;
  isEnablePractice: boolean;
  isEnableCity: boolean;
  messageSuccess: boolean;
  userRole: string;
  showValidTextMessage = false;
  searchQuery: any = null;
  statusFilter: any;
  adminAccess: string;

  constructor(
    private router: Router,
    public entityModalPopup: MatDialog,
    private branchservice: BranchService,
    private titleCasePipe: TitleCasePipe,
    private orgservice: HospitalManagementService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private snacbarService: SnackbarService,
    private filterService: FilterSharedService,
    private renderer: Renderer2
  ) {
    this.leavingComponent = false;
    this.dataSource = new BranchDataSource(
      this.branchservice,
      this.snacbarService
    );
    this.statusList = Object.keys(this.status);
    const user = this.auth.authData;
    this.userRole = user?.userDetails?.userRole;
    this.adminAccess = localStorage.getItem('adminAccess');

    // if(this.adminAccess == 'false'){
    //   this.displayedColumns.splice(6,1)
    // }
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    this.filterService.globalFacilitiesCall({});
    this.filterService.statusFacilitiesCall({ status: 'ALL' });
    this.filterService.globalFacilities.subscribe((res) => {
      this.searchQuery = res.searchQuery;
      this.onBranchFilter();
    });
    this.filterService.statusFacilities.subscribe((res) => {
      if (res.status !== 'ALL') {
        this.statusFilter = res.status;

        if (Object.keys(res).length) {
          this.isEnableStatusFunc();
          this.onBranchFilter();
        }
      } else {
        this.statusFilter = '';
        this.isEnableStatusFunc();
        this.onBranchFilter();
      }
    });
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    // this.dataSource.loadData(0);
    // this.orgservice.getPracticeList().subscribe(
    //   (res: any) => {
    //     this.practiceList = res.hospitalList;
    //     this.practiceList.sort((a, b) => (a.name > b.name ? 1 : -1));
    //   },
    //   (err) => {
    //     // this.snacbarService.error(err.message);
    //   }
    // );

    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
  }
  goToPractices(): any {
    this.router.navigate(['home/hospitals']);
  }
  public loadBranchPage(): void {
    this.dataSource.loadData(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.statusFilter,
      this.hospitalName.value,
      this.cityName.value,
      this.searchQuery
    );
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
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
          this.scrollToTop();
          this.loadBranchPage();
        })
      )
      .subscribe();
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params)) {
        this.hospitalName.setValue(params?.name);
        this.dataSource.loadData(
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.statusFilter !== '' ? this.statusFilter : null,
          this.hospitalName.value,
          this.cityName.value !== '' ? this.cityName.value : null,
          this.searchQuery !== '' ? this.searchQuery : null
        );
      }
    });
  }

  addBranch(): void {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '150vh'),
      (createEntityModalConfig.width = '65%'),
      (createEntityModalConfig.data = { add: 'add', value: null });
    this.entityModalPopup
      .open(BranchAddEditComponent, createEntityModalConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          // this.navBar.resetStatusFilter();
          this.filterService.statusFacilities.next({ status: 'ALL' });
          // this.FacilitiesList.get('status').setValue('ALL');
          // this.statusName.setValue(null);
          this.statusFilter = null;
          this.isEnableStatus = false;
          this.loadBranchPage();
        }
      });
  }

  editBranch(entity): void {
    const clinicTimingModalConfig = new MatDialogConfig();
    clinicTimingModalConfig.disableClose = true;
    (clinicTimingModalConfig.maxWidth = '100vw'),
      (clinicTimingModalConfig.maxHeight = '120vh'),
      (clinicTimingModalConfig.width = '65%'),
      (clinicTimingModalConfig.data = { add: 'edit', value: entity });
    this.entityModalPopup
      .open(BranchAddEditComponent, clinicTimingModalConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.searchquery.setValue(null);
          this.cityName.setValue(null);
          this.hospitalName.setValue(null);
          this.filterService.statusFacilities.next({ status: 'ALL' });
          this.statusFilter = null;
          this.isEnableGlobalSearch = false;
          this.isEnableCity = false;
          this.isEnablePractice = false;
          this.isEnableStatus = false;
          this.loadBranchPage();
        }
      });
  }

  public goToUserPage(branch): void {
    const filter = 'id:' + branch.name;
    localStorage.setItem('branch_name', branch.name);
    localStorage.setItem('branch_id', branch.id);
    this.router.navigate(['home/facilities/users'], {
      queryParams: { name: branch.name, id: branch.id },
      skipLocationChange: false,
    });
    history.pushState(filter, '', 'home/facilities/users');
  }
  getFullName(element) {
    return this.titleCasePipe.transform(element.name);
  }
  getFieldName(element: any, key: string): string | null {
    switch (key) {
      case 'hospital':
        return element && element.hospital ? element.hospital.name : 'N/A';
        break;
      case 'state':
        return element && element.address ? element.address.state : 'N/A';
        break;
      case 'city':
        return element && element.address ? element.address.city : 'N/A';
        break;
      case 'address':
        return element &&
          element.address &&
          element.address.addressLine &&
          element.address.addressLine !== ''
          ? element.address.addressLine
          : 'N/A';
        break;
      case 'zipcode':
        return element &&
          element.address &&
          element.address.zipCode &&
          element.address.zipCode !== ''
          ? element.address.zipCode
          : 'N/A';
        break;
      case 'emergencycontact':
        return element && element.emergencyContactNumber
          ? element.emergencyContactNumber
          : 'N/A';
        break;
      default:
        return 'N/A';
        break;
    }
  }
  onBranchFilter(): void {
    if (this.leavingComponent) {
      return;
    }
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    const regExp = /[a-zA-Z]/g;
    const testString = this.searchQuery;
    if (
      !this.isEnableGlobalSearch &&
      !this.isEnableStatus &&
      !this.isEnablePractice &&
      !this.isEnableCity &&
      !this.searchQuery &&
      !this.hospitalName.value &&
      !this.cityName.value &&
      !this.statusFilter
    ) {
      return;
    }
    // if (this.searchQuery) {
    //   this.showValidTextMessage = true;
    //   return;
    // }
    if (this.cityName.value && !regExp.test(this.cityName.value)) {
      this.snacbarService.error('Enter valid city text');
      return;
    }
    this.dataSource.loadData(
      0,
      this.paginator ? this.paginator.pageSize : 10,
      this.sort ? this.sort.active : '',
      this.sort ? this.sort.direction : '',
      this.statusFilter !== '' ? this.statusFilter : null,
      this.hospitalName.value && this.hospitalName.value !== ''
        ? this.hospitalName.value
        : null,
      this.cityName.value !== '' ? this.cityName.value : null,
      this.searchQuery !== '' ? this.searchQuery : null
    );
  }

  unselectGlobalSearch(): void {
    this.showValidTextMessage = false;
    this.searchQuery.reset();
    this.onBranchFilter();
    this.isEnableGlobalSearch = false;
  }

  isEnableGlobalSearchFunc(): any {
    if (this.searchQuery != null) {
      if (this.searchQuery.length > 2) {
        this.onBranchFilter();
        this.isEnableGlobalSearch = true;
      } else if (!this.searchQuery.length) {
        this.messageSuccess = true;
        this.loadBranchPage();
        this.isEnableGlobalSearch = false;
        this.showValidTextMessage = false;
      }
    }
  }
  unselectStatus(): void {
    this.statusName.reset();
    this.onBranchFilter();
    this.isEnableStatus = false;
  }

  isEnableStatusFunc(): any {
    this.isEnableStatus = true;
  }
  unselectPractice(): void {
    this.hospitalName.reset();
    this.onBranchFilter();
    this.isEnablePractice = false;
  }
  isEnablePracticeFun(): void {
    this.isEnablePractice = true;
  }

  unselectCity(): void {
    this.cityName.reset();
    this.onBranchFilter();
    this.isEnableCity = false;
  }

  isEnableCityFunc(): any {
    if (this.cityName.value.length > 2) {
      this.onBranchFilter();
      this.isEnableCity = true;
    } else if (!this.cityName.value.length) {
      this.loadBranchPage();
      this.isEnableCity = false;
    }
  }
  openTimings(ele) {
    const clinicTimingModalConfig = new MatDialogConfig();
    clinicTimingModalConfig.disableClose = true;
    (clinicTimingModalConfig.maxWidth = '100vw'),
      (clinicTimingModalConfig.maxHeight = '120vh'),
      (clinicTimingModalConfig.width = '1000px'),
      (clinicTimingModalConfig.data = { elementData: ele });
    this.entityModalPopup
      .open(ClinicTimingsComponent, clinicTimingModalConfig)
      .afterClosed()
      .subscribe(() => {
        this.searchquery.setValue(null);
        this.cityName.setValue(null);
        this.hospitalName.setValue(null);
        // this.statusName.setValue(null);
        this.statusFilter = null;
        this.isEnableGlobalSearch = false;
        this.isEnableCity = false;
        this.isEnablePractice = false;
        this.isEnableStatus = false;
        this.loadBranchPage();
      });
  }
  updateStatus(element) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are changing the status for "${element.name}" to "${
          element.status === 'ACTIVE' ? 'Inactive' : 'Active'
        }". Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.entityModalPopup
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.branchservice
            .updateStatusForFacility(
              element.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              element.id
            )
            .subscribe((res) => {
              this.snacbarService.success('Status updated successfully');
              this.loadBranchPage();
            });
        } else {
          this.loadBranchPage();
        }
      });
  }
}
