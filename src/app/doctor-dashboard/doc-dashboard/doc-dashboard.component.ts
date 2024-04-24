import { Component, OnInit } from '@angular/core';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DoctorDashboardService } from '../doctor-dashboard.service';

@Component({
  selector: 'app-doc-dashboard',
  templateUrl: './doc-dashboard.component.html',
  styleUrls: ['./doc-dashboard.component.scss']
})
export class DocDashboardComponent implements OnInit {
  details: any;
  doctorName: string;
  branch: string;
  roleid: string;
  data: any;

  constructor(private auth: AuthService,
    private service: CaregiverDashboardService) { }

  ngOnInit(): void {
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    // this.getCareGiverDetails();
  }

  getCareGiverDetails() {
    this.data=JSON.parse(localStorage.getItem('careproviderDetails'));
    this.details = this.data;
      
      this.doctorName = this.details.name;
      this.branch = this.details.branchName;
    // this.service.getUserDetails().subscribe(data => {
    //   this.details = data;
      
    //   this.doctorName = this.details.name;
    //   this.branch = this.details.branchName;
    // }, err => {
    //   // this.snackbarService.error(err.message);
    // });
  }

}
