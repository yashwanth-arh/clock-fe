import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { SpecialityService } from '../services/speciality.service';
import { DoctorIdentityService } from '../services/doctorIdentity.service';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { DoctorIdentityAddEditComponent } from './doctor-identity-add-edit/doctor-identity-add-edit.component';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-doctor-identity',
  templateUrl: './doctor-identity.component.html',
  styleUrls: ['./doctor-identity.component.scss'],
})
export class DoctorIdentityComponent implements OnInit {
  searchQuery: any;
  changedStatus: any;
  userRole: any;
  totalcount(totalcount: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;


  displayedColumns: string[] = ['name', 'Status', 'action'];
  dataSource: MatTableDataSource<any>;
  pageSizeOptions = [10, 25, 100];
  length = -1;
  pageIndex = 0;
  public doctoridentityfilter: FormGroup;
  isEnableGlobalSearch: boolean;
  showValidTextMessage = false;

  constructor(
    public router: Router,
    public entityModalPopup: MatDialog,
    private doctorIdentityService: DoctorIdentityService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private filterService: FilterSharedService,
    public authService: AuthService,
    private renderer: Renderer2,
  ) {
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;
    this.getDoctorIdentityList();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.doctoridentityfilter = this.fb.group({
      searchQuery: ['', Validators.nullValidator],
    });

    this.filterService.configureSearch.subscribe((res) => {
      this.searchQuery = res;
      this.isEnableGlobalSearchFunc();
    });
  }
  scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((val) => {
      this.scrollToTop();
      this.getDoctorIdentityList();
    });
  }

  addDoctorIdentity(): void {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '339px'),
      (createEntityModalConfig.data = { add: 'add', value: null });
    this.entityModalPopup
      .open(DoctorIdentityAddEditComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        this.getDoctorIdentityList();
      });
  }

  editDoctorIdentity(entity): void {
    const editEntityModalConfig = new MatDialogConfig();
    localStorage.setItem('doctorIdentity_id', entity.id);
    editEntityModalConfig.disableClose = true;
    (editEntityModalConfig.maxWidth = '100vw'),
      (editEntityModalConfig.maxHeight = '120vh'),
      (editEntityModalConfig.width = '339px'),
      (editEntityModalConfig.data = { add: 'edit', value: entity });
    this.entityModalPopup
      .open(DoctorIdentityAddEditComponent, editEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        this.getDoctorIdentityList();
      });
  }
  actionToggleChange(tableRow) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are changing the status of Doctor Identity "${
          tableRow.identityType
        }" to "${
          tableRow.configurationStatus === 'ACTIVE' ? 'Inactive' : 'Active'
        }". Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.entityModalPopup
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.changedStatus = res;
          this.doctorIdentityService
            .changeDoctorIdentityStatus(
              tableRow.id,
              tableRow.configurationStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            )
            .subscribe((res) => {
              this.getDoctorIdentityList();
              this.snackBarService.success('Status Updated');
              // this.myInputVariable.nativeElement.value = '';
            });
        } else {
          this.getDoctorIdentityList();
        }
      });
  }

  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();

    this.length = event.length;

    this.getDoctorIdentityList(
      event.pageIndex,
      event.pageSize,
      this.sort.active,
      'desc'
    );
  }

  getDoctorIdentityList(
    pageNumber = 0,
    pageSize = 10,
    pageSort = 'createdAt',
    direction = 'desc'
  ): void {
    let params;
    if (this.searchQuery?.searchQuery) {
      params = {
        searchQuery: this.searchQuery?.searchQuery
          ? this.searchQuery.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });
    this.doctorIdentityService
      .getAllDoctorIdentity(
        pageNumber,
        pageSize,
        pageSort,
        direction,
        searchData
      )
      .subscribe(
        (data) => {
          // if (data['err'] === 403) {
          //   this.snackBarService.error(data['message']);
          // }
          this.dataSource = new MatTableDataSource(data.content);
          this.length = data.totalElements;
          this.pageIndex = pageNumber;
        },
        (error) => {
          this.snackBarService.error(error.message);
        }
      );
  }
  onDoctorIdentityFilter(): void {
    // this.paginator.pageIndex = 0;
    if (
      !this.isEnableGlobalSearch &&
      !this.doctoridentityfilter.value.searchQuery
    ) {
      return;
    }
    const regExp = /[a-zA-Z]/g;
    const testString = this.doctoridentityfilter.value.searchQuery;
    // if (this.doctoridentityfilter.value.searchQuery ) {
    //   this.showValidTextMessage = true;
    //   return;
    // }
    let params;
    if (this.searchQuery?.searchQuery) {
      params = {
        searchQuery: this.searchQuery?.searchQuery
          ? this.searchQuery.searchQuery
          : '',
      };
    }
    const searchData = new HttpParams({ fromObject: params });
    this.doctorIdentityService
      .getAllDoctorIdentity(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        searchData
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.length = data.totalElements;
      });
  }
  // global Search
  unselectGlobalSearch(): void {
    this.paginator.pageIndex = 0;
    this.doctoridentityfilter.get('searchQuery').reset();
    this.onDoctorIdentityFilter();
    this.isEnableGlobalSearch = false;
  }

  isEnableGlobalSearchFunc(): any {
    if (this.searchQuery != null) {
      if (this.searchQuery.length > 2) {
        this.onDoctorIdentityFilter();
        this.isEnableGlobalSearch = true;
      } else if (!this.searchQuery.length) {
        this.getDoctorIdentityList();
        this.isEnableGlobalSearch = false;
        this.showValidTextMessage = false;
      }
    }
  }
}
