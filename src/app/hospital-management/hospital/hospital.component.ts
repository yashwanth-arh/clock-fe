import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../../core/services/snackbar.service';
import { HttpParams } from '@angular/common/http';
import { FiltersStateService } from '../../core/services/filters-state.service';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AllFiltersComponent } from 'src/app/core/components/all-filters/all-filters.component';
import { HospitalAddEditComponent } from './hospital-add-edit/hospital-add-edit.component';
import { NavigationBarComponent } from 'src/app/core/components/navigation-bar/navigation-bar.component';
import { MatTable } from '@angular/material/table';
import { hospitalDataSource } from '../service/hospital-data-source';
import { HospitalManagementService } from '../service/hospital-management.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss'],
})
export class HospitalComponent implements OnInit, AfterViewInit, OnDestroy {
  hospitalHeaders: string[] = [
    'name',
    // 'noOfAdmins',
    // 'noOfBranches',
    'emailId',
    'contactNumber',
    // 'address.addressLine',
    // 'address.state',
    'city',
    'practiceNPI',
    'status',
    'Action',
  ];

  hospitalList: FormGroup;
  hospitalName = new FormControl();
  status: string[] = ['ACTIVE', 'INACTIVE'];
  searchData: any;
  public searchFilterValues;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  @ViewChild('navigationBar') navigationBar: NavigationBarComponent;

