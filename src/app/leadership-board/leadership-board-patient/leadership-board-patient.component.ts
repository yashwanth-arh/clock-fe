import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';

import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { LeadershipBoardDataSource } from '../leadership-board.datasource';
import { LeadershipBoardService } from '../leadership-services/leadership-board.service';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-leadership-board-patient',
  templateUrl: './leadership-board-patient.component.html',
  styleUrls: ['./leadership-board-patient.component.scss'],
})
export class LeadershipBoardPatientComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  isEnableGlobalSearch: boolean;
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  pageSize = 10;
  messageSuccess: boolean;
  startDate: string;
  endDate: string;
  displayedColumns: string[] = [
    'date',
    // 'patientId',
    'obsPointsMorning',
    'obsPointsEvening',
    'bpPointsMorning',
    'bpPointsEvening',
    'totalPoints',
    // "action"
  ];
  maxDate: Date = new Date();
  leavingComponent: boolean = false;
  patientId: string;
  patientName: string;
  fromDate: Date = new Date();
  toDate: Date;
  dataSource: LeadershipBoardDataSource;
  leadershipPointLists: any[] = [];
  patDetails: any;
  fdate: any;
  tdate: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private leadershipBoardService: LeadershipBoardService,
    private filterService: FilterSharedService,
    private renderer: Renderer2
  ) {
    this.leavingComponent = false;
    this.dataSource = new LeadershipBoardDataSource(
      this.leadershipBoardService,
      this.snackBarService
    );
    this.patientId = this.route.snapshot.params.id;
    if (this.route?.queryParams?.hasOwnProperty('_value')) {
      this.patientName = this.route?.queryParams['_value'].name;
    }
    // this.leadershipBoardService.$experiencePoints.subscribe((res) => {
    // this.patDetails = res;
    // });
    this.patDetails = JSON.parse(localStorage.getItem('xpPoints'));
    // this.filterService.leaderBoradDateFilter('');
    this.filterService.LeaderBoardDateSearch.subscribe((res) => {
      // Parse the date strings and create date objects in UTC
      const fromDate = new Date(res.fromDate);
      const toDate = new Date(res.toDate); // Assuming you want to include the entire day
      // Add one day to fromDate
      fromDate.setDate(fromDate.getDate() + 1);

      // Add one day to toDate
      toDate.setDate(toDate.getDate() + 1);

      // Format the dates if needed
      const formattedFromDate = fromDate.toISOString().split('T')[0];
      const formattedToDate = toDate.toISOString().split('T')[0];

      this.fdate = formattedFromDate;
      this.tdate = formattedToDate;
      this.getLeaderBoardPatientLists();
    });
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    // this.getLeaderBoardPatientLists();
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
  ngAfterViewInit(): void {
    this.leavingComponent = false;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.scrollToTop();
          // this.dataSource.loadLeadershipBoardByPatient(
          //   this.fdate,
          //   this.tdate,
          //   this.paginator.pageIndex,
          //   this.paginator.pageSize
          // );
          (this.pageIndex = this.paginator.pageIndex),
            (this.pageSize = this.paginator.pageSize);
          this.getLeaderBoardPatientLists();
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  getLeaderBoardPatientLists() {
    if (this.leavingComponent) {
      return;
    }
    const body = {
      dateFrom: this.fdate,
      dateTo: this.tdate,
    };
    this.dataSource.loadLeadershipBoardByPatient(
      this.patientId,
      body,
      this.pageIndex,
      this.pageSize
    );
  }
  getObsPoints(points) {
    return Number(points.eveningObsPoints) + Number(points.morningObsPoints);
  }
  getBPPoints(points) {
    return (
      Number(points.eveningReadingPoints) + Number(points.morningReadingPoints)
    );
  }
  getTotalPoints(points) {
    return (
      Number(points.eveningObsPoints) +
      Number(points.morningObsPoints) +
      Number(points.eveningReadingPoints) +
      Number(points.morningReadingPoints)
    );
  }
  goToDetails(element) {
    this.router.navigate([]);
  }
  // getStartDate(event) {
  //   const sDate = event.value;
  //   this.fromDate = sDate;
  //   if (sDate !== null) {
  //     const dateFormat = sDate.setDate(sDate.getDate() + 1);
  //     const dateVal = new Date(dateFormat)?.toISOString().split('T');
  //     this.startDate = dateVal[0];
  //   }
  // }
  // getEndDate(event) {
  //   const eDate = event.value;
  //   this.toDate = eDate;
  //   if (eDate !== null) {
  //     const dateFormat = eDate.setDate(eDate.getDate() + 1);
  //     const dateVal = new Date(dateFormat).toISOString().split('T');
  //     this.endDate = dateVal[0];
  //   }
  //   if (this.startDate && this.endDate) {
  //     let body = {};
  //     body = {
  //       dateFrom: this.startDate,
  //       dateTo: this.endDate,
  //     };
  //     this.dataSource.loadLeadershipBoardByPatient(
  //       this.patientId,
  //       body,
  //       this.paginator.pageIndex,
  //       this.paginator.pageSize
  //     );
  //   }
  // }
  viewLeadershipBoard() {
    this.router.navigate(['home/leader-board']);
    localStorage.removeItem('xpPoints');
  }
}
