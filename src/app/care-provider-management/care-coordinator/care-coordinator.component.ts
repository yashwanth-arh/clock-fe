import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocationService } from '../../core/services/location.service';
import { SnackbarService } from '../../core/services/snackbar.service';

import { HttpParams } from '@angular/common/http';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { FiltersStateService } from '../../core/services/filters-state.service';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { UserPermission } from 'src/app/shared/entities/user-permission.enum';
import { ROUTEINFO } from 'src/app/shared/entities/route.info';
import { DoctorDataSource } from 'src/app/doctor-management/service/doctor-data-source';
import { DoctorResponse } from 'src/app/doctor-management/entities/doctor';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { CareCoordinatorDialogComponent } from '../care-coordinator-dialog/care-coordinator-dialog.component';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { TitleCasePipe } from '@angular/common';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-care-coordinator',
  templateUrl: './care-coordinator.component.html',
  styleUrls: ['./care-coordinator.component.scss'],
})
export class CareCoordinatorComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'gender',
    // 'clinicNames',
    // 'specializations',
    // 'homeNumber',

    'emailId',
    'cellNumber',
    'designation',
    // 'address.addressLine',
    // 'address.state',
    // 'address.city',
    // 'docNPI',
    // 'locNPI',
    // 'facility',
    'status',
    'actions',
  ];
  filterValues: any;
  doctorsList: FormGroup;
  practiceFilter = new FormControl();
  clinicFilter = new FormControl();
  statusFilter = new FormControl();
  stateFilter = new FormControl();
  cityFilter = new FormControl();
  doctorDataList: any;
  specialityList: any;
  showValidTextMessage = false;

  public dataSource: DoctorDataSource;
  public patient: DoctorResponse;

  state: string[] = [];
  city: string[] = [];

  status: string[] = ['ACTIVE', 'INACTIVE'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  clinicList = [];
  practiceList = [];
  showMore: false;
  public searchFilterValues;
  isEnableClinic: boolean;
  isEnableSpecialities: boolean;
  isEnableCity: boolean;
  isEnableGlobalSearch: boolean;
  leavingComponent: boolean = false;
  public selectedRole: UserRoles;
  public userRoles = UserRoles;
  public routeDetails: ROUTEINFO;
  private allowedPermission: UserPermission = UserPermission.CAN_ADD_PROVIDER;
  messageSuccess: boolean;
  changedStatus: any;
  filterValuesStatus: any;
  userRole;
  adminAccess: string;
  // private changeTitle: UserPermission = UserPermission.CAN_CHANGE_ENROLLMENT_TITLE;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private titlecasePipe: TitleCasePipe,
    private doctorService: DoctorService,
    private snackBarService: SnackbarService,
    private filterService: FilterSharedService,
    private filterstateServce: FiltersStateService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {
    this.leavingComponent = false;
    // Assign the data to the data source for the table to render

    // this.filterstateServce.getFiltersArrayValues().subscribe((res: any) => {
    //   this.searchFilterValues = res;
    // });
    this.adminAccess = localStorage.getItem('adminAccess');
    if (this.adminAccess == 'false') {
      this.displayedColumns.pop();
    }
    this.routeDetails = this.route.snapshot.data;
    this.authService.user.subscribe((user: User) => {
      if (user?.userDetails?.permissions) {
        this.routeDetails.showActionBtn = user?.userDetails?.permissions.some(
          (permission) => permission === this.allowedPermission
        );
      }
    });
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;
    if (this.userRole === 'HOSPITAL_USER') {
      this.displayedColumns.splice(5, 0, 'facility');
    }
  }

  ngOnInit(): void {
    this.filterService.globalCareCoordinatorCall({});
    this.filterService.statusCareCoordinatorCall({ status: 'ALL' });

    this.leavingComponent = false;
    this.dataSource = new DoctorDataSource(
      this.doctorService,
      this.snackBarService,
      this.authService
    );
    const token = localStorage.getItem('auth');
    if (!this.router?.routerState?.snapshot?.url?.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    // this.dataSource.loadCoordinators(0, 0);

    this.authService.user.subscribe((user: User) => {
      this.selectedRole = user?.userDetails?.userRole;
    });

    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0 || data == -1) {
        this.messageSuccess = false;
      }
    });
    this.filterService.globalCareCoordinator.subscribe((res) => {
      this.filterValues = res;
      if (Object.keys(res)?.length) {
        this.paginator.pageIndex = 0;
        this.search();
      } else {
        this.search();
      }
    });
    this.filterService.statusCareCoordinator.subscribe((res) => {
      if (res.status !== 'ALL') {
        this.filterValuesStatus = res;
        if (Object.keys(res)?.length) {
          this.paginator.pageIndex = 0;
          this.search();
        }
      } else {
        this.filterValuesStatus = '';
        this.search();
      }
    });
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
    let params;
    if (this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues.searchQuery
          ? this.filterValues.searchQuery
          : '',
        status: this.filterValuesStatus.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (!this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        status: this.filterValuesStatus.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (this.filterValues?.searchQuery && !this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues.searchQuery
          ? this.filterValues.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });
    this.sort?.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort?.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.scrollToTop();
          //
          this.loadDoctorsPage();
        })
      )
      .subscribe();
  }
  getFacilityNames(name) {
    return name;
  }
  public loadDoctorsPage(): void {
    if (this.leavingComponent) {
      return;
    }
    let params;
    if (this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues.searchQuery
          ? this.filterValues.searchQuery
          : '',
        status: this.filterValuesStatus.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (!this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        status: this.filterValuesStatus.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (this.filterValues?.searchQuery && !this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues.searchQuery
          ? this.filterValues.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });
    this.dataSource.loadCoordinators(
      this.paginator?.pageIndex,
      this.paginator?.pageSize,
      'createdAt',
      'desc',
      searchData
    );
  }
  getFacility(ele) {
    return ele.facilityNames
      ? this.titlecasePipe.transform(ele.facilityNames)
      : '';
  }
  getGender(ele): any {
    if (ele?.gender?.includes('_')) {
      let splittedGender = ele?.gender.split('_');
      if (splittedGender?.length === 2) {
        return (
          this.titlecasePipe.transform(splittedGender[0]) +
          ' ' +
          splittedGender[1].toLowerCase()
        );
      } else if (splittedGender?.length === 3) {
        return (
          this.titlecasePipe.transform(splittedGender[0]) +
          ' ' +
          splittedGender[1].toLowerCase() +
          ' ' +
          splittedGender[2].toLowerCase()
        );
      } else if (splittedGender?.length === 4) {
        return (
          this.titlecasePipe.transform(splittedGender[0]) +
          ' ' +
          splittedGender[1].toLowerCase() +
          ' ' +
          splittedGender[2].toLowerCase() +
          ' ' +
          splittedGender[3].toLowerCase()
        );
      }
    } else {
      return this.titlecasePipe.transform(ele?.gender);
    }
  }
  doctorFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
  }
  openCareCoordinator() {
    const modalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    modalConfig.disableClose = true;
    (modalConfig.maxWidth = '100vw'),
      (modalConfig.maxHeight = '100vh'),
      // modalConfig.height = "60vh",
      (modalConfig.width = '65.3%'),
      (modalConfig.data = { mode: 'ADD' }),
      this.dialog
        .open(CareCoordinatorDialogComponent, modalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.filterService.statusCareCoordinator.next({ status: 'ALL' });
            this.search();
          }
          // this.loadDoctorsPage();
          // this.filterService.statusCareCoordinatorCall({ status: 'ALL' });
        });
  }
  editCareCoordinator(ele) {
    const modalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    modalConfig.disableClose = true;
    (modalConfig.maxWidth = '100vw'),
      (modalConfig.maxHeight = '100vh'),
      // modalConfig.height = "60vh",
      (modalConfig.width = '65.3%'),
      (modalConfig.data = { mode: 'EDIT', data: ele }),
      this.dialog
        .open(CareCoordinatorDialogComponent, modalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.filterService.statusCareCoordinator.next({ status: 'ALL' });
            this.search();
          }
        });
  }
  getFullName(value) {
    return (
      this.titlecasePipe.transform(value.firstName) +
      ' ' +
      this.titlecasePipe.transform(value.middleName ? value.middleName : '') +
      ' ' +
      this.titlecasePipe.transform(value.lastName)
    );
  }
  viewPatient(doctorDetails: any): void {
    const filter = 'id:' + doctorDetails.id;
    // eslint-disable-next-line max-len
    this.router.navigate(['home/patients/provider/' + doctorDetails.id], {
      queryParams: {
        providerId: doctorDetails.id,
        providerName: doctorDetails.name,
        orgId: doctorDetails.hospital.name,
        branchId: doctorDetails.clinicIds,
      },
      skipLocationChange: false,
    });
    history.pushState(filter, '', 'home/patients');
  }

  getDoctorsList(): any {
    this.dataSource = new DoctorDataSource(
      this.doctorService,
      this.snackBarService,
      this.authService
    );
    // this.dataSource.loadCoordinators(0, 0)?.map((item) => ({
    //   ...item,
    //   showMore: false,
    //   showMoreClinic: false,
    // }));
    this.loadDoctorsPage();
    this.filterstateServce.setFiltersArrayValues(null);
  }

  getAllSpeciality(): void {
    this.doctorService.getSpecialization().subscribe((data: any) => {
      this.specialityList = data;
    });
  }

  trimString(text, length): string {
    return text.length > length ? text.substring(0, length) : text;
  }

  search(): void {
    if (this.leavingComponent) {
      return;
    }
    // if (this.paginator) {
    //   this.paginator.pageIndex = 0;
    // }

    const formValue = this.filterValues;
    // eslint-disable-next-line guard-for-in
    let params;
    if (this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues.searchQuery
          ? this.filterValues.searchQuery
          : '',
        status: this.filterValuesStatus.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (!this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        status: this.filterValuesStatus.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (this.filterValues?.searchQuery && !this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues.searchQuery
          ? this.filterValues.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });
    for (const prop in formValue) {
      if (!formValue[prop]) {
        delete formValue[prop];
      }

      if (Array.isArray(formValue[prop])) {
        const resultArray = formValue[prop].filter((item) => item);
        if (resultArray?.length > 0) {
          formValue[prop] = resultArray;
        } else {
          delete formValue[prop];
        }
      }
    }
    this.filterstateServce.setFiltersArrayValues(formValue);
    this.dataSource.loadCoordinatorsSearch(
      this.paginator?.pageIndex ? this.paginator.pageIndex : 0,
      this.paginator?.pageSize ? this.paginator.pageSize : 10,
      searchData
    );
  }
  updateStatus(element) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are changing the status for "${this.titlecasePipe.transform(
          element.firstName
        )} ${this.titlecasePipe.transform(element.lastName)}" to "${
          element.status === 'ACTIVE' ? 'Inactive' : 'Active'
        }". Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.changedStatus = res;
          this.doctorService
            .updateStatusCoordinator(
              element.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              element.id
            )
            .subscribe((res) => {
              this.snackBarService.success('Status updated successfully');
              this.search();
            });
        }
      });
  }
}
