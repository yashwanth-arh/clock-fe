import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { UserPermission } from '../shared/entities/user-permission.enum';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  chartData = [];
  public doctorPermission: UserPermission = UserPermission.HAS_DOCTOR_DASHBOARD;
  public clinicPermission: UserPermission = UserPermission.HAS_CLINIC_DASHBOARD;
  public practicePermission: UserPermission =
    UserPermission.HAS_PRACTICE_DASHBOARD;
  public adminPermission: UserPermission =
    UserPermission.HAS_RPM_ADMIN_DASHBOARD;
  cardDataList: any;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Patients', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Doctors', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Clinic', stack: 'a' },
  ];

  chartType: ChartType = 'bar';

  hideTypeDropdown = false;

  constructor(private route: ActivatedRoute) {
    this.chartData = [
      this.barChartLabels,
      this.barChartData,
      this.chartType,
      this.hideTypeDropdown,
    ];
    if (localStorage.getItem('current-url') !== 'dashboard') {
      localStorage.setItem('current-url', 'dashboard');
    }
  }
}
