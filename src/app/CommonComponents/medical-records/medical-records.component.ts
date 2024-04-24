import { Component, OnInit, ViewChild } from '@angular/core';
import { DiagnosticComponent } from '../doctor-patients-details/diagnostic/diagnostic.component';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.scss'],
})
export class MedicalRecordsComponent implements OnInit {
  patientUnderMedication: boolean;
  diagnostic;
  @ViewChild(DiagnosticComponent) careProvider;
  medicationSelected: string;
  selectedTabIndex: number = 0;
  addPermission: string;
  constructor(private sharedService: CaregiverSharedService) {
    this.addPermission = localStorage.getItem('medicationPermission');
  }

  ngOnInit(): void {
    this.medicationSelected = localStorage.getItem('selectedMedication');

    if (this.medicationSelected == 'true') {
      this.selectedTabIndex = 1;
    }
    this.sharedService.triggerdSelectedMedication.subscribe((res) => {
      if (res) {
        this.selectedTabIndex = 1;
      }
    });
    this.patientUnderMedication = JSON.parse(
      localStorage.getItem('patientUnderMedication')
    );

    // this.patientUnderMedication = true;
  }
  getTabDetails(e) {
    this.diagnostic = e;
  }
  addDiagnostic(): void {
    this.careProvider.addDiagnostic();
  }
  ngDestroy() {
    localStorage.removeItem('selectedMedication');
  }
}
