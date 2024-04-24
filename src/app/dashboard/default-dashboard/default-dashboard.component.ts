import { CaregiverService } from './../../caregiver/caregiver.service';
import { AfterViewInit, Component } from '@angular/core';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Router } from '@angular/router';
import { LeadershipBoardDataSource } from 'src/app/leadership-board/leadership-board.datasource';
import { LeadershipBoardService } from 'src/app/leadership-board/leadership-services/leadership-board.service';
import { PageEvent } from '@angular/material/paginator';
import { DashboardService } from '../dashboard.service';
import { DashboardSharedService } from '../dashboard.shared.service';

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss'],
})
export class DefaultDashboardComponent implements AfterViewInit {
  userRole: string;
  cardDataList: any = {};
  chartData: any;
  selectedFilter: string = 'Monthly';
  showGraph = false;
  expanded: boolean;
  messageSuccess: boolean;
  selectedTab: any;
  displayedColumns: string[] = [
    'patientName',
    'totalPoints',
    // 'actions',
  ];
  dataSource: LeadershipBoardDataSource;
  constructor(
    public auth: AuthService,
    private snackBarService: SnackbarService,
    private service: DashboardService,
    private router: Router,
    private leadershipService: LeadershipBoardService,
    private dashboardSharedService: DashboardSharedService
  ) {
    const user = this.auth.authData;
    if (user?.userDetails) {
      this.userRole = user?.userDetails?.userRole;
    }
    this.dataSource = new LeadershipBoardDataSource(
      this.leadershipService,
      this.snackBarService
    );
    if (this.userRole === 'RPM_ADMIN') {
      this.selectedTab = 'Hospitals';
    } else if (this.userRole === 'HOSPITAL_USER') {
      this.selectedTab = 'Facilities';
    } else if (this.userRole === 'FACILITY_USER') {
      this.selectedTab = 'Patients';
    }
    const sidenavExpand = JSON.parse(localStorage.getItem('expandSidenav'));
    this.expanded = sidenavExpand;
  }
  ngOnInit() {
    this.getChartData();
    this.getFilterData(this.selectedFilter);
  }
  ngAfterViewInit() {
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.getCardData();
    if (this.userRole != 'RPM_ADMIN') {
      // this.dataSource.loadLeadershipBoard(0, 0, '', '');
      this.dataSource.totalElemObservable.subscribe((data) => {
        if (data > 0) {
          this.messageSuccess = true;
        } else if (data === 0) {
          this.messageSuccess = false;
        }
      });
    }
  }

  getCardData(): void {
    this.service.getDashboardCardData().subscribe(
      (data) => {
        this.cardDataList = data.count;
        // this.chartData.push(
        //   { y: data.hospital, label: 'Practices' },
        //   { y: data.branch, label: 'Clinics' },
        //   { y: data.patient, label: 'Patients' },
        //   { y: data.doctor, label: 'Doctors' },
        //   { y: data.caregiver, label: 'Caregivers' }
        // );
        this.showGraph = true;
      },
      (error) => {
        if (error.status === 403) {
          this.router.navigate(['/login']);
          this.snackBarService.error(error['message']);
        } else {
          this.snackBarService.error('Failed!', 2000);
        }
      }
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
  onTabChange(event) {
    this.selectedTab = event.tab.textLabel;
    this.getChartData();
  }
  getChartData() {
    if (this.selectedTab === 'Hospitals') {
      this.service.getHospitalsGraph().subscribe((res) => {
        this.chartData = res;
        this.chartData.selectedTab = this.selectedTab;
        this.dashboardSharedService.changeTab(this.chartData);
      });
    } else if (this.selectedTab === 'Facilities') {
      this.service.getFacilityGraph().subscribe((res) => {
        this.chartData = res;
        this.chartData.selectedTab = this.selectedTab;
        this.dashboardSharedService.changeTab(this.chartData);
      });
    } else if (this.selectedTab === 'Patients') {
      this.service.getPatientGraph().subscribe((res) => {
        this.chartData = res;
        this.chartData.selectedTab = this.selectedTab;
        this.dashboardSharedService.changeTab(this.chartData);
      });
    } else if (this.selectedTab === 'Care Providers') {
      this.service.getCareProviderGraph().subscribe((res) => {
        this.chartData = res;
        this.chartData.selectedTab = this.selectedTab;
        this.dashboardSharedService.changeTab(this.chartData);
      });
    }
  }
  getFilterData(event) {
    this.selectedFilter = event.value ? event.value : this.selectedFilter;

    this.dashboardSharedService.changeFilterData(this.selectedFilter);
  }
  gotoDetails(element) {
    // this.leadershipBoardService.setXp({
    //   obsPoint: this.getObsPoints(element),
    //   bpPoint: this.getBPPoints(element),
    //   totPoint: this.getTotalPoints(element),
    // });
    // localStorage.setItem(
    //   'xpPoints',
    //   JSON.stringify({
    //     obsPoint: this.getObsPoints(element),
    //     bpPoint: this.getBPPoints(element),
    //     totPoint: this.getTotalPoints(element),
    //   })
    // );
    this.router.navigate(['/home/leader-board', element.patientId], {
      queryParams: {
        name: element.firstName + ' ' + element.lastName,
      },
      skipLocationChange: false,
    });
  }
}
