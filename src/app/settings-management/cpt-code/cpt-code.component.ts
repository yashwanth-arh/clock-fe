import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CptCode, Status } from '../entities/cpt-code';
import { CptCodeService } from '../services/cpt-code.service';
import { CPTDataSource } from '../services/cpt-data-source';
import { AddCptComponent } from './add-cpt/add-cpt.component';
import { EditCptComponent } from './edit-cpt/edit-cpt.component';

@Component({
  selector: 'app-cpt-code',
  templateUrl: './cpt-code.component.html',
  styleUrls: ['./cpt-code.component.scss'],
})
export class CptCodeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  public dataSource: CPTDataSource;
  displayedColumns: string[] = [
    'id',
    'description',
    'amount',
    // "Actions"
  ];
  status: string[] = [Status.Active, Status.Inactive];
  public cptfilter: FormGroup;
  searchQuery: string;
  isEnableGlobalSearch: boolean;
  messageSuccess: boolean;
  constructor(
    public fb: FormBuilder,
    public router: Router,
    public cptService: CptCodeService,
    public dialog: MatDialog,
    public snackbarService: SnackbarService
  ) {
    this.dataSource = new CPTDataSource(this.cptService, this.snackbarService);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.dataSource?.loadCodes(0, 0);
    this.cptfilter = this.fb.group({
      searchQuery: ['', Validators.nullValidator],
    });

    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadCodeList()))

      .subscribe();
  }

  public loadCodeList(): void {
    this.dataSource.loadCodes(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.cptfilter?.get('searchQuery').value
    );
  }

  /**
   * Refresh table
   */
  protected refreshTable(): void {
    this.dataSource = new CPTDataSource(this.cptService, this.snackbarService);
    this.dataSource.loadCodes(0, 0);
  }

  /**
   * open add cpt code dialog
   */
  public openAddCPTCodeDialog(): void {
    const addDialogRef = this.dialog.open(AddCptComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '750px',
    });

    addDialogRef.afterClosed().subscribe(() => {
      this.refreshTable();
    });
  }

  /**
   * open edit cpt code dialog
   */
  public openEditCPTCodeDialog(cptCode: CptCode): void {
    const editDialogRef = this.dialog.open(EditCptComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '750px',
      data: {
        code: cptCode,
      },
    });

    editDialogRef.afterClosed().subscribe(() => {
      this.refreshTable();
    });
  }
  onCptFilter(): void {
    if (!this.isEnableGlobalSearch && !this.cptfilter.value.searchQuery) {
      return;
    }
    const regExp = /[0-9]/g;
    const testString = this.cptfilter.value.searchQuery;
    if (this.cptfilter.value.searchQuery && !regExp.test(testString)) {
      this.snackbarService.error('Enter valid text');
      return;
    }
    this.dataSource.loadCodes(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.cptfilter.get('searchQuery').value !== ''
        ? this.cptfilter.get('searchQuery').value
        : null
    );
  }
  // global Search
  unselectGlobalSearch(): void {
    this.cptfilter.get('searchQuery').reset();
    this.onCptFilter();
    this.isEnableGlobalSearch = false;
  }

  isEnableGlobalSearchFunc(): any {
    if (this.cptfilter.get('searchQuery').value.length > 2) {
      this.onCptFilter();
      this.isEnableGlobalSearch = true;
    } else if (!this.cptfilter.get('searchQuery').value.length) {
      this.messageSuccess = true;
      this.loadCodeList();
      this.isEnableGlobalSearch = false;
    }
  }
}
