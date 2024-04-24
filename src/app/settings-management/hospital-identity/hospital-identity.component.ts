import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HospitalIdentityService } from '../services/hospitalIdentity.service';
import { HospitalIdentityAddEditComponent } from './hospital-identity-add-edit/hospital-identity-add-edit.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-hospital-identity',
  templateUrl: './hospital-identity.component.html',
  styleUrls: ['./hospital-identity.component.scss'],
})
export class HospitalIdentityComponent implements OnInit {
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
  public hospitalidentityfilter: FormGroup;
  isEnableGlobalSearch: boolean;
  showValidTextMessage = false;

  constructor(
    public router: Router,
    public entityModalPopup: MatDialog,
    private hospitalIdentityService: HospitalIdentityService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private filterService: FilterSharedService,
    public authService: AuthService,
    private renderer: Renderer2,
  ) {
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;
  }

  ngOnInit(): void {
    this.getHospitalIdentityList();
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.hospitalidentityfilter = this.fb.group({
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
      this.getHospitalIdentityList();
    });
  }

  addHospitalIdentity(): void {
    const createEntityModalConfig = new MatDialogConfig();
    createEntityModalConfig.disableClose = true;
    (createEntityModalConfig.maxWidth = '100vw'),
      (createEntityModalConfig.maxHeight = '120vh'),
      (createEntityModalConfig.width = '339px'),
      (createEntityModalConfig.data = { add: 'add', value: null });
    this.entityModalPopup
      .open(HospitalIdentityAddEditComponent, createEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        this.getHospitalIdentityList();
      });
  }

  editHospitalIdentity(entity): void {
    const editEntityModalConfig = new MatDialogConfig();
    localStorage.setItem('doctorIdentity_id', entity.id);
    editEntityModalConfig.disableClose = true;
    (editEntityModalConfig.maxWidth = '100vw'),
      (editEntityModalConfig.maxHeight = '120vh'),
      (editEntityModalConfig.width = '339px'),
      (editEntityModalConfig.data = { add: 'edit', value: entity });
    this.entityModalPopup
      .open(HospitalIdentityAddEditComponent, editEntityModalConfig)
      .afterClosed()

      .subscribe((e) => {
        this.getHospitalIdentityList();
      });
  }
  actionToggleChange(tableRow) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are changing the status of Hospital Identity "${
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
          this.hospitalIdentityService
            .changeHospitalIdentityStatus(
              tableRow.id,
              tableRow.configurationStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            )
            .subscribe((res) => {
              this.getHospitalIdentityList();
              this.snackBarService.success('Status Updated');
              // this.myInputVariable.nativeElement.value = '';
            });
        } else {
          this.getHospitalIdentityList();
        }
      });
  }

  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();
    this.length = event.length;
    this.getHospitalIdentityList(
      event.pageIndex,
      event.pageSize,
      this.sort.active,
      'desc'
    );
  }

  getHospitalIdentityList(
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
    this.hospitalIdentityService
      .getAllHospitalIdentity(
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
  onHospitalIdentityFilter(): void {
    // this.paginator.pageIndex = 0;
    if (
      !this.isEnableGlobalSearch &&
      !this.hospitalidentityfilter.value.searchQuery
    ) {
      return;
    }
    const regExp = /[a-zA-Z]/g;
    const testString = this.hospitalidentityfilter.value.searchQuery;
    // if (this.doctoridentityfilter.value.searchQuery ) {
    //   this.showValidTextMessage = true;
    //   return;
    // }

    this.hospitalIdentityService
      .getAllHospitalIdentity(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.searchQuery !== '' ? this.searchQuery : null
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.length = data.totalElements;
      });
  }
  // global Search
  unselectGlobalSearch(): void {
    this.paginator.pageIndex = 0;
    this.hospitalidentityfilter.get('searchQuery').reset();
    this.onHospitalIdentityFilter();
    this.isEnableGlobalSearch = false;
  }

  isEnableGlobalSearchFunc(): any {
    if (this.searchQuery != null) {
      if (this.searchQuery.length > 2) {
        this.onHospitalIdentityFilter();
        this.isEnableGlobalSearch = true;
      } else if (!this.searchQuery.length) {
        this.getHospitalIdentityList();
        this.isEnableGlobalSearch = false;
        this.showValidTextMessage = false;
      }
    }
  }
}
