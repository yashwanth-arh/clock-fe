import { AuthService } from './../../../core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as Drugs from '../../../../assets/json/drugs.json';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';

@Component({
  selector: 'app-add-medication',
  templateUrl: './add-medication.component.html',
  styleUrls: ['./add-medication.component.scss'],
})
export class AddMedicationComponent implements OnInit {
  editData: any;
  public medicationForm: FormGroup;
  medicationId: any;
  patientId: string;
  doctorId: any;
  newMedication = false;
  medicationHistoryList: any = [];
  updateMedication = false;
  medicationDataSource: any;
  filteredMedicine: Observable<any>;
  medicine: string[] = [];
  drugslist: any = [];
  userRole: any;

  constructor(
    public dialogRef: MatDialogRef<AddMedicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private docservice: DoctorDashboardService,
    private service: CaregiverDashboardService,
    public auth: AuthService
  ) {
    const user = auth.authData;
    if (user?.userDetails) {
      this.userRole = user?.userDetails?.userRole;
    }
    this.editData = data;
    this.drugslist = Drugs['default'].drug_names;
    this.patientId = localStorage.getItem('patientId');
  }

  ngOnInit(): void {
    // this.medicationHist(this.patientId);
    this.medicationForm = this.fb.group({
      medicineName: ['', Validators.compose([Validators.required])],
      medicineDose: ['', Validators.compose([Validators.required])],
      medicineUnit: [''],
      formulation: [''],
      route: [''],
      frequency: [''],
      duration: ['', Validators.compose([Validators.required])],
    });
    if (this.editData) {
      this.medicationForm = this.fb.group({
        medicineName: [
          this.editData.medicineName,
          Validators.compose([Validators.required]),
        ],
        medicineDose: [
          this.editData.medicineDose,
          Validators.compose([Validators.required]),
        ],
        medicineUnit: [this.editData.medicineUnit],
        formulation: [this.editData.formulation],
        route: [this.editData.route],
        frequency: [this.editData.frequency],
        duration: [
          this.editData.duration,
          Validators.compose([Validators.required]),
        ],
      });
    }
    // this.medicine = this.drugslist;
    // this.filteredMedicine = this.medicationForm
    //   .get('medicineName')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map((value) => this.medicinefilter(value)),
    //   );
  }
  private medicinefilter(value): any {
    if (value) {
      const filterCityValue = value;

      return this.medicine.filter((option) =>
        option['medicineName'].includes(filterCityValue)
      );
    } else {
      return this.medicine;
    }
  }

  medicationNames() {
    if (this.medicationForm.controls['medicineName']?.value?.length > 2) {
      this.service
        .getMedicationNames(this.medicationForm.controls['medicineName']?.value)
        .subscribe(
          (data) => {
            this.medicine = data;
            // this.medicinefilter(this.medicine);
          },
          (err) => {
            // this.snackbarService.error(err.message);
          }
        );
    }
  }

  createMedication(valid, value, data) {
    if (!valid) {
      return this.snackbarService.error('Enter valid data');
    }
    if (!this.medicationId) {
      // value.patientId = this.patientId;
      value.createdBy = this.userRole;
      this.docservice.addMedication(value, this.patientId).subscribe(
        () => {
          this.newMedication = false;
          this.medicationHist(this.patientId);
          this.snackbarService.success('Medication added successfully');
          this.medicationForm.reset();
          this.dialogRef.close();
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
    } else {
      value.patientId = this.patientId;
      this.docservice.editMedication(value, this.medicationId).subscribe(
        () => {
          this.snackbarService.success('Medication updated successfully');
          this.newMedication = false;
          this.medicationHist(this.patientId);
          this.medicationForm.reset();
          this.dialogRef.close();
        },
        (err) => {
          // this.snackbarService.error(err.error.message);
        }
      );
    }
  }
  editMedication(ele) {
    this.newMedication = !this.newMedication;
    this.medicationForm.get('medicineName').setValue(ele.medicineName);
    this.medicationForm.get('medicineDose').setValue(ele.medicineDose);
    this.medicationForm.get('medicineUnit').setValue(ele.medicineUnit);
    this.medicationForm.get('formulation').setValue(ele.formulation);
    this.medicationForm.get('route').setValue(ele.route);
    this.medicationForm.get('frequency').setValue(ele.frequency);
    this.medicationForm.get('duration').setValue(ele.duration);
    this.medicationId = ele.id;
    this.updateMedication = true;
    this.dialogRef.close();
  }

  medicationHist(id) {
    this.service.getMedicationHistory(id).subscribe(
      (data) => {
        this.medicationHistoryList = data;
        this.medicationHistoryList.sort(
          (a, b) => new Date(b.date1).getTime() - new Date(a.date1).getTime()
        );
        this.medicationDataSource = this.medicationHistoryList;
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }

  closeMedication() {
    this.dialogRef.close();
  }
}
