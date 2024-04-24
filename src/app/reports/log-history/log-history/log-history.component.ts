import { tap } from 'rxjs/operators';
import { async, merge } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { LogHistoryService } from '../../service/log-history.service';
// import { MatSort } from '@angular/material/sort';
import { LogHistoryDataSource } from './log-history-data-source';
import { HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { number } from 'echarts';

@Component({
  selector: 'app-log-history',
  templateUrl: './log-history.component.html',
  styleUrls: ['./log-history.component.scss'],
})
export class LogHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() newItemEvent = new EventEmitter<any>();
  loggedList: any = {};
  showCard = true;
  public dataSource: LogHistoryDataSource;
  logForm: FormGroup;
  messageSuccess: boolean;
  isEnableGlobalSearch: boolean;
  showValidTextMessage = false;

  loggedInHeaders: string[] = [
    'userId',
    'username',
    'role',
    'loggedTime',
    'ipAddress',
    'location',
  ];
  searchQuery: string = null;
  logCount: any;
  constructor(
    private auth: AuthService,
    private snackBarService: SnackbarService,
    private service: LogHistoryService,
    public fb: FormBuilder,
    private router: Router,
    private filterService: FilterSharedService
  ) {
    this.dataSource = new LogHistoryDataSource(
      this.service,
      this.snackBarService
    );
    //
  }
  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.dataSource.loadLogHist(0, 0, '');
    this.logForm = this.fb.group({
      searchQuery: [''],
    });
    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });

    this.filterService.logHistory.subscribe((res) => {
      this.searchQuery = res.searchQuery;
      this.isEnableGlobalSearchFunc();
      this.logCount = localStorage.getItem('searchDataLength');
      this.pickDate(this.logCount);
    });
    //
  }
  public pickDate(date: any): void {
    this.newItemEvent.emit(date);
  }
  loadLogHistory() {
    this.dataSource.loadLogHist(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      // this.logForm.get('searchQuery').value
      this.searchQuery
    );
  }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadLogHistory()))
      .subscribe();
  }

  // getCardData(): void {
  //   this.service.getLoggedInList().subscribe((data) => {
  //     this.loggedList = data.content;
  //     this.dataSource = this.loggedList;
  //   },
  //     (error) => {
  //       this.snackBarService.error(error.message, 2000);
  //     }
  //   );
  // }
  isEnableGlobalSearchFunc() {
    if (this.searchQuery != null) {
      if (this.searchQuery.length > 2) {
        const regExp = /[a-zA-Z0-9_.-]/g;
        const testString = this.searchQuery;
        if (this.searchQuery && !regExp.test(testString)) {
          this.showValidTextMessage = true;
          return;
        }
        this.dataSource.loadLogHist(0, 10, this.searchQuery);
        this.isEnableGlobalSearch = true;
      } else if (!this.searchQuery.length) {
        this.messageSuccess = true;
        this.dataSource.loadLogHist(0, 0, '');
        this.isEnableGlobalSearch = false;
        this.showValidTextMessage = false;
      }
    }
  }
  // isEnableGlobalSearchFunc(): any {
  //   if (this.logForm.get('searchQuery').value.length > 2) {
  //     const regExp = /[a-zA-Z0-9_.-]/g;
  //     const testString = this.logForm.get('searchQuery').value;
  //     if (this.logForm.get('searchQuery').value && !regExp.test(testString)) {
  //       this.showValidTextMessage = true;
  //       return;
  //     }
  //     this.dataSource.loadLogHist(0, 10, this.logForm.get('searchQuery').value);
  //     this.isEnableGlobalSearch = true;
  //   } else if (!this.logForm.get('searchQuery').value.length) {
  //     this.messageSuccess = true;
  //     this.dataSource.loadLogHist(0, 0, '');
  //     this.isEnableGlobalSearch = false;
  //     this.showValidTextMessage = false;
  //   }
  // }
  unselectGlobalSearch(): void {
    this.logForm.get('searchQuery').reset();
    this.dataSource.loadLogHist(0, 0, '');
    // this.getCardData();
    this.isEnableGlobalSearch = false;
  }
}
