import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../../entities/patient';
import { PatientManagementService } from '../../service/patient-management.service';

@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.scss']
})
export class PatientHeaderComponent implements OnInit {
  @Input() patientId: string;
  public maleImg = 'assets/svg/male.svg';
  public femaleImg = 'assets/svg/female.svg';
  public patientData: Patient;
  public patientName: string;

  constructor(
    private patientService: PatientManagementService,
  ) { }

  ngOnInit(): void {

    if (this.patientId) {
      this.patientService.getPatient(this.patientId).subscribe((data: Patient) => {
        this.patientData = data;
        this.patientName = [data.firstName, data.middleName, data.lastName].join(' ');
      });
    }
  }

}
