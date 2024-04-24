import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DeviceTypeAddComponent } from 'src/app/device-management/device-type/device-type-add/device-type-add.component';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';
import { LogHistoryComponent } from 'src/app/reports/log-history/log-history/log-history.component';
import { DiseaseService } from 'src/app/settings-management/services/disease.service';

@Component({
  selector: 'app-ticket-title-dialog',
  templateUrl: './ticket-title-dialog.component.html',
  styleUrls: ['./ticket-title-dialog.component.scss'],
})
export class TicketTitleDialogComponent implements OnInit {
  deviceTypeForm: FormGroup;
  // specialityList[]:any=[a,b];
  isSubmitted = false;
  specialityList: any;
  array: any;
  updatePermissions: any = [];
  // saw2pecialityList=['doctor','caregiver']

  initializeCreateDeviceForm() {
    // const ticketName = /^[a-zA-Z0-9][a-zA-Z0-9]*$/
    this.deviceTypeForm = this.fb.group({
      supportTicketQuestions: [
        this.data.supportTicketQuestions,
        [
          Validators.required,
          // Validators.pattern(ticketName),
          Validators.minLength(3),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ],
      ],
      // type: ["", Validators.required]
      // vendor: ["", Validators.required],
      // manfdate: ["", Validators.required],
      // version: ["", Validators.required],
      userPermissions: [
        this.data.userPermission
          ? this.data.userPermission.split(',').map((res) => res)
          : '',
        Validators.required,
      ],
    });
  }
  // this.doctorsDialog
  // .get('specializations')
  // .setValue(
  //   parsedData?.specializations
  //     .split(',')
  //     .map((specializations: any[]) => specializations)
  // );

  // statuslist = [
  // 	{ value: "Active", viewValue: "Active" },
  // 	{ value: "Inactive", viewValue: "Inactive" },
  // ];
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeviceTypeAddComponent>,
    private diseaseService: DiseaseService,
    private snackBar: SnackbarService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.initializeCreateDeviceForm();
    this.getUser();
    // this.getAllSpeciality();
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  defaultErr() {
    return this.deviceTypeForm
      .get('supportTicketQuestions')
      .hasError('required')
      ? 'Default Issue is required'
      : this.deviceTypeForm.get('supportTicketQuestions').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : // : this.deviceTypeForm.get('supportTicketQuestions').hasError('pattern')
      //   ? 'First later can not be space'
      this.deviceTypeForm.get('supportTicketQuestions').hasError('minlength')
      ? 'Min 3 characters is required'
      : this.deviceTypeForm.get('supportTicketQuestions').hasError('maxlength')
      ? 'Max length should be 50 characters'
      : '';
  }

  getUser() {
    this.diseaseService.getUserRole().subscribe(
      (res) => {
        this.specialityList = res;
      },
      (error) => {}
    );
  }

  // getAllSpeciality(): void {
  //   this.doctorService.getSpecialization().subscribe((data: any) => {
  //     this.specialityList = data;
  //   });
  // }

  createTicketTitle() {
    this.isSubmitted = true;
    // let text = fruits
    const text = this.deviceTypeForm.value.userPermissions.toString();

    const body = {
      supportTicketQuestions: {
        supportTicketQuestions:
          this.deviceTypeForm.value.supportTicketQuestions.trim(),
      },
      userPermissions: text,
    };
    if (this.data === 'add') {
      this.diseaseService.createTicketTitle(body).subscribe(
        (res) => {
          this.snackBar.success('Default Issue added successfully', 2000);
          this.isSubmitted = true;
          this.dialogRef.close(true);
        },
        (error) => {
          this.isSubmitted = false;
          // this.snackBar.error(error.message);
        }
      );
    } else {
      this.diseaseService.editTicketTitle(body, this.data.questionId).subscribe(
        (res) => {
          this.isSubmitted = true;

          this.snackBar.success('Default Issue edited successfully', 2000);
          this.dialogRef.close(true);
        },
        (error) => {
          this.isSubmitted = false;

          // this.snackBar.error(error.message);
        }
      );
    }
  }
}
