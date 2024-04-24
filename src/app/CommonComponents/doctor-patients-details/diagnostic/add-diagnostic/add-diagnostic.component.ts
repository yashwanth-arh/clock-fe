import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, OnInit, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete/autocomplete-trigger';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { add } from 'lodash';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { PatientDetailspageHeaderComponent } from 'src/app/CommonComponents/patient-detailspage-header/patient-detailspage-header.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ExistDiagnosisComponent } from './exist-diagnosis/exist-diagnosis.component';

@Component({
  selector: 'app-add-diagnostic',
  templateUrl: './add-diagnostic.component.html',
  styleUrls: ['./add-diagnostic.component.scss'],
})
export class AddDiagnosticComponent implements OnInit {
  diagnosticDialog: FormGroup;
  scheduleDate: Date;
  public submitted = false;
  public keyEventHeight = [];
  public keyEventWeight = [];
  dataSource: any;
  patUnderMedications: any = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];
  showBPError = false;
  bpValue: any;
  bpArray: any = [];
  patientId: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  @Input() max: any;
  today = new Date();
  default = new Date();
  filterfromDate: string;
  filterToDate: string;
  vitalsList: any;
  selectedValue: string;
  @ViewChild(PatientDetailspageHeaderComponent) patientHeader;
  diagnosisData: any;
  minDate: string;
  maxDate: string;
  // medicine: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddDiagnosticComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: CaregiverDashboardService,
    private snackBar: SnackbarService,
    private caregiverSharedservice: CaregiverSharedService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    // Get the current date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    // Calculate the maximum date (current date)
    this.maxDate = currentDate.toISOString().split('T')[0];

    // Calculate the minimum date (current date - 5 years)
    currentDate.setFullYear(currentDate.getFullYear() - 5);
    this.minDate = currentDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // this.today.setDate(this.today.getDate());
    const date = new Date();
    this.patientId = localStorage.getItem('patientId');

    let dateInUTC;
    if (this.data?.mode === 'edit') {
      dateInUTC = this.datePipe.transform(
        this.data?.edit.date,
        'yyyy-MM-ddTHH:mm:ss'
      );
      this.datePipe.transform(dateInUTC, 'yyyy-MM-dd');
      // dateInUTC.setDate(dateInUTC.getDate());
      // this.default = [
      //   date,
      //   new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      // ];
      this.default = this.data?.edit.date.split('.')[0];
      console.log(
        this.default,
        this.data?.edit.date.split('.')[0],
        this.datePipe.transform(dateInUTC, 'yyyy-MM-dd'),
        dateInUTC
      );
    }

    this.diagnosticDialog = this.fb.group({
      date: [
        this.data?.mode === 'edit'
          ? this.data?.edit.date.split('.')[0]
          : this.today,
        Validators.compose([Validators.required]),
      ],
      diagnosislist: [
        '',
        Validators.compose([
          Validators.minLength(3),
          ,
          Validators.maxLength(50),
          Validators.min(3),
          Validators.max(50),
        ]),
      ],
      height: [
        this.data?.mode === 'edit' ? this.data?.edit.height : null,
        Validators.compose([
          Validators.required,
          Validators.min(50),
          Validators.max(250),
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      weight: [
        this.data?.mode === 'edit' ? this.data?.edit.weight : null,
        Validators.compose([
          Validators.required,
          Validators.min(30),
          Validators.max(800),
        ]),
      ],
      hba1c: [
        this.data?.mode === 'edit' ? this.data?.edit.hba1c : null,
        Validators.compose([
          Validators.min(1),
          Validators.max(99),
          Validators.maxLength(4),
          this.noZerosValidator,
        ]),
      ],
      cholestralLevels: [
        this.data?.mode === 'edit' ? this.data?.edit.cholestralLevels : null,
        Validators.compose([
          Validators.minLength(2),
          this.noZerosValidator,
          Validators.maxLength(3),
          Validators.min(10),
        ]),
      ],
      triglycerideLevels: [
        this.data?.mode === 'edit' ? this.data?.edit.triglycerideLevels : null,
        Validators.compose([
          Validators.minLength(2),
          this.noZerosValidator,
          Validators.maxLength(3),
          Validators.min(10),
        ]),
      ],
      hdlLevels: [
        this.data?.mode === 'edit' ? this.data?.edit.hdlLevels : null,
        Validators.compose([
          Validators.minLength(2),
          this.noZerosValidator,
          // Validators.pattern(/^(?!0+$)\d+$/),
          Validators.maxLength(3),
          Validators.min(10),
        ]),
      ],
      ldlLevels: [
        this.data?.mode === 'edit' ? this.data?.edit.ldlLevels : null,
        Validators.compose([
          Validators.minLength(2),
          this.noZerosValidator,
          Validators.maxLength(3),
          Validators.min(10),
        ]),
      ],
      fastingSugar: [
        this.data?.mode === 'edit' ? this.data?.edit.fastingSugar : null,
        Validators.compose([
          Validators.minLength(2),
          this.noZerosValidator,
          Validators.maxLength(3),
          Validators.min(10),
        ]),
      ],
      postPrandial: [
        this.data?.mode === 'edit' ? this.data?.edit.postPrandial : null,
        Validators.compose([
          Validators.minLength(2),
          this.noZerosValidator,
          Validators.maxLength(3),
          Validators.min(10),
        ]),
      ],
      randomSugar: [
        this.data?.mode === 'edit' ? this.data?.edit.randomSugar : null,
        Validators.compose([
          Validators.minLength(2),
          this.noZerosValidator,
          Validators.maxLength(3),
          Validators.min(10),
        ]),
      ],
      clinicBloodPressure: [
        this.data?.mode === 'edit' ? this.data?.edit.clinicBloodPressure : null,
        Validators.compose([
          Validators.required,
          this.noZerosValidator,
          Validators.pattern(/^\d{2,3}\/\d{2,3}$/),
        ]),
      ],
      clinicPulseRate: [
        this.data?.mode === 'edit' ? this.data?.edit.cinicPulseRate : null,
        Validators.compose([
          Validators.required,
          this.noZerosValidator,
          Validators.max(200),
          Validators.min(10),
        ]),
      ],
      // patientUnderMedication: [
      //   this.data?.mode === 'edit'
      //     ? this.data?.edit.patientUnderMedication
      //     : null,
      //   Validators.compose([Validators.required]),
      // ],
      baselineSystolic: [
        this.data?.mode === 'edit' ? this.data?.edit.baselineSystolic : '',
        Validators.compose([
          Validators.required,
          Validators.min(30),
          Validators.max(500),
        ]),
      ],
      baselineDiastolic: [
        this.data?.mode === 'edit' ? this.data?.edit.baselineDiastolic : '',
        Validators.compose([
          Validators.required,
          Validators.min(30),
          Validators.max(500),
        ]),
      ],
    });
    if (this.data?.mode === 'ADD') {
      const dynamicToDate = this.caregiverSharedservice.formatDate(
        this.today ? this.today : this.today
      );
      const dynamicToTime = new Date(
        this.today ? this.today : this.today
      ).toTimeString();
      const filterfromDate =
        dynamicToDate + 'T' + dynamicToTime.substring(0, 8);
      const newDate = this.datePipe.transform(filterfromDate, 'yyyy-MM-dd');

      const body = {
        dateFrom: newDate,
      };
      this.service.getLatestDiagnosticList(this.patientId, body).subscribe(
        (data) => {
          this.diagnosisData = data?.diagnosis;
          this.diagnosticDialog
            .get('baselineSystolic')
            .setValue(this.diagnosisData.baselineSystolic);
          this.diagnosticDialog
            .get('height')
            .setValue(this.diagnosisData.height);
          this.diagnosticDialog
            .get('weight')
            .setValue(this.diagnosisData.weight);
          this.diagnosticDialog
            .get('clinicBloodPressure')
            .setValue(this.diagnosisData.clinicBloodPressure);
          this.diagnosticDialog
            .get('clinicPulseRate')
            .setValue(this.diagnosisData.cinicPulseRate);
          this.diagnosticDialog
            .get('baselineDiastolic')
            .setValue(this.diagnosisData.baselineDiastolic);
          // this.diagnosticDialog
          //   .get('patientUnderMedication')
          //   .setValue(this.diagnosisData.patientUnderMedication);
          //   this.diagnosticDialog
          //   .get('diagnosislist')
          //   .setValue(this.diagnosisData.diagnosisList);
          // this.diagnosticDialog
          //   .get('ldlLevels')
          //   .setValue(this.diagnosisData.ldllevels);
          // this.diagnosticDialog
          //   .get('randomSugar')
          //   .setValue(this.diagnosisData.randomSugar);
          // this.diagnosticDialog
          //   .get('postPrandial')
          //   .setValue(this.diagnosisData.postPrandial);
          // this.diagnosticDialog
          //   .get('fastingSugar')
          //   .setValue(this.diagnosisData.fastingSugar);
          // this.diagnosticDialog
          //   .get('hdlLevels')
          //   .setValue(this.diagnosisData.hdllevels);
          // this.diagnosticDialog
          //   .get('date')
          //   .setValue(this.diagnosisData.date);
          // this.diagnosticDialog
          //   .get('trilycerideLevels')
          //   .setValue(this.diagnosisData.triglyceridelevels);
          // this.diagnosticDialog
          //   .get('cholestralLevels')
          //   .setValue(this.diagnosisData.cholestrallevel);
          // this.diagnosticDialog
          //   .get('hba1c')
          //   .setValue(this.diagnosisData.hb1c);
        },
        (error) => {}
      );
    }
    if (this.data?.mode === 'edit') {
      this.diagnosticDialog.get('date').disable();
      this.diagnosticDialog.get('date').clearValidators();

      this.service.getdiagnosislist().subscribe((res) => {
        this.vitalsList = res.ICDCODES;
        this.vitalsList.filter((e) => {
          if (e.id === this?.data?.edit?.diagnosislist) {
            this.diagnosticDialog.get('diagnosislist').setValue(e);
          }
        });
      });
    }
  }
  getDiagnosticPatientList(id) {
    this.service
      .getDiagnosticListOfPatient(this.patientId)
      .subscribe((data) => {});
  }

  ngAfterViewInit(): void {
    this.caregiverSharedservice.triggerdDates.subscribe((value) => {
      this.patientId = localStorage.getItem('patientId');

      if (
        Object.keys(value).length &&
        (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
      ) {
        const dynamicFromDate = this.caregiverSharedservice.formatDate(
          value['from'] ? value['from'] : this.chartFromDate
        );
        const dynamicFromTime = new Date(
          value['from'] ? value['from'] : this.chartFromDate
        ).toTimeString();
        const dynamicToDate = this.caregiverSharedservice.formatDate(
          value['to'] ? value['to'] : this.chartToDate
        );
        const dynamicToTime = new Date(
          value['to'] ? value['to'] : this.chartToDate
        ).toTimeString();
        (this.filterfromDate =
          dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8)),
          (this.filterToDate =
            dynamicToDate + 'T' + dynamicToTime.substring(0, 8)),
          this.getDiagnosticPatientList(
            this.patientId
            // this.filterfromDate,
            // this.filterToDate
          );
      } else if (Object.keys(value).length && value.hasOwnProperty('id')) {
        this.getDiagnosticPatientList(
          value['id']
          //  this.chartFromDate, this.chartToDate
        );
      } else {
        this.getDiagnosticPatientList(
          this.patientId
          // this.chartFromDate,
          // this.chartToDate
        );
      }
    });
  }

  fromDateChange(e) {
    const dynamicToDate = this.caregiverSharedservice.formatDate(
      e ? e : this.today
    );
    const dynamicToTime = new Date(e ? e : this.today).toTimeString();

    const filterfromDate = dynamicToDate + 'T' + dynamicToTime.substring(0, 8);
    const newDate = this.datePipe.transform(filterfromDate, 'yyyy-MM-dd');

    const body = {
      dateFrom: newDate,
    };
    this.service
      .getLatestDiagnosticList(this.patientId, body)
      .subscribe((res) => {
        if (Object.keys(res?.diagnosis).length) {
          // const pastActivityDialog: MatDialogConfig = {
          //   disableClose: true,
          //   maxWidth: '100vw',
          //   maxHeight: '110vh',
          //   width: '300px',
          //   data: { title: `Vitals already exist for ${newDate}` },
          // };
          // // The user can't close the dialog by clicking outside its body
          // this.dialog
          //   .open(ExistDiagnosisComponent, pastActivityDialog)
          //   .afterClosed()
          //   .subscribe((e) => {
          //     this.diagnosticDialog.get('date').setValue(this.today);
          //   });
          this.diagnosticDialog
            .get('baselineSystolic')
            .setValue(res?.diagnosis.baselineSystolic);
          this.diagnosticDialog.get('height').setValue(res?.diagnosis.height);
          this.diagnosticDialog.get('weight').setValue(res?.diagnosis.weight);
          this.diagnosticDialog
            .get('clinicBloodPressure')
            .setValue(res?.diagnosis.clinicBloodPressure);
          this.diagnosticDialog
            .get('clinicPulseRate')
            .setValue(res?.diagnosis.cinicPulseRate);
          this.diagnosticDialog
            .get('baselineDiastolic')
            .setValue(res?.diagnosis.baselineDiastolic);
          // this.diagnosticDialog
          //   .get('patientUnderMedication')
          //   .setValue(res?.diagnosis.patientUnderMedication);
        } else {
          this.diagnosticDialog.get('baselineSystolic').reset();
          this.diagnosticDialog.get('height').reset();
          this.diagnosticDialog.get('weight').reset();
          this.diagnosticDialog.get('clinicBloodPressure').reset();
          this.diagnosticDialog.get('clinicPulseRate').reset();
          this.diagnosticDialog.get('baselineDiastolic').reset();
          // this.diagnosticDialog.get('patientUnderMedication').reset();
        }
      });
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  noZerosValidator(control: FormControl) {
    const value = control.value;
    if (value == 0 && control.value.length > 0) {
      return { zeros: true };
    }
    return null;
  }
  onSelectionChange(event: any): void {
    // Update the selected value and perform any additional logic
    this.selectedValue = event.value;
    // You might also include code here to close the dropdown
  }
  DiagnosisErr() {
    return this.diagnosticDialog.get('diagnosislist').hasError('min')
      ? 'Enter minimum 3 characters'
      : this.diagnosticDialog.get('diagnosislist').hasError('max')
      ? 'Enter maximum 50 characters'
      : this.diagnosticDialog.get('diagnosislist').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.diagnosticDialog.get('diagnosislist').hasError('maxlength')
      ? 'Enter maximum 50 characters'
      : this.diagnosticDialog.get('diagnosislist').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : // :this.diagnosticDialog.get('diagnosislist').hasError('required')
        // ? 'Diagnosis is required'
        '';
  }
  getErrorHba1c() {
    return this.diagnosticDialog.get('hba1c').hasError('min')
      ? 'HbA1C should not be less than 1'
      : this.diagnosticDialog.get('hba1c').hasError('max')
      ? 'HbA1C should not be greater than 99'
      : this.diagnosticDialog.get('hba1c').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : // this.diagnosticDialog?.controls?.hba1c?.errors
        //   ? 'Give valid HbA1C (Percent)'
        '';
  }
  getErrorBP(): any {
    if (
      /^\d{2,3}\/\d{2,3}$/.test(
        this.diagnosticDialog.get('clinicBloodPressure').value
      )
    ) {
    } else if (this.diagnosticDialog.get('clinicBloodPressure').value) {
      this.showBPError = true;
    }
    return this.diagnosticDialog.get('clinicBloodPressure').hasError('required')
      ? 'Clinic Blood Pressure is required'
      : this.diagnosticDialog.get('clinicBloodPressure').hasError('pattern')
      ? 'Enter valid BP'
      : this.diagnosticDialog.get('clinicBloodPressure').hasError('zeros')
      ? 'Only zero is not allowed.'
      : '';
  }
  onlyNumbersDecimal(event: any) {
    const inputChar = event.key;
    if (/^[0-9.]+$/.test(inputChar)) {
      return true;
    } else {
      event.stopImmediatePropagation();
      return false;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.diagnosticDialog.invalid) {
      this.submitted = false;
      return;
    }
    console.log(this.diagnosticDialog.value.date, this.default);

    // var d = new Date(this.diagnosticDialog.value.date);
    // d.setHours(d.getHours() + 5);
    // d.setMinutes(d.getMinutes() + 30);
    // var currentTime = new Date();
    // d.setHours(currentTime.getHours());
    // d.setMinutes(currentTime.getMinutes());

    // const newDate = this.datePipe.transform(
    //   this.diagnosticDialog.value.date,
    //   'yyyy-MM-dd'
    // );
    // this.currentTimeISO = formatDate(this.selectedDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    var isoString = this.datePipe.transform(
      this.default,
      'yyyy-MM-ddTHH:mm:ss'
    );

    const body = {
      date: isoString,
      diagnosislist: this.diagnosticDialog.value.diagnosislist
        ? this.diagnosticDialog.value.diagnosislist.id
          ? this.diagnosticDialog.value.diagnosislist.id
          : this.diagnosticDialog.value.diagnosislist
        : null,
      baselineDiastolic: this.diagnosticDialog.value.baselineDiastolic,
      baselineSystolic: this.diagnosticDialog.value.baselineSystolic,
      cholestralLevels: this.diagnosticDialog.value.cholestralLevels
        ? this.diagnosticDialog.value.cholestralLevels
        : null,
      clinicBloodPressure: this.diagnosticDialog.value.clinicBloodPressure,
      clinicPulseRate: this.diagnosticDialog.value.clinicPulseRate,
      fastingSugar: this.diagnosticDialog.value.fastingSugar
        ? this.diagnosticDialog.value.fastingSugar
        : null,
      hba1c: this.diagnosticDialog.value.hba1c
        ? this.diagnosticDialog.value.hba1c
        : null,
      height: this.diagnosticDialog.value.height,
      ldlLevels: this.diagnosticDialog.value.ldlLevels
        ? this.diagnosticDialog.value.ldlLevels
        : null,
      // patientUnderMedication:
      //   this.diagnosticDialog.value.patientUnderMedication,
      postPrandial: this.diagnosticDialog.value.postPrandial
        ? this.diagnosticDialog.value.postPrandial
        : null,
      randomSugar: this.diagnosticDialog.value.randomSugar
        ? this.diagnosticDialog.value.randomSugar
        : null,
      triglycerideLevels: this.diagnosticDialog.value.triglycerideLevels
        ? this.diagnosticDialog.value.triglycerideLevels
        : null,
      weight: this.diagnosticDialog.value.weight,
      hdlLevels: this.diagnosticDialog.value.hdlLevels
        ? this.diagnosticDialog.value.hdlLevels
        : null,
    };

    if (this.data?.mode === 'ADD') {
      this.service.addDiagnostic(this.patientId, body).subscribe(
        (res) => {
          this.snackBar.success('Health Parameters added successfully!');
          this.diagnosticDialog.reset();
          this.dialogRef.close(true);
          this.submitted = false;
          this.patientHeader.getDiagnosticDetails(this.patientId);
          this.caregiverSharedservice.changePatientCardData(true);
        },
        (error) => {
          this.submitted = false;

          if (error.err === 409) {
            this.snackBar.error(error.message);
          }
        }
      );
    } else {
      this.service.updateDiagnostic(this.data?.providerId, body).subscribe(
        (res) => {
          this.snackBar.success('Health Parameters updated successfully!');
          this.diagnosticDialog.reset();
          this.dialogRef.close(true);
          this.submitted = false;
          this.patientHeader.this.getObsById(this.patientId);
        },
        (error) => {
          this.submitted = false;
          if (error.err === 409) {
            this.snackBar.error(error.message);
          }
        }
      );
    }
  }
  // dispdia() {
  //   return (val) => this.formatdia(val);
  // }
  // formatdia(_val) {
  //   if (_val) {
  //     return _val.icdName;
  //   }
  //   return '';
  // }
  dispdia() {
    return (val) => this.formatdia(val);
  }
  formatdia(_val) {
    if (_val) {
      return _val.icdName;
    }
    return '';
  }

  filterDiagnosis() {
    this.vitalsList = [];
    if (
      this.diagnosticDialog.controls['diagnosislist']?.value?.length > 2 &&
      this.diagnosticDialog.controls['diagnosislist']?.value?.length < 51
    ) {
      this.service
        .getdiagnosislistNames(
          this.diagnosticDialog.controls['diagnosislist']?.value
        )
        .subscribe((res) => {
          this.vitalsList = res.ICDCODES;
        });
    }
  }
  keyUp(event): any {
    event.target.value = event.target.value.trim();
  }
  // DiagnosticHist(id, fDate, tDate) {
  //   const body = {
  //     dateFrom: fDate,
  //     dateTo: tDate,
  //   };
  //   this.service.getDiagnosticList(id, body).subscribe(
  //     (data) => {
  //       this.dataSource = data?.content;
  //     },
  //     (err) => {
  //       // this.snackbarService.error(err.message);
  //     }
  //   );
  // }
  limitKeypress(event, value, maxLength) {
    if (value != undefined && value.toString().length >= maxLength) {
      event.preventDefault();
    }
  }
  closeDiagnostic() {
    this.dialogRef.close();
  }
  changeEvent(evt) {
    this.scheduleDate = evt.value;
  }
  validateTextHeight(evt) {
    if (evt.target.value.length === 0) {
      this.keyEventHeight = [];
    } else {
      this.keyEventHeight.push(evt.data);
    }
  }
  validateTextWeight(evt) {
    if (evt.target.value.length === 0) {
      this.keyEventWeight = [];
    } else {
      this.keyEventWeight.push(evt.data);
    }
  }
  validateTextBP() {
    this.bpValue = this.diagnosticDialog.get('clinicBloodPressure').value;
    this.bpArray.push(this.bpValue);

    if (
      this.bpArray[this.bpArray.length - 1].split('/')[0]?.charAt(0) === '0' ||
      this.bpArray[this.bpArray.length - 1].split('/')[0]?.length < 2
    ) {
      this.showBPError = true;
    } else if (
      this.bpArray[this.bpArray.length - 1].split('/')[1]?.charAt(0) === '0' ||
      this.bpArray[this.bpArray.length - 1].split('/')[1]?.length < 2
    ) {
      this.showBPError = true;
    } else {
      this.showBPError = false;
    }
    // const value= this.bpValue.split('/');
  }
  onInput(event: any) {
    const inputChar = event.key;
    if (/^[0-9/]+$/.test(inputChar)) {
      return true;
    } else {
      event.stopImmediatePropagation();
      return false;
    }
  }
}
