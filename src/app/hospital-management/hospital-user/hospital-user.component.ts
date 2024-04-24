import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { hospitalUserService } from '../service/hospital-user.service';
import { HospitalAddEditUserComponent } from './hospital-add-edit-user/hospital-add-edit-user.component';
import { hospitalUserDataSource } from '../service/hospital-user-data-source';
import { ToolbarService } from 'src/app/core/services/toolbar.service';
import { PlatformLocation, TitleCasePipe } from '@angular/common';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { HttpParams } from '@angular/common/http';
import { FiltersStateService } from 'src/app/core/services/filters-state.service';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-hospital-user',
  templateUrl: './hospital-user.component.html',
  styleUrls: ['./hospital-user.component.scss'],
})
export class HospitalUserComponent implements OnInit {
  userColumnHeaders: string[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild('table', { read: ElementRef }) table: ElementRef;
  @Input() hideNav: boolean;
  status: string[] = ['ACTIVE', 'INACTIVE'];

  public dataSource: hospitalUserDataSource;

  hospitalAdminList: FormGroup;
  statusFilter = new FormControl();
  nameFilter = new FormControl();
  filterValues: any;
  organzationId: string;
  messageSuccess: boolean;
  hospitalName: any;
  userStatus: string;
  leavingComponent: boolean = false;
  scrollPosition: number;
  filterValuesStatus: any;
  userRole: any;
  userId: any;
  adminAccess: string;

  constructor(
    location: PlatformLocation,
    public userModalPopup: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    protected dialog: MatDialog,
    private hospitalUserService: hospitalUserService,
    public toolbarService: ToolbarService,
    private organizatioUserService: hospitalUserService,
    private snackBarService: SnackbarService,
    private filterService: FilterSharedService,
    private filterstateServce: FiltersStateService,
    private titlecasePipe: TitleCasePipe,
    private renderer: Renderer2
  ) {
    this.leavingComponent = false;
    this.dataSource = new hospitalUserDataSource(this.hospitalUserService);
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    this.filterService.globalHospitalAdminsCall({});
    this.filterService.statusHospitalAdminsCall({ status: 'ALL' });

    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
    this.userId = authDetails?.userDetails?.id;

    this.validatehospitalAdminFilterForm();

    this.route.data.subscribe((res) => {
      this.route.queryParams.subscribe((params) => {
        res.id = params.org_id;
        this.organzationId = params.org_id;
        this.hospitalName = params.name;

        localStorage.setItem('orgId', this.organzationId);
        this.toolbarService.setToolbarLabel(params.name);
      });
    });

    this.userColumnHeaders = [
      'firstName',
      'gender',
      'emailId',
      'contactNumber',
      'designation',
      'status',
      'Action',
    ];
    // this.filterService.subModuleCall('Hospital Admin');

    this.dataSource.totalElemObservable.subscribe((data) => {
      // this.scrollPosition = 0;
      this.table?.nativeElement.scrollIntoView();
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
    // if (this.userRole === 'HOSPITAL_USER') {
    this.filterService.globalHospitalAdmins.subscribe((res) => {
      this.filterValues = res;
      if (Object.keys(res).length) {
        this.search();
      } else {
        this.search();
      }
    });
    this.filterService.statusHospitalAdmins.subscribe((res) => {
      if (res.status !== 'ALL') {
        this.filterValuesStatus = res;

        if (Object.keys(res).length) {
          this.paginator.pageIndex = 0;
          this.search();
        }
      } else {
        this.filterValuesStatus = '';
        this.search();
      }
    });
    this.adminAccess = localStorage.getItem('adminAccess');
    if (this.adminAccess == 'false') {
      this.userColumnHeaders.pop();
    }
    // }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.leavingComponent = true;
    this.toolbarService.setToolbarLabel('');
  }
  scrollToTop() {
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }

  // -----Renders data for paginator and sort
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    this.leavingComponent = false;
    // this.sort?.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    // merge(this.sort?.sortChange, this.paginator?.page);
    //   .pipe(tap(() => this.loadhospitalUserPage()));
    //   .subscribe();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.scrollToTop();
          this.loadhospitalUserPage();
        })
      )
      .subscribe();
  }

  public loadhospitalUserPage(): void {
    this.organzationId = this.organzationId
      ? this.organzationId
      : localStorage.getItem('orgId');

    let params;
    if (this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',
        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (!this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (this.filterValues?.searchQuery && !this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });
    this.dataSource.loadhospitalUser(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 10,
      this.sort.active,
      'desc',
      this.organzationId,
      searchData
    );
  }

  userFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    // this.dataSource.filter = filterValue;
  }

  createUser(): void {
    const createUserModalConfig = new MatDialogConfig();
    createUserModalConfig.disableClose = true;
    (createUserModalConfig.maxWidth = '100vw'),
      (createUserModalConfig.maxHeight = '110vh'),
      (createUserModalConfig.width = '65%'),
      (createUserModalConfig.panelClass = 'icon-inside'),
      (createUserModalConfig.data = { add: 'add', value: null });
    this.userModalPopup
      .open(HospitalAddEditUserComponent, createUserModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.filterService.statusHospitalAdmins.next({ status: 'ALL' });
          this.search();
          // this.hospitalList.reset();
        }
      });
  }

  public editUserRecord(recordId): void {
    const editUserModalConfig = new MatDialogConfig();
    editUserModalConfig.disableClose = true;
    (editUserModalConfig.maxWidth = '120vw'),
      (editUserModalConfig.maxHeight = '120vh'),
      (editUserModalConfig.width = '65%'),
      (editUserModalConfig.data = {
        paginator: this.paginator,
        add: 'edit',
        value: recordId,
      });
    this.userModalPopup
      .open(HospitalAddEditUserComponent, editUserModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.filterService.statusHospitalAdmins.next({ status: 'ALL' });
          this.search();
          // this.hospitalList.reset();
        }
      });
  }

  gethospitalUserList(): void {
    this.dataSource = new hospitalUserDataSource(this.hospitalUserService);
    let params;
    if (this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',
        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (!this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (this.filterValues?.searchQuery && !this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });
    this.dataSource.loadhospitalUser(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      'desc',
      this.organzationId,
      searchData
    );
  }

  viewhospital(): void {
    this.router.navigate(['home/hospitals']);
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
  gethospitalName(org): any {
    return org ? org.name : 'N/A';
  }

  private validatehospitalAdminFilterForm(): void {
    this.hospitalAdminList = this.fb.group({
      statusFilter: ['ACTIVE'],
    });
  }

  updateStatus(ele) {
    // if (ele.userStatus == 'ACTIVE') {
    //   this.userStatus = 'INACTIVE';
    // } else {
    //   this.userStatus = 'ACTIVE';
    // }

    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are changing the status for "${this.titlecasePipe.transform(
          ele.firstName
        )} ${this.titlecasePipe.transform(ele.lastName)}" to "${
          ele.userStatus === 'ACTIVE' ? 'Inactive' : 'Active'
        }". Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.organizatioUserService
            .updatehospitalUserStatus(
              ele.id,
              ele.userStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            )
            .subscribe(
              () => {
                this.snackBarService.success('updated  successfully!', 2000);
                this.route.data.subscribe((res) => {
                  this.route.queryParams.subscribe((params) => {
                    res.id = params.org_id;
                    this.organzationId = res.id;
                    this.hospitalName = res.name;
                    localStorage.setItem('orgId', this.organzationId);
                    this.dataSource.loadhospitalUser(
                      0,
                      10,
                      'createdAt',
                      'desc',
                      this.organzationId,
                      ''
                    );
                    // this.toolbarService.setToolbarLabel(params.name);
                    this.hospitalName = params.name;
                    this.toolbarService.setToolbarLabel(params.name);
                  });
                });
                // this.navigationBar?.resetStatusFilter();
              },
              (error) => {
                this.snackBarService.error('Failed!');
              }
            );
        } else {
        }
      });
  }
  search(): void {
    if (this.leavingComponent) {
      return;
    }
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    const formValue = this.filterValues;

    let params;
    if (this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
          : '',
        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (!this.filterValues?.searchQuery && this.filterValuesStatus?.status) {
      params = {
        status: this.filterValuesStatus?.status
          ? this.filterValuesStatus.status
          : '',
      };
    }
    if (this.filterValues?.searchQuery && !this.filterValuesStatus?.status) {
      params = {
        searchQuery: this.filterValues?.searchQuery
          ? this.filterValues.searchQuery
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
    const searchData = new HttpParams({ fromObject: params });
    this.filterstateServce.setFiltersArrayValues(formValue);
    this.dataSource.loadhospitalUser(
      0,
      this.paginator ? this.paginator.pageSize : 10,
      this.sort.active,
      'desc',
      this.organzationId,
      searchData
    );
  }
}
