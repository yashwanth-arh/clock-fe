import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, startWith, tap } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { FiltersStateService } from '../core/services/filters-state.service';
import { SnackbarService } from '../core/services/snackbar.service';
import { DoctorService } from '../doctor-management/service/doctor.service';
import { CaregiverService } from './caregiver.service';
import { CaregiverDataSource } from './entities/caregiver-data-source';
import { CaregiverDialogComponent } from './caregiver-dialog/caregiver-dialog.component';

@Component({
  selector: 'app-caregiver',
  templateUrl: './caregiver.component.html',
  styleUrls: ['./caregiver.component.scss'],
})
export class CaregiverComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table', { read: ElementRef }) table: ElementRef;

  displayedColumns: string[] = [
    'name',
    'branchName',
    'email',
    'contactNo',
    'state',
    'city',
    'status',
    'action',
  ];
  statusChangeTriggered=false;
  isEnableClinic: boolean;
  isEnablePracticeSearch: boolean;
  isEnableStateSearch: boolean;
  isEnableClinicSearch: boolean;
  public dataSource: CaregiverDataSource;
  searchquery = new FormControl();
  hospitalName = new FormControl();
  cityName = new FormControl();
  stateName = new FormControl();
  isEnableGlobalSearch: boolean;
  filteredHospital: Observable<any>;
  filteredCity: Observable<any>;
  filteredState: Observable<any>;
  pageSizeOptions = [10, 25, 100];
  clinicList = [];
  practiceList = [];
  caregiverlist: FormGroup;
  practiceFilter = new FormControl();
  clinicFilter = new FormControl();
  statusFilter = new FormControl();
  stateFilter = new FormControl();
  city_filter = new FormControl();
  doctorDataList: any;
  userRole: string;
  length = 0;
  pageIndex = 0;
  state: string[] = [];
  city: string[] = [];
  CityFilteredOptions: Observable<any>;
  messageSuccess: boolean;
  status: string[] = ['ACTIVE', 'INACTIVE'];
  public searchFilterValues;
  showValidTextMessage = false;

  constructor(
    private router: Router,
    private caregiverModal: MatDialog,
    private doctorService: DoctorService,
    private caregiverService: CaregiverService,
    private fb: FormBuilder,
    private filterstateServce: FiltersStateService,
    private authService: AuthService,
    private snackBarService: SnackbarService
  ) {
    this.dataSource = new CaregiverDataSource(
      this.caregiverService,
      this.snackBarService
    );
    this.filterstateServce.getFiltersArrayValues().subscribe((res: any) => {
      this.searchFilterValues = res;
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.authService.user.subscribe((user: User) => {
      if (user && user.userDetails?.permissions) {
        this.userRole = user.userDetails?.userRole;
        // if (user.userDetails.permissions.some(permission => permission === this.changeTitle)) {
        //   this.navigationRoutes[4].title = 'Patient Health Records';
        // } else {
        //   this.navigationRoutes[4].title = 'Enrollments';
        // }
      }
    });
    this.validateCaregiverFilterForm();
    this.dataSource.loadCaregivers(0, 10, 'creationDate', 'desc', '', '', '');

    // this.locationService.getJSONData().subscribe((res: any[]) => {
    // 	this.state = Object.keys(res);
    // });

    // this.CityFilteredOptions = this.caregiverlist.get('cityFilter').valueChanges.pipe(
    // 	startWith(''),
    // 	map((value) => this._filterCitySearch(value))
    // );

    this.doctorService.getPracticeList().subscribe(
      (data: any) => {
        this.practiceList = data.hospitalList.filter(
          (element) => element.name != null
        );
        this.practiceList.sort((a, b) => (a.name > b.name ? 1 : -1));
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );
  }

  // -----Renders data for paginator and sort
  ngAfterViewInit(): void {
    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data !== null && (data === 0 || data == undefined)) {
        // setTimeout(()=>{
        this.messageSuccess = false;
        // },2000)
      }
    });
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.table.nativeElement.scrollIntoView();

          this.dataSource.loadCaregivers(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            'creationDate',
            'desc',
            this.caregiverlist.get('practiceFilter').value ? this.caregiverlist.get('practiceFilter').value :'',
            this.caregiverlist.get('clinicFilter').value ? this.caregiverlist.get('clinicFilter').value :'',
            this.searchquery.value ? this.searchquery.value :''
          );
        })
      )
      .subscribe();
  }

  protected updateTable(): void {
    this.dataSource = new CaregiverDataSource(
      this.caregiverService,
      this.snackBarService
    );
    this.dataSource.loadCaregivers(0, 10, 'creationDate', 'desc', '', '', '');
  }
  getCaregiverList(): void {
    this.dataSource = new CaregiverDataSource(
      this.caregiverService,
      this.snackBarService
    );
    this.dataSource.loadCaregivers(0, 10, 'creationDate', 'desc', '', '', '');
    this.filterstateServce.setFiltersArrayValues(null);
  }

  private validateCaregiverFilterForm(): any {
    this.caregiverlist = this.fb.group({
      practiceFilter: [''],
      clinicFilter: [''],
      stateFilter: [''],
      cityFilter: [''],
      statusFilter: [''],
    });
  }
  statusChange(email, val) {
    this.statusChangeTriggered=true;
    this.caregiverService.changeStatus(email, val).subscribe(
      (res) => {
        this.snackBarService.success('Status updated successfully');
        this.onSearch();
      },
      (err) => {
        // this..error(err.error.messsage);
      }
    );
  }
  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    // this.getBranchList(event.pageIndex, event.pageSize, this.sort.active, this.sort.direction);
  }

  onSearch(): void {
    this.paginator.pageIndex = 0;
    const orgId = this.caregiverlist.get('practiceFilter').value;
    const branchId = this.caregiverlist.get('clinicFilter').value;
    const regExp = /[a-zA-Z]/g;
    const testString = this.searchquery.value;
    if (
      !this.isEnableGlobalSearch &&
      !this.isEnableClinicSearch &&
      !this.isEnablePracticeSearch &&
      !this.searchquery.value &&
      !orgId &&
      !branchId && 
      !this.statusChangeTriggered
    ) {
      // this.updateTable();
      return;
    }
    if (this.searchquery.value && !regExp.test(testString)) {
      this.showValidTextMessage = true;
      return;
    }
    if (!this.searchquery.value) {
      this.isEnableGlobalSearch = false;
    }
    if (!branchId) {
      this.isEnableClinic = false;
    }
    if (!orgId) {
      this.isEnablePracticeSearch = false;
    }
    this.dataSource.loadCaregivers(
      0,
      this.paginator.pageSize,
      'creationDate',
      'desc',
      orgId !== '' ? orgId : '',
      branchId !== '' ? branchId : '',
      this.searchquery.value !== '' ? this.searchquery.value : ''
    );
  }

  noData() {
    return 'No Records Found!';
  }
  public goToUserPage(branch): void {
    const filter = 'id:' + branch.name;
    localStorage.setItem('branch_name', branch.name);
    localStorage.setItem('branch_id', branch.id);
    this.router.navigate(['/clinics/users'], {
      skipLocationChange: true,
    });
    history.pushState(filter, '', '/clinics/users');
  }
  onPracticeSelection(event): any {
    this.clinicList = [];
    // this.doctorService.getClinicList(event).subscribe((data: any) => {
    //   this.clinicList = data.branchList.filter(
    //     (element) => element.name != null
    //   );
    //   this.clinicList.sort((a, b) => (a.name > b.name ? 1 : -1));
    //   this.isEnablePracticeSearch = true;
    // });
  }

  onStateSelection(event: any): any {
    this.stateFilter = event;
  }

  unselectGlobalSearch(): void {
    this.showValidTextMessage = false;
    this.searchquery.reset();
    this.onSearch();
    // this.isEnableGlobalSearch = false;
    this.defaultCaregiverData();
  }
  defaultCaregiverData() {
    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0 || data == undefined) {
        this.messageSuccess = false;
      }
    });
  }
  isEnableGlobalSearchFunc(): any {
    if (this.searchquery.value && this.searchquery.value.length > 2) {
      this.onSearch();
      this.isEnableGlobalSearch = true;
    } else if (!this.searchquery.value.length) {
      this.messageSuccess=true;
      this.getCaregiverList();
      this.isEnableGlobalSearch = false;
      this.showValidTextMessage = false;
      this.dataSource.totalElemObservable.subscribe((data) => {
        if (data > 0) {
          this.messageSuccess = true;
        } else if (data === 0 || data == undefined) {
          this.messageSuccess = false;
        }
      });
    }
  }
  unselectPracticeSearch() {
    this.caregiverlist.get('practiceFilter').reset();
    this.caregiverlist.get('clinicFilter').reset();
    this.onSearch();
    this.clinicList = [];
    // this.isEnablePracticeSearch = false;
    // this.isEnableClinic = false;
    this.defaultCaregiverData();
  }
  isEnablePracticeSearchFunc(): any {
    this.isEnablePracticeSearch = true;
  }

  unselectClinicSearch() {
    this.caregiverlist.get('branchFilter').reset();
    this.onSearch();
    // this.isEnableClinicSearch = false;
    this.defaultCaregiverData();
  }

  openCaregiver(ele) {
    const createModalDeviceConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside it's body
    createModalDeviceConfig.disableClose = true;
    (createModalDeviceConfig.maxWidth = '100vw'), // Modal maximum width
      (createModalDeviceConfig.maxHeight = '100vh'), // Modal maximum height
      //  createModalDeviceConfig.height = '78vh'; // Modal height
      (createModalDeviceConfig.width = '999px'); // Modal width
    createModalDeviceConfig.data = { data: ele };
    this.caregiverModal
      .open(CaregiverDialogComponent, createModalDeviceConfig)
      .afterClosed()
      .subscribe((e) => {
        this.searchquery?.setValue('');
        this.caregiverlist.get('practiceFilter').setValue('');
        this.caregiverlist.get('clinicFilter').setValue('');
        this.isEnableGlobalSearch = false;
        this.isEnableClinic = false;
        this.isEnablePracticeSearch = false;
        this.getCaregiverList();
      });
  }
  // Clinic
  unselectClinic(): void {
    this.caregiverlist.get('clinicFilter').reset();
    // if(this.caregiverlist.get('practiceFilter').value){
    //   this.doctorService.getClinicList(this.caregiverlist.get('practiceFilter').value).subscribe((data: any) => {
    //     this.clinicList = data.branchList.filter(
    //       (element) => element.name != null
    //     );
    //     this.clinicList.sort((a, b) => (a.name > b.name ? 1 : -1));
    //     this.isEnablePracticeSearch = true;
    //   });
    // }
    this.getCaregiverList();
    this.clinicList = [];
    this.isEnableClinic = false;
    this.defaultCaregiverData();
  }

  isEnableClinicFunc(): any {
    this.isEnableClinic = true;
  }
}
