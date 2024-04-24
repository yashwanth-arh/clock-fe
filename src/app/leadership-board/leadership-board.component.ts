import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';

import { SnackbarService } from '../core/services/snackbar.service';
import { LeadershipBoardDataSource } from './leadership-board.datasource';
import { LeadershipBoardService } from './leadership-services/leadership-board.service';
import { DoctorService } from '../doctor-management/service/doctor.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { HospitalManagementService } from '../hospital-management/service/hospital-management.service';
import { FilterSharedService } from '../core/services/filter-shared.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-leadership-board',
  templateUrl: './leadership-board.component.html',
  styleUrls: ['./leadership-board.component.scss'],
})
export class LeadershipBoardComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  hospital: any = [];
  isEnableGlobalSearch: boolean;
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  messageSuccess: boolean;
  userRole: string;
  displayedColumns: string[] = [
    'patientName',
    // 'patientId',
    'obsPoints',
    'bpPoints',
    'totalPoints',
    'actions',
    // "action"
  ];
  dataSource: LeadershipBoardDataSource;
  leadershipPointLists: any[] = [];
  clinicList: any[];
  isEnablePracticeSearch: boolean;
  practiceList: any;
  leadershipgrp: FormGroup;
  isEnableClinic: boolean;
  isEnableClinicSearch: any;
  searchQuery: any;
  leavingComponent: boolean = false;
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private snackBarService: SnackbarService,
    private doctorService: DoctorService,
    private leadershipBoardService: LeadershipBoardService,
    public fb: FormBuilder,
    private authService: AuthService,
    private practiceService: HospitalManagementService,
    private filterService: FilterSharedService
  ) {
    this.leavingComponent =false;
    this.dataSource = new LeadershipBoardDataSource(
      this.leadershipBoardService,
      this.snackBarService
    );
  }

  ngOnInit(): void {
    this.leavingComponent =false;
    this.filterService.LeadershipSearchField('');
    
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.leadershipgrp = this.fb.group({
      practiceFilter: [],
      clinicFilter: [],
    });
    const user = this.authService.authData;
    this.userRole = user?.userDetails?.userRole;

    // this.dataSource.loadLeadershipBoard(0, 10, '', '');
    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
    this.filterService.LeadershipSearch.subscribe((res) => {
      if(this.leavingComponent ){
        return;
      }
      if (Object.keys(res).length) {
        this.searchQuery=res.searchQuery;
        this.dataSource.loadLeadershipBoard(0, 10, this.searchQuery);
      }
      else{
        this.dataSource.loadLeadershipBoard(0, 10, '');
      }
    });
  }

  ngOnDestroy(): void {
    this.leavingComponent =true;
   }
   scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }
  ngAfterViewInit(): void {
    this.leavingComponent =false;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.scrollToTop()
          this.loadLeadershipBoardPage();
        })
      )
      .subscribe();
  }
  public loadLeadershipBoardPage(): void {
   
    this.dataSource.loadLeadershipBoard(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );
  }
  isEnableClinicFunc(): any {
    this.isEnableClinic = true;
  }
  unselectClinic(): void {
    this.leadershipgrp.get('clinicFilter').reset();
    // if (this.leadershipgrp.get('practiceFilter').value) {
    //   this.doctorService.getClinicList(this.leadershipgrp.get('practiceFilter').value).subscribe((data: any) => {
    //     this.clinicList = data.branchList.filter(
    //       (element) => element.name != null
    //     );
    //     this.clinicList.sort((a, b) => (a.name > b.name ? 1 : -1));
    //     this.isEnablePracticeSearch = true;
    //   });
    // }
    // this.getCaregiverList();
    this.clinicList = [];
    this.isEnableClinic = false;
    // this.defaultCaregiverData();
    this.dataSource.loadLeadershipBoard(0, 10, '', '');
  }
  onPracticeSelection(event): any {
    // this.clinicList = [];
    // this.doctorService.getFacilityList(event).subscribe((data: any) => {
    //   this.clinicList = data.branchList.filter(
    //     (element) => element.name != null
    //   );
    //   this.clinicList.sort((a, b) => (a.name > b.name ? 1 : -1));
    //   this.isEnablePracticeSearch = true;
    // });
  }
  unselectPracticeSearch() {
    this.leadershipgrp.get('practiceFilter').reset();
    this.leadershipgrp.get('clinicFilter').reset();

    this.clinicList = [];
    this.dataSource.loadLeadershipBoard(0, 10, '', '');
    this.isEnablePracticeSearch = false;
    this.isEnableClinic = false;
    // this.defaultCaregiverData();
  }
  getPatientName(e) {
    return e.firstName + ' ' + e.lastName;
  }
  onSearch(): void {
    this.paginator.pageIndex = 0;
    this.dataSource.loadLeadershipBoard(
      0,
      10,
      this.leadershipgrp.get('practiceFilter').value,
      this.leadershipgrp.get('clinicFilter').value
    );
  }
  gotoDetails(element) {
    this.leadershipBoardService.setXp({
      obsPoint: this.getObsPoints(element),
      bpPoint: this.getBPPoints(element),
      totPoint: this.getTotalPoints(element),
    });
    localStorage.setItem(
      'xpPoints',
      JSON.stringify({
        obsPoint: this.getObsPoints(element),
        bpPoint: this.getBPPoints(element),
        totPoint: this.getTotalPoints(element),
      })
    );
    this.router.navigate(['/home/leader-board', element.id], {
      queryParams: {
        name: element.firstName + ' ' + element.lastName,
      },
      skipLocationChange: false,
    });
  }
  getObsPoints(points) {
    return (
      Number(points?.morningObsPoints)
      
    );
  }
  getBPPoints(points) {
    return (
      Number(points?.morningReadingPoints) 
     
    );
  }
  getTotalPoints(points) {
    return (
      Number(points?.totalPoints) 
      
    );
  }
}
