import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  Input,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BranchUserService } from '../branch-user.service';
import { BranchAddEditUserComponent } from '../branch-add-edit-user/branch-add-edit-user.component';
import { ToolbarService } from '../../../core/services/toolbar.service';
import { FiltersStateService } from 'src/app/core/services/filters-state.service';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { HttpParams } from '@angular/common/http';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-branch-user-list',
  templateUrl: './branch-user-list.component.html',
  styleUrls: ['./branch-user-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BranchUserListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  screenName: any;
  hospitalName: string | undefined;
  userColumnHeaders: string[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  @ViewChild('navigationBar') navBar: NavigationBarComponent;
  @Input() hideNav: boolean;
  hospitalUsersList: FormGroup;
  hospitalUserStatus = new FormControl();
  leavingComponent: boolean = false;
  status: string[] = ['ACTIVE', 'INACTIVE'];
  StatusFilteredOptions: Observable<string[]> | undefined;
  pageSizeOptions = [10, 25, 100];
  length = -1;
  pageIndex = 0;
  filterValues: any;
  filterValuesStatus: any;
  userStatus: string;
  userId: any;
  userRole: any;
  adminAccess: string;
  constructor(
    public userModalPopup: MatDialog,
    private router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private branchuserservice: BranchUserService,
    private toolbarService: ToolbarService,
    private filterstateServce: FiltersStateService,
    private filterService: FilterSharedService,
    private snackBarService: SnackbarService,
    private titlecasePipe: TitleCasePipe,
    private renderer: Renderer2
  ) {
    this.leavingComponent = false;
    // this.getBranchUserList();
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;
    this.userId = authDetails?.userDetails?.id;
  }

  ngOnInit(): void {
    this.filterService.globalFacilityAdminsCall({});
    this.filterService.statusFacilityAdminsCall({ status: 'ALL' });
    this.leavingComponent = false;
    this.validateHospitalUserFilterForm();
    this.route.queryParams.subscribe((params) => {
      this.hospitalName = params.name;
      this.toolbarService.setToolbarLabel(params.name);
    });

    this.StatusFilteredOptions = this.hospitalUserStatus.valueChanges.pipe(
      startWith(''),
      map((statusValue) => this.filterStatusSearch(statusValue))
    );

    this.userColumnHeaders = [
      'firstName',
      'gender',
      'emailId',
      'contactNumber',
      'designation',
      'status',
      'action',
    ];
    // this.filterService.subModuleCall('Facility Admin');
    this.filterService.globalFacilityAdmins.subscribe((res) => {
      this.filterValues = res;
      if (Object.keys(res).length) {
        this.paginator.pageIndex = 0;
        this.getBranchUserList();
      } else {
        this.getBranchUserList();
      }
    });
    this.filterService.statusFacilityAdmins.subscribe((res) => {
      if (res.status !== 'ALL') {
        this.filterValuesStatus = res;
        if (Object.keys(res).length) {
          this.paginator.pageIndex = 0;
          this.getBranchUserList();
        }
      } else {
        this.filterValuesStatus = '';
        this.getBranchUserList();
      }
    });
    this.adminAccess = localStorage.getItem('adminAccess');
    if (this.adminAccess == 'false') {
      this.userColumnHeaders.pop();
    }
  }

  ngAfterViewInit() {
    // this.sort?.sortChange.subscribe((val) => {
    //   this.getBranchUserList(0, 10, val.active, val.direction);
    // });
  }

  ngOnDestroy(): void {
    this.leavingComponent = true;
    this.toolbarService.setToolbarLabel('');
  }

  public filterStatusSearch(valueState: string): string[] {
    const filterStatusValue = valueState.toLowerCase();
    return this.status.filter((option) =>
      option.toLowerCase().includes(filterStatusValue)
    );
  }

  private validateHospitalUserFilterForm() {
    this.hospitalUsersList = this.fb.group({
      hospitalUserStatus: ['ACTIVE', Validators.required],
    });
  }

  userFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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
  createUser(): void {
    const createUserModalConfig = new MatDialogConfig();
    createUserModalConfig.disableClose = true;
    (createUserModalConfig.maxWidth = '100vw'),
      (createUserModalConfig.maxHeight = '120vh'),
      (createUserModalConfig.width = '65%'),
      (createUserModalConfig.panelClass = 'icon-inside'),
      (createUserModalConfig.data = { add: 'add', value: null });
    this.userModalPopup
      .open(BranchAddEditUserComponent, createUserModalConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.filterService.statusFacilityAdmins.next({ status: 'ALL' });
          this.paginator.pageIndex = 0;
          this.getBranchUserList();
        }
      });
  }

  public editUserRecord(recordId) {
    const editUserModalConfig = new MatDialogConfig();
    editUserModalConfig.disableClose = true;
    (editUserModalConfig.maxWidth = '100vw'),
      (editUserModalConfig.maxHeight = '120vh'),
      (editUserModalConfig.width = '65%'),
      (editUserModalConfig.data = {
        paginator: this.paginator,
        add: 'edit',
        value: recordId,
      });
    this.userModalPopup
      .open(BranchAddEditUserComponent, editUserModalConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.filterService.statusFacilityAdmins.next({ status: 'ALL' });
          this.paginator.pageIndex = 0;
          this.getBranchUserList();
        }
      });
  }
  scrollToTop() {
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }

  handlePageEvent(event: PageEvent) {
    this.scrollToTop();
    this.length = event.length;
    this.getBranchUserList(
      event.pageIndex,
      event.pageSize,
      this.sort.active,
      this.sort.direction
    );
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

  getBranchUserList(
    pageNumber = 0,
    pageSize = 10,
    pageSort = 'lastUpdatedAt',
    direction = 'desc'
  ) {
    if (this.leavingComponent) {
      return;
    }
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

    const branchid = localStorage.getItem('branch_id');

    this.branchuserservice
      .getAllBranchUser(
        this.paginator?.pageIndex ? this.paginator.pageIndex : 0,
        this.paginator?.pageSize ? this.paginator.pageSize : 10,
        branchid,
        pageSort,
        'desc',
        searchData
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
        this.length = data.totalElements;
      });
  }

  viewBranch(): void {
    this.router.navigate(['home/facilities']);
    this.filterService.globalFacilitiesCall('');
    this.filterService.statusFacilitiesCall('');
  }
  search(): void {
    // this.paginator.pageIndex = 0;

    const formValue = this.filterValues;
    const formValueStatus = this.filterValuesStatus;
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
    this.getBranchUserList(
      0,
      this.paginator?.pageSize ? this.paginator?.pageSize : 10,
      this.sort.active,
      this.sort.direction
    );
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
        }" .Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.userModalPopup
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.branchuserservice
            .updateFacilityUserStatus(
              ele.id,
              ele.userStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            )
            .subscribe(
              () => {
                this.snackBarService.success('updated  successfully!', 2000);
                this.getBranchUserList();
              },
              (error) => {
                this.snackBarService.error('Failed!');
              }
            );
        } else {
        }
      });
  }
}
