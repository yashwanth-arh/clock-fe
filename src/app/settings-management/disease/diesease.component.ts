import {

  AfterViewInit,

  ViewChild,

  Component,

  OnInit,

  ElementRef,

  ViewEncapsulation,

  OnDestroy,
  Renderer2,

} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';

import { tap } from 'rxjs/operators';

import { Disease } from '../entities/disease';

import { DiseaseDataSource } from '../services/disease-data-source';

import { DiseaseService } from '../services/disease.service';

import { AddDiseaseComponent } from './add-disease/add-disease.component';

import { EditDiseaseComponent } from './edit-disease/edit-disease.component';

import { merge } from 'rxjs';

import { SnackbarService } from 'src/app/core/services/snackbar.service';

import { Router } from '@angular/router';

import { FilterSharedService } from 'src/app/core/services/filter-shared.service';

import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';

import { HttpParams } from '@angular/common/http';

import { AuthService } from 'src/app/core/services/auth.service';
import { MatTable } from '@angular/material/table';

@Component({

  selector: 'app-diesease',

  templateUrl: './diesease.component.html',

  styleUrls: ['./diesease.component.scss'],

  encapsulation: ViewEncapsulation.None,

})

export class DieseaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;


  leavingComponent: boolean = false;

  searchQuery: any;

  changedStatus: any;

  userRole: any;

  searchErrorMessage(searchErrorMessage: any) {

    throw new Error('Method not implemented.');

  }

  deleteDisease(arg0: { id: number; name: string }) {

    throw new Error('Method not implemented.');

  }

  openDeleteDiseaseDialog(openDeleteDiseaseDialog: any) {

    throw new Error('Method not implemented.');

  }

  deleteConfirmed(arg0: { id: number; name: string }) {

    throw new Error('Method not implemented.');

  }

  addDisease(arg0: { name: string }) {

    throw new Error('Method not implemented.');

  }

  editDisease(arg0: { id: number; name: string }) {

    throw new Error('Method not implemented.');

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  searchValue: any;

  public dataSource: DiseaseDataSource;

  public diseasefilter: FormGroup;

  showValidTextMessage = false;

 

  displayedColumns: string[] = ['id', 'name', 'Status', 'Actions'];

  isEnableGlobalSearch: boolean;

  messageSuccess: boolean;

 

  constructor(

    private fb: FormBuilder,

    public diseaseService: DiseaseService,

    protected dialog: MatDialog,

    private snackbarService: SnackbarService,

    private router: Router,

    private filterService: FilterSharedService,

    public authService: AuthService,
    private renderer: Renderer2,

  ) {

    const user = this.authService.authData;

    this.userRole = user.userDetails?.userRole;

    this.dataSource = new DiseaseDataSource(

      this.diseaseService,

      this.snackbarService

    );

  }

  ngOnDestroy(): void {

    this.leavingComponent = true;

  }

 

  ngOnInit(): void {

    this.leavingComponent = false;

    const token = localStorage.getItem('auth');

    if (!this.router.routerState.snapshot.url.includes('login')) {

      if (!token) {

        this.router.navigate(['/login']);

      }

    }

    // this.dataSource.loadDisease(0, 0);

    this.diseasefilter = this.fb.group({

      searchQuery: ['', Validators.nullValidator],

    });

 

    this.dataSource.totalElemObservable.subscribe((data) => {

      if (data > 0) {

        this.messageSuccess = true;

      } else {

        this.messageSuccess = false;

      }

    });

 

    this.filterService.configureSearch.subscribe((res) => {

      if (Object.keys(res).length) {

        this.searchQuery = res;

        this.paginator.pageIndex = 0;

        this.isEnableGlobalSearchFunc();

      } else {

        this.searchQuery = '';

        this.isEnableGlobalSearchFunc();

      }

    });

  }

 

  ngAfterViewInit(): void {

    // this.paginator.page.pipe(tap(() => this.loadDiseaseList())).subscribe();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

 

    merge(this.sort.sortChange, this.paginator.page)

      .pipe(

        tap(() => {

          this.scrollToTop();

 

          this.loadDiseaseList();

        })

      )

 

      .subscribe();

  }
  scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }

 

  public loadDiseaseList(): void {

    if(this.leavingComponent)

    return;

    let params;

    if (this.searchQuery?.searchQuery) {

      params = {

        searchQuery: this.searchQuery?.searchQuery

          ? this.searchQuery.searchQuery

          : '',

      };

    }

 

    const searchData = new HttpParams({ fromObject: params });

    this.dataSource.loadDisease(

      this.paginator?.pageIndex ? this.paginator?.pageIndex : 0,

      this.paginator?.pageSize ? this.paginator?.pageSize : 10,

      // this.sort.active,

      // this.sort.direction,

      searchData

    );

  }

 

  public refreshTable(): void {

    this.dataSource = new DiseaseDataSource(

      this.diseaseService,

      this.snackbarService

    );

    this.loadDiseaseList();

  }

 

  public openAddDiseaseDialog(): void {

    const addDialogRef = this.dialog.open(AddDiseaseComponent, {

      disableClose: true,

      maxWidth: '100vw',

      maxHeight: '100vh',

      // width: '750px',

    });

 

    addDialogRef.afterClosed().subscribe(() => {

      this.refreshTable();

    });

  }

 

  public openEditDiseaseDialog(diseaseData: Disease): void {

    const editDialogRef = this.dialog.open(EditDiseaseComponent, {

      disableClose: true,

      maxWidth: '100vw',

      maxHeight: '100vh',

      // width: '750px',

      data: {

        disease: diseaseData,

      },

    });

 

    editDialogRef.afterClosed().subscribe(() => {

      this.refreshTable();

    });

  }

  onDiseaseFilter(): void {

    // this.paginator.pageIndex

    if (!this.isEnableGlobalSearch && !this.diseasefilter.value.searchQuery) {

      return;

    }

    const regExp = /[a-zA-Z0-9_.-]/g;

    const testString = this.diseasefilter.value.searchQuery;

    if (this.diseasefilter.value.searchQuery && !regExp.test(testString)) {

      this.showValidTextMessage = true;

      return;

    }

    let params;

    if (this.searchQuery?.searchQuery) {

      params = {

        searchQuery: this.searchQuery?.searchQuery

          ? this.searchQuery.searchQuery

          : '',

      };

    }

    const searchData = new HttpParams({ fromObject: params });

 

    this.dataSource.loadDisease(

      0,

      10,

      // this.sort.active,

      // this.sort.direction,

      searchData

    );

  }

 

  // global Search

  unselectGlobalSearch(): void {

    this.diseasefilter.get('searchQuery').reset();

    this.onDiseaseFilter();

    this.isEnableGlobalSearch = false;

  }

 

  isEnableGlobalSearchFunc(): any {

    if (this.searchQuery != null) {

      if (this.searchQuery.length) {

        this.onDiseaseFilter();

        this.isEnableGlobalSearch = true;

      } else if (!this.searchQuery.length) {

        this.messageSuccess = true;

        this.loadDiseaseList();

        this.isEnableGlobalSearch = false;

        this.showValidTextMessage = false;

      }

    }

  }

 

  actionToggleChange(tableRow) {

    const weightModalConfig: MatDialogConfig = {

      disableClose: true,

      width: '385px',

      height: '185px',

      data: {

        title: 'Status Change',

        content: `You are changing the status for ICD Code "${

          tableRow.icdCode

        }" to "${

          tableRow.configurationStatus === 'ACTIVE' ? 'Inactive' : 'Active'

        }". Please Confirm`,

      },

    };

    // this.dialog.closeAll();

    this.dialog

      .open(ActionToggleDialogComponent, weightModalConfig)

      .afterClosed()

      .subscribe((res) => {

        if (res) {

          // this.medicationHist(this.patientId);

          this.changedStatus = res;

          this.diseaseService

            .changeIcdCodeStatus(

              tableRow.id,

              tableRow.configurationStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

            )

            .subscribe((res) => {

              this.loadDiseaseList();

              this.snackbarService.success('Status Updated');

              // this.myInputVariable.nativeElement.value = '';

            });

        } else {

          this.loadDiseaseList();

        }

      });

  }

}