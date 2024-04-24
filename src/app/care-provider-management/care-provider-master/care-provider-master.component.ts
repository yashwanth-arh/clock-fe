import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CareProviderDialogComponent } from '../care-provider-dialog/care-provider-dialog.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { CareCoordinatorDialogComponent } from '../care-coordinator-dialog/care-coordinator-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchUserListComponent } from 'src/app/branches/branch-user/branch-user-list/branch-user-list.component';
import { HospitalUserComponent } from 'src/app/hospital-management/hospital-user/hospital-user.component';
import { CareCoordinatorComponent } from '../care-coordinator/care-coordinator.component';
import { CareProviderComponent } from '../care-provider/care-provider.component';
import { AllFiltersComponent } from 'src/app/core/components/all-filters/all-filters.component';

@Component({
  selector: 'app-care-provider-master',
  templateUrl: './care-provider-master.component.html',
  styleUrls: ['./care-provider-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CareProviderMasterComponent implements OnInit {
  showCareProvider: boolean = true;
  showCareCoordinator: boolean = false;
  selectedTabName: any;
  userRole: any;
  showFacilityAdmin: boolean = false;
  @ViewChild(BranchUserListComponent) branchUserList;
  @ViewChild(HospitalUserComponent) hospitalUserList;
  @ViewChild(CareCoordinatorComponent) careCoordinator;
  @ViewChild(CareProviderComponent) careProvider;
  @ViewChild('filters') filters: AllFiltersComponent;

  showHospitalAdmin: boolean;
  constructor(
    public dialog: MatDialog,
    public filterService: FilterSharedService,
    private router: Router,
    private auth: AuthService
  ) {
    const user = this.auth.authData;
    this.userRole = user?.userDetails?.userRole;
    // localStorage.setItem('orgId', user?.userDetails?);
  }

  ngOnInit(): void {
    this.filterService.globalCareProviderCall('');
    this.filterService.statusCareProviderCall('');
    this.filterService.globalCareCoordinatorCall('');
    this.filterService.statusCareCoordinatorCall('');
    this.filterService.globalHospitalAdminsCall('');
    this.filterService.statusHospitalAdminsCall('');
    this.filterService.globalFacilityAdminsCall('');
    this.filterService.statusFacilityAdminsCall('');
    this.filterService.subModuleCall('Care Providers');
  }
  getTabDetails(event) {
    this.selectedTabName = event.tab.textLabel;
    if (this.selectedTabName === 'Care Providers') {
      this.filterService.subModuleCall(this.selectedTabName);
      this.showCareProvider = true;
      this.showCareCoordinator = false;
      this.showFacilityAdmin = false;
      this.showHospitalAdmin = false;
      this.filterService.subModuleCall(this.selectedTabName);
      this.filterService.statusCareProvider.next('All');
    } else if (this.selectedTabName === 'Program Coordinators') {
      this.filterService.subModuleCall(this.selectedTabName);
      this.showCareProvider = false;
      this.showCareCoordinator = true;
      this.showFacilityAdmin = false;
      this.showHospitalAdmin = false;
      this.filterService.statusCareCoordinator.next('All');
      this.filterService.subModuleCall(this.selectedTabName);
    } else if (this.selectedTabName === 'Facility Admins') {
      this.filterService.subModuleCall(
        this.selectedTabName == 'Facility Admins'
          ? 'Facility Admin'
          : this.selectedTabName
      );
      this.showCareProvider = false;
      this.showCareCoordinator = false;
      this.showFacilityAdmin = true;
      this.showHospitalAdmin = false;
      this.filterService.statusFacilityAdmins.next('All');
      this.filterService.globalFacilityAdminsCall({});
    } else if (this.selectedTabName === 'Hospital Admins') {
      this.filterService.subModuleCall(
        this.selectedTabName == 'Hospital Admins'
          ? 'Hospital Admin'
          : this.selectedTabName
      );
      this.showCareProvider = false;
      this.showCareCoordinator = false;
      this.showFacilityAdmin = false;
      this.showHospitalAdmin = true;
      this.filterService.globalHospitalAdminsCall({});
    }
  }
  addDoctor(): void {
    this.careProvider.addDoctor();
  }

  addCoordinator(): void {
    this.careCoordinator.openCareCoordinator();
  }
  addFacilityAdmin() {
    this.branchUserList.createUser();
  }
  addHospitalAdmin() {
    this.hospitalUserList.createUser();
  }
}
