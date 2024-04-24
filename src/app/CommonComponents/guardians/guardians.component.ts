import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';
import { emailRx, maskRx, phoneNumberRx } from 'src/app/shared/entities/routes';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-guardians',
  templateUrl: './guardians.component.html',
  styleUrls: ['./guardians.component.scss'],
})
export class GuardiansComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'emailID',
    'contactNumber',
    'relationship',
    // 'actions',
  ];
  dataSource: any;
  length = 0;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 100];
  showEdit: boolean = false;
  isSubmitted = false;
  updateGuadian = false;
  patientId: string;
  guardianId: string;
  queryParamsValues: any;
  guadianName: any;
  public guadianForm: FormGroup;
  relationship: any;
  relation: any;
  existingEmail: any;
  user: any;
  guardianDetails: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private service: CaregiverDashboardService,
    private caregiverSharedService: CaregiverSharedService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {
    this.user = this.auth.authData;
  }

  ngOnInit(): void {
    this.caregiverSharedService.triggeredHeaderTitle.next('Guardians');
    const name = /^[a-zA-Z.'\s]*$/;
    this.guadianForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          // Validators.pattern(name),
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(emailRx)],
        Validators.composeAsync([
          (control: AbstractControl) => {
            if (this.existingEmail === control.value) {
              return of(null);
            }

            if (control.value) {
              return EmailNotTaken.createValidator(this.auth)(control);
            } else {
              return of(null); // Return a resolved observable when not enough characters are entered
            }
          },
        ]),
      ],
      contactNo: ['', [Validators.required, Validators.pattern(phoneNumberRx)]],
      relationship: ['', Validators.required],
    });

    this.route.data.subscribe((res) => {
      // this.route.queryParams.subscribe((params) => {
      this.activatedRoute.queryParams.subscribe((params) => {
        this.queryParamsValues = params;
        this.patientId = this.queryParamsValues.patientId;
        this.guadianName = params.name;
      });
    });
    this.getGuardians(this.patientId, this.pageIndex, this.pageSize);
    this.getRelationShip();
  }
  viewGuardians(): void {
    this.router.navigate(['/careproviderDashboard/totalPatients']);
  }
  getErrorName(): any {
    return this.guadianForm.get('name').hasError('required')
      ? 'Name is required'
      : // : this.guadianForm.get('name').hasError('pattern')
      // ? 'Only alphabets,space are allowed'
      this.guadianForm.get('name').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.guadianForm.get('name').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : null;
  }
  getErrorContactNo(): any {
    return this.guadianForm.get('contactNo').hasError('required')
      ? 'Contact Number is required'
      : this.guadianForm.get('contactNo').hasError('pattern')
      ? 'Enter 10 digit valid Contact Number'
      : null;
  }
  getErrorEmail(): any {
    return this.guadianForm.get('email').hasError('required')
      ? 'Email is required'
      : this.guadianForm.get('email').hasError('pattern')
      ? 'Not a valid email address'
      : this.guadianForm.get('email').hasError('emailExists')
      ? 'This email address is already in use'
      : '';
  }
  get email(): FormControl {
    return this.guadianForm.get('email') as FormControl;
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  openMedicationForm() {
    this.updateGuadian = false;
    this.guadianForm.reset();
    // this.removeValidators();
    this.guadianForm.get('email').reset();
    this.guadianForm.get('name').reset();
    this.guadianForm.get('email').enable();
    this.guadianForm.get('name').enable();
    this.showEdit = false;
  }
  getGuardians(id, pageNumber, pageSize) {
    this.service.getGuardianList(id, pageNumber, pageSize).subscribe((data) => {
      this.dataSource = data?.content;
      this.length = data?.totalElements;
    });
  }
  handlePageEvent(event: PageEvent): void {
    // this.table.nativeElement.scrollIntoView();
    this.length = event.length;
    this.getGuardians(this.patientId, event.pageIndex, event.pageSize);
  }
  getRelationShip() {
    this.service.getGuardianRelationList().subscribe((data) => {
      this.relationship = data.content;
      if (this.showEdit) {
        this.relationship.map((e) => {
          if (e?.id === this.relation) {
            this.guadianForm.get('relationship').setValue(e?.id);
          }
        });
      }
    });
  }
  getGuardianDetails(e) {
    if (e.target.value.length > 9) {
      this.service
        .getGuardianDetailsByContactNo(this.guadianForm.get('contactNo').value)
        .subscribe((res) => {
          this.guardianDetails = res?.content;

          if (this.guardianDetails) {
            this.existingEmail = this.guardianDetails?.email;
            this.guadianForm.get('email').setValue(this.guardianDetails?.email);
            this.guadianForm
              .get('name')
              .setValue(this.guardianDetails?.fullName);
            this.guadianForm.get('email').disable();
            this.guadianForm.get('name').disable();
            // this.relationship.map((e) => {
            //   if (e?.id === this.guardianDetails.relation) {
            //     this.guadianForm.get('relationship').setValue(e?.id);
            //   }
            // });
          }
        });
    } else {
      this.guadianForm.get('email').reset();
      this.guadianForm.get('name').reset();
      this.guadianForm.get('email').enable();
      this.guadianForm.get('name').enable();
    }
  }
  editMedication(ele) {
    // this.guadianForm.get('email').clearAsyncValidators();
    this.showEdit = true;
    // this.newMedication = !this.newMedication;
    this.guardianId = ele.guardianId;
    this.existingEmail = ele.email;

    this.guadianForm.get('name').setValue(ele.guardianFullName);
    this.guadianForm.get('email').setValue(ele.email);
    this.guadianForm.get('contactNo').setValue(ele.mobileNumber);
    // this.guadianForm.get('relationship').setValue(ele.patientRelations);
    // this.medicationId = ele.id;
    this.relation = ele.patientRelation;
    this.getRelationShip();
    this.updateGuadian = true;
  }
  createGuadian(valid, value, data) {
    const body = {
      fullName: this.guadianForm.get('name').value,
      email: this.guadianForm.get('email').value,
      mobileNumber: this.guadianForm.value.contactNo,
      patientId: this.patientId,
      relation: this.guadianForm.value.relationship,
    };
    this.isSubmitted = true;
    if (!this.showEdit) {
      this.service.addGuardian(body).subscribe(
        (data) => {
          this.isSubmitted = false;
          this.snackbarService.success('Guardian added successfully');
          this.guadianForm.reset();
          this.guadianForm.get('email').enable();
          this.guadianForm.get('name').enable();
          this.getGuardians(this.patientId, this.pageIndex, this.pageSize);
        },
        (err) => {
          this.isSubmitted = false;
        }
      );
    } else {
      this.service.editGuardian(body, this.guardianId).subscribe(
        (res) => {
          this.isSubmitted = false;
          this.snackbarService.success('Guardian updated successfully');
          this.getGuardians(this.patientId, this.pageIndex, this.pageSize);
          this.guadianForm.reset();
          this.showEdit = false;
        },
        (err) => {
          this.isSubmitted = false;
        }
      );
    }
  }
}
