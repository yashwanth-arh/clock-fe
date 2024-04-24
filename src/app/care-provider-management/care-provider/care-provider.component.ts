import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  Renderer2,
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
import { TitleCasePipe } from '@angular/common';

import { HttpParams } from '@angular/common/http';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { FiltersStateService } from '../../core/services/filters-state.service';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { UserPermission } from 'src/app/shared/entities/user-permission.enum';
import { ROUTEINFO } from 'src/app/shared/entities/route.info';
import { CareProviderDialogComponent } from '../care-provider-dialog/care-provider-dialog.component';
import { DoctorDataSource } from 'src/app/doctor-management/service/doctor-data-source';
import { DoctorClinicComponent } from 'src/app/doctor-management/doctor-clinic/doctor-clinic.component';
import { DoctorResponse } from 'src/app/doctor-management/entities/doctor';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';
import { ProviderFacilityMapComponent } from '../provider-facility-map/provider-facility-map.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { CareproviderMyTeamsComponent } from '../careprovider-my-teams/careprovider-my-teams.component';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-care-provider',
  templateUrl: './care-provider.component.html',
  styleUrls: ['./care-provider.component.scss'],
})
export class CareProviderComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'role',
    // 'clinicNames',
    'specializations',
    // 'homeNumber',
    'cellNumber',
    'emailId',
    // 'address.addressLine',
    // 'address.state',
    // 'address.city',
    'docNPI',
    // 'locNPI',
    // 'facilitiesName',
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

  @ViewChild(NavigationBarComponent) navBar;

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
  userRole: UserRoles;
  filterValuesStatus: any;
  adminAccess: string;
  // private changeTitle: UserPermission = UserPermission.CAN_CHANGE_ENROLLMENT_TITLE;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private snackBarService: SnackbarService,
    private filterService: FilterSharedService,
    private filterstateServce: FiltersStateService,
    private authService: AuthService,
    private titlecasePipe: TitleCasePipe,
    private renderer: Renderer2
  ) {
    // Assign the data to the data source for the table to render

    // this.filterstateServce.getFiltersArrayValues().subscribe((res: any) => {
    //   this.searchFilterValues = res;
    // });
    this.leavingComponent = false;
    this.routeDetails = this.route.snapshot.data;
    this.authService.user.subscribe((user: User) => {
      if (user?.userDetails?.permissions) {
        this.routeDetails.showActionBtn = user?.userDetails?.permissions.some(
          (permission) => permission === this.allowedPermission
        );
      }
    });
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    if (this.userRole === 'HOSPITAL_USER') {
      this.displayedColumns.splice(6, 0, 'facilities');
    }
    setTimeout(() => {
      this.adminAccess = localStorage.getItem('adminAccess');
    }, 100);

    // if(this.adminAccess == 'false'){
    //   this.displayedColumns.pop();
    // }
  }

  ngOnInit(): void {
    this.filterService.globalCareProviderCall({});
    this.leavingComponent = false;
    this.dataSource = new DoctorDataSource(
      this.doctorService,
      this.snackBarService,
      this.authService
    );

    this.getAllSpeciality();
    const token = localStorage.getItem('auth');
    if (!this.router?.routerState?.snapshot?.url?.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    if (this.userRole !== 'RPM_ADMIN') {
      // this.dataSource.loadCareProviders(0, 0);

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
      this.filterService.globalCareProvider.subscribe((res) => {
        this.filterValues = res;
        if (Object.keys(res).length) {
          this.paginator.pageIndex = 0;
          this.search();
        } else {
          this.search();
        }
      });
      this.filterService.statusCareProvider.subscribe((res) => {
        if (res.status !== 'ALL') {
          this.filterValuesStatus = res;
          if (Object.keys(res).length) {
            if (this.paginator) {
              this.paginator.pageIndex = 0;
            } else {
              res = {};
            }
            this.search();
          }
        } else {
          this.filterValuesStatus = '';
          this.search();
        }
      });
    }
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
    this.sort?.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort?.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.scrollToTop();
          this.loadDoctorsPage();
        })
      )
      .subscribe();
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

    this.dataSource.loadCareProviders(
      this.paginator?.pageIndex,
      this.paginator?.pageSize,
      'createdAt',
      'desc',
      searchData
    );
  }
  getMyTeams(data) {
    const doctorClinicModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    doctorClinicModalConfig.disableClose = true;
    (doctorClinicModalConfig.width = '1000px'),
      (doctorClinicModalConfig.height = '600px'),
      (doctorClinicModalConfig.data = data),
      this.dialog
        .open(CareproviderMyTeamsComponent, doctorClinicModalConfig)
        .afterClosed()
        .subscribe((e) => {
          // this.doctorsList.reset();
          this.isEnableGlobalSearch = false;
          this.isEnableClinic = false;
          this.isEnableSpecialities = false;
          this.isEnableCity = false;
          this.getDoctorsList();
          this.filterstateServce.setFiltersArrayValues(null);
        });
  }
  addDoctor(): void {
    const raiseDoctorModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    raiseDoctorModalConfig.disableClose = true;
    (raiseDoctorModalConfig.maxWidth = '100vw'),
      (raiseDoctorModalConfig.maxHeight = '100vh'),
      // raiseDoctorModalConfig.height = "60vh",
      (raiseDoctorModalConfig.width = '65.3%'),
      (raiseDoctorModalConfig.data = { mode: 'ADD' }),
      this.dialog
        .open(CareProviderDialogComponent, raiseDoctorModalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.filterService.statusCareProvider.next({ status: 'ALL' });
            this.getDoctorsList();
            this.isEnableSpecialities = false;
            this.isEnableGlobalSearch = false;
            this.isEnableClinic = false;
          }
        });
  }
  editDoctor(data: any): void {
    const editDoctorModalConfig = new MatDialogConfig();

    // The user can't close the dialog by clicking outside its body
    editDoctorModalConfig.disableClose = true;
    (editDoctorModalConfig.maxWidth = '100vw'),
      (editDoctorModalConfig.maxHeight = '100vh'),
      // raiseDoctorModalConfig.height = "60vh",
      (editDoctorModalConfig.width = '65.3%'),
      (editDoctorModalConfig.data = {
        panelClass: 'dialog-responsive',

        edit: data,
        providerId: data?.careProviderId,
        providerName: data.name,
        // orgId: data.hospital.name,
        branchId: data.clinicIds,
        mode: 'EDIT',
      }),
      this.dialog
        .open(CareProviderDialogComponent, editDoctorModalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.filterService.statusCareProvider.next({ status: 'ALL' });
            this.getDoctorsList();
            this.isEnableGlobalSearch = false;
            this.isEnableClinic = false;
            this.isEnableSpecialities = false;
            this.isEnableCity = false;
            this.filterstateServce.setFiltersArrayValues(null);
          }
        });
  }

  doctorFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
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
    // this.dataSource.loadCareProviders(0, 0)?.map((item) => ({
    //   ...item,
    //   showMore: false,
    //   showMoreClinic: false,
    // }));
    this.loadDoctorsPage();
    this.filterstateServce.setFiltersArrayValues(null);
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
          element.userStatus === 'ACTIVE' ? 'Inactive' : 'Active'
        }". Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.doctorService
            .updateStatusCareprovider(
              element.userStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              element.careProviderId
            )
            .subscribe(
              (res) => {
                this.snackBarService.success('Status updated successfully');
                this.loadDoctorsPage();
              },
              (err) => {
                if (err.err === 409) {
                  this.snackBarService.error(
                    'Patients are mapped to this careprovider, status change is not allowed'
                  );
                }
              }
            );
        } else {
          this.loadDoctorsPage();
        }
      });
  }
  getAllSpeciality(): void {
    this.doctorService.getSpecialization().subscribe((data: any) => {
      this.specialityList = data;
    });
  }

  assignFacilityProvider(data: number): void {
    const doctorClinicModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    doctorClinicModalConfig.disableClose = true;
    (doctorClinicModalConfig.width = '1000px'),
      (doctorClinicModalConfig.height = '600px'),
      (doctorClinicModalConfig.data = data),
      this.dialog
        .open(ProviderFacilityMapComponent, doctorClinicModalConfig)
        .afterClosed()
        .subscribe((e) => {
          // this.doctorsList.reset();
          this.isEnableGlobalSearch = false;
          this.isEnableClinic = false;
          this.isEnableSpecialities = false;
          this.isEnableCity = false;
          this.getDoctorsList();
          this.filterstateServce.setFiltersArrayValues(null);
        });
  }

  trimString(text, length): string {
    return text.length > length ? text.substring(0, length) : text;
  }
  getSpecializationsNames(element) {
    // let sNames = [];
    // element.forEach((res) => {
    //   sNames.push(res.specialityName);
    // });
    // return sNames.toString();
    if (element && element.length > 0) {
      return this.titlecasePipe.transform(element[0].specialityName);
    }
    return null;
    //  return element.specialityName ? this.titlecasePipe.transform(element.specialityName):'';
  }
  getFullNames(element) {
    return (
      this.titlecasePipe.transform(element.firstName) +
      ' ' +
      (element.middleName
        ? this.titlecasePipe.transform(element.middleName)
        : '') +
      ' ' +
      this.titlecasePipe.transform(element.lastName)
    );
  }
  getFacilityName(ele) {
    return ele.name ? this.titlecasePipe.transform(ele.name) : '';
  }
  getFacilityNameSub(e, ele) {
    const firstName =
      e?.name !== ele?.name ? this.titlecasePipe.transform(e?.name) : '';
    return firstName;
  }
  search(): void {
    if (this.leavingComponent) {
      return;
    }
    // this.paginator.pageIndex = 0;
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
    const searchData = new HttpParams({ fromObject: params });
    this.filterstateServce.setFiltersArrayValues(formValue);
    this.dataSource.loadDoctorsSearch(
      this.paginator?.pageIndex ? this.paginator?.pageIndex : 0,
      this.paginator?.pageSize ? this.paginator?.pageSize : 10,
      this.sort.active,
      this.sort.direction,
      searchData
    );
  }
  // openDoctor() {
  //   const raiseDoctorModalConfig = new MatDialogConfig();
  //   // The user can't close the dialog by clicking outside its body
  //   raiseDoctorModalConfig.disableClose = true;
  //   (raiseDoctorModalConfig.maxWidth = '100vw'),
  //     (raiseDoctorModalConfig.maxHeight = '100vh'),
  //     // raiseDoctorModalConfig.height = "60vh",
  //     (raiseDoctorModalConfig.width = '65%'),
  //     (raiseDoctorModalConfig.data = { mode: 'ADD' }),
  //     this.dialog
  //       .open(CareProviderDialogComponent, raiseDoctorModalConfig)
  //       .afterClosed()
  //       .subscribe((e) => {

  //         this.getDoctorsList();
  //         // this.doctorsList.reset();
  //         // this.isEnableSpecialities = false;
  //         // this.isEnableGlobalSearch = false;
  //         // this.isEnableClinic = false;
  //       });
  // }
}