  public dataSource: hospitalDataSource;
  isEnableGlobalSearch: boolean;
  isEnableStatus: boolean;
  messageSuccess: boolean;
  uscountries: any;
  showValidTextMessage = false;
  userRole: any;
  filterValuesStatus: any;
  filterValues: any;
  componentName: string = 'hospital';
  leavingComponent: boolean = false;
  constructor(
    public hospitalModalPopup: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    public hospitalService: HospitalManagementService,
    private snackBarService: SnackbarService,
    private filterstateServce: FiltersStateService,
    private filterService: FilterSharedService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {
    this.leavingComponent = false;
    // Function to get all hospital list
    this.dataSource = new hospitalDataSource(
      this.hospitalService,
      this.snackBarService,
      this.authService
    );

    this.filterstateServce.getFiltersArrayValues().subscribe((res: any) => {
      this.searchFilterValues = res;
    });
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    this.filterService.globalHospitalCall({});
    this.filterService.statusHospitalCall({ status: 'ALL' });
    this.userRole = this.authService?.authData?.userDetails['userRole'];
    this.filterService.globalHospital.subscribe((res) => {
      this.filterValues = res;
      if (Object.keys(res).length) {
        this.search();
      } else {
        this.loadhospitalPage();
      }
      // if (Object.keys(res).length) {
      //   this.search(res.searchQuery);
      // } else {
      //   this.searchFilterValues = '';
      //   this.loadhospitalPage();
      // }
    });
    this.filterService.statusHospital.subscribe((res) => {
      if (res.status !== 'ALL') {
        this.filterValuesStatus = res;
        if (Object.keys(res).length) {
          this.search();
        }
      } else {
        this.filterValuesStatus = '';
        this.loadhospitalPage();
      }
    });
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    // this.loadhospitalPage();
    this.validatehospitalFilterForm();

    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
  }

  scrollToTop() {
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }
  // -----Renders data for paginator and sort
  ngAfterViewInit(): void {
    this.leavingComponent = false;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.scrollToTop();

          this.loadhospitalPage();
        })
      )
      .subscribe();
  }
  public loadhospitalPage(): void {
    if (this.leavingComponent) {
      return;
    }
    if (this.searchFilterValues?.length === 0) {
      this.dataSource.loadhospital(
        this.paginator ? this.paginator?.pageIndex : 0,
        this.paginator ? this.paginator?.pageSize : 10,
        'createdAt',
        'desc'
      );
    } else {
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
      // eslint-disable-next-line max-len
      this.dataSource.loadhospitalSearch(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 10,
        'createdAt',
        'desc',
        searchData
      );
    }
  }

  private _filterStatusSearch(valueStatus: string): string[] {
    const filterStatusValue = valueStatus.toLowerCase();
    return this.status.filter((option) =>
      option.toLowerCase().includes(filterStatusValue)
    );
  }

  private validatehospitalFilterForm(): void {
    this.hospitalList = this.fb.group({
      searchQuery: [],
      status: [],
    });
  }

  // ------Function to filter hospital data in table list-----------
  hospitalFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
  }

  // ------Function to add hospital data-----------
  public createhospital(): void {
    const createhospitalModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    createhospitalModalConfig.disableClose = true;
    (createhospitalModalConfig.maxWidth = '100vw'),
      (createhospitalModalConfig.maxHeight = '110vh'),
      // createhospitalModalConfig.height = "78vh",
      // (createhospitalModalConfig.width = '750px'),(previous one code)
      (createhospitalModalConfig.width = '65%'),
      (createhospitalModalConfig.data = { mode: 'ADD' });

    this.hospitalModalPopup
      .open(HospitalAddEditComponent, createhospitalModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          // this.gethospitalList();
          this.hospitalList.reset();
          this.navigationBar?.resetStatusFilter();
        }
      });
  }

  // ------Function to edit hospital data-----------
  public edithospitalRecord(editData: any): void {
    const edithospitalModalConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    edithospitalModalConfig.disableClose = true;
    (edithospitalModalConfig.maxWidth = '100%'),
      (edithospitalModalConfig.maxHeight = '100%'),
      // edithospitalModalConfig.height = "78vh",
      // (edithospitalModalConfig.width = '80%'),(previous one code)
      (edithospitalModalConfig.width = '65%'),
      (edithospitalModalConfig.data = {
        edit: editData,
        mode: 'EDIT',
      }),
      this.hospitalModalPopup
        .open(HospitalAddEditComponent, edithospitalModalConfig)
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            // this.gethospitalList();
            this.hospitalList.reset();
            this.navigationBar?.resetStatusFilter();
          }
        });
  }

  gethospitalList(): void {
    if (this.leavingComponent) {
      return;
    }
    this.dataSource = new hospitalDataSource(
      this.hospitalService,
      this.snackBarService,
      this.authService
    );
    this.dataSource.loadhospital(0);
    this.filterstateServce.setFiltersArrayValues(null);
  }

  // -----Function to go to user page as per selected hospital---------
  public goToUserPage(hospital): void {
    const filter = 'id:' + hospital.name;
    this.router.navigate(['home/hospitals/users'], {
      queryParams: { name: hospital.name, org_id: hospital.id },
      skipLocationChange: false,
    });

    // history.pushState(filter, '', 'home/practice/users');
  }
  // -----Function to go to user page as per selected hospital---------
  public goToDevicesPage(hospital): void {
    // const filter = 'id:' + hospital.name;
    this.router.navigate(['home/hospitals/devices'], {
      queryParams: { name: hospital.name, org_id: hospital.id },
      skipLocationChange: false,
    });
    // history.pushState(filter, '', 'home/practice/users');
  }

  goToBranch(hospital): void {
    const filter = 'id:' + hospital.id;
    this.router.navigate(['home/facilities'], {
      queryParams: { name: hospital.name, org_id: hospital.id },
      skipLocationChange: false,
    });
    history.pushState(filter, '', 'home/facilities');
  }

  search(): void {
    // if(this.leavingComponent ){
    //   return;
    // }
    if (this.paginator) this.paginator.pageIndex = 0;
    const regExp = /[a-zA-Z]/g;
    // const testString = value?.searchQuery;
    // if (value.searchQuery && !regExp.test(testString)) {
    //   // debugger
    //   this.showValidTextMessage = true;
    //   return;
    // }
    const formValue = this.filterValues;
    const formValueStatus = this.filterValuesStatus;
    // const params = {
    //   searchQuery: this.filterValues.searchQuery
    //     ? this.filterValues.searchQuery
    //     : '',
    //   status: this.filterValuesStatus.status
    //     ? this.filterValuesStatus.status
    //     : '',
    // };
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
        status: this.filterValuesStatus.status
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
    // Setting values to filter state service
    const searchData = new HttpParams({ fromObject: params });

    this.filterstateServce.setFiltersArrayValues(formValue);
    // const searchData = formValue;
    // eslint-disable-next-line max-len
    this.dataSource.loadhospitalSearch(
      0,
      this.paginator ? this.paginator.pageSize : 10,
      'createdAt',
      'desc',
      searchData
    );
  }
  searchStatus(value): void {
    if (this.paginator) this.paginator.pageIndex = 0;
    const regExp = /[a-zA-Z]/g;
    const testString = value?.searchQuery;
    if (value.searchQuery && !regExp.test(testString)) {
      // debugger
      this.showValidTextMessage = true;
      return;
    }
    const formValue = value;
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
    // Setting values to filter state service
    this.filterstateServce.setFiltersArrayValues(formValue);
    const searchData = formValue;
    // eslint-disable-next-line max-len

    this.dataSource.loadhospitalSearch(
      0,
      this.paginator ? this.paginator.pageSize : 10,
      'createdAt',
      'desc',
      searchData
    );
  }
}
