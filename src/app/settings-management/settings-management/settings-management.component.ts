import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { AddDiseaseComponent } from '../disease/add-disease/add-disease.component';
import { DieseaseComponent } from '../disease/diesease.component';
import { SpecialityListComponent } from '../speciality/speciality-list/speciality-list.component';
import { DoctorIdentityComponent } from '../doctor-identity/doctor-identity.component';
import { HospitalIdentityComponent } from '../hospital-identity/hospital-identity.component';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-settings-management',
  templateUrl: './settings-management.component.html',
  styleUrls: ['./settings-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsManagementComponent implements OnInit {
  selectedTabName: any = 'ICD Codes';
  showICDCodes: boolean;
  Specialities: boolean;
  DoctorIdentity: boolean;
  HospitalIdentity: boolean;
  @ViewChild(DieseaseComponent) dieseaseComponent;
  @ViewChild(SpecialityListComponent) specialityListComponent;
  @ViewChild(DoctorIdentityComponent) doctorIdentityComponent;
  @ViewChild(HospitalIdentityComponent) hospitalIdentityComponent;

  constructor(
    private filterService: FilterSharedService,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterService.settingTypeTabsCall('');
    this.filterService.configureSearchCall('');
    this.getTabDetails('ICD Codes');
  }

  getTabDetails(event) {
    this.selectedTabName = event;
    this.filterService.configureSearchCall('');
    this.filterService.settingTypeTabsCall(this.selectedTabName);
  }

  openIcdCodes(e) {
    if (e === 'ICD Codes') {
      this.dieseaseComponent.openAddDiseaseDialog();
    }
    if (e === 'Specialities') {
      this.specialityListComponent.addSpecialty();
    }
    if (e === 'Doctor Identity') {
      this.doctorIdentityComponent.addDoctorIdentity();
    }
    if (e === 'Hospital Identity') {
      this.hospitalIdentityComponent.addHospitalIdentity();
    }
  }
}
