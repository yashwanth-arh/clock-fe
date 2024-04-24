import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserProfileService } from './service/user-profile.service';
import { LocationService } from '../core/services/location.service';
import { Observable, Subject } from 'rxjs';
import { UserRoles } from '../shared/entities/user-roles.enum';
import { User } from '../shared/models/user.model';
import { AuthService } from '../core/services/auth.service';
import { Profile } from './entities/user-profile';
import { SnackbarService } from '../core/services/snackbar.service';
import { confirmControlValidatorAsync } from '../core/validators/custom-validators';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent implements OnInit, OnDestroy {
  public profile: FormGroup;
  public editMode = false;
  public resetForm: FormGroup;

  city: string[] = [];
  CityFilteredOptions: Observable<any>;
  state: string[] = [];

  public selectedRole: UserRoles;
  public userRoles = UserRoles;
  public userDetails: any;
  public username: string;
  public destroyed = new Subject();

  constructor(
    public fb: FormBuilder,
    public userService: UserProfileService,
    public locationService: LocationService,
    public authService: AuthService,
    public userProfileService: UserProfileService,
    public snackBarService: SnackbarService
  ) {
    this.authService.user.subscribe((user: User) => {
      this.selectedRole = user?.userDetails?.userRole;
      const phoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      const zipCode = /^([0-9]{5})$/;
      if (this.selectedRole === this.userRoles.RPM_ADMIN) {
        this.profile = this.fb.group({
          name: ['', Validators.required],
          emailId: ['', Validators.required],
          contactNumber: [
            '',
            [Validators.required, Validators.pattern(phoneNumber)],
          ],
        });
      } else {
        this.profile = this.fb.group({
          name: ['', Validators.required],
          emailId: ['', Validators.required],
          homeNumber: [
            '',
            [Validators.required, Validators.pattern(phoneNumber)],
          ],
          cellNumber: [
            '',
            [Validators.required, Validators.pattern(phoneNumber)],
          ],
          addressLine: ['', Validators.required],
          state: ['', Validators.required],
          city: ['', Validators.required],
          zipCode: ['', [Validators.required, Validators.pattern(zipCode)]],
        });
      }
    });

    this.resetForm = this.fb.group({
      existingPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(2)]],
      confirmPassword: [
        '',
        Validators.required,
        confirmControlValidatorAsync('newPassword'),
      ],
    });
  }

  ngOnInit(): void {
    this.authService.user.subscribe((user: User) => {
      this.selectedRole = user?.userDetails?.userRole;
      this.username = user?.userDetails?.username;
    });

    this.locationService.getJSONData().subscribe((res: any) => {
      this.state = Object.keys(res);
    });

    // this.userService.getUserDetails().subscribe((data) => {
    //   this.userDetails = data;
    //   this.patchForm(this.selectedRole, this.userDetails);
    // });

    this.resetForm
      .get('newPassword')
      .valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.resetForm
          .get('confirmPassword')
          .updateValueAndValidity({ onlySelf: false, emitEvent: true });
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  toggleEditMode(): boolean {
    return (this.editMode = !this.editMode);
  }

  get confirmPassowrd(): FormControl {
    return this.resetForm.get('confirmPassword') as FormControl;
  }

  getErrorEmail(): any {
    return this.profile.get('emailId').hasError('required')
      ? 'Email Id is required'
      : this.profile.get('emailId').hasError('pattern')
      ? 'Not a valid email address'
      : this.profile.get('emailId').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : '';
  }

  getErrorHomeNo(): any {
    return this.profile.get('homeNumber').hasError('required')
      ? 'Home number is required'
      : this.profile.get('homeNumber').hasError('pattern')
      ? 'Please, Enter 10 digit Home Number'
      : '';
  }

  getErrorCellNo(): any {
    return this.profile.get('cellNumber').hasError('required')
      ? 'Cell number is required'
      : this.profile.get('cellNumber').hasError('pattern')
      ? 'Please, Enter 10 digit Cell Number'
      : '';
  }

  getErrorZipCode(): any {
    return this.profile.get('zipCode').hasError('required')
      ? 'Zip Code is required'
      : this.profile.get('zipCode').hasError('pattern')
      ? 'Please, Enter 5 digit Zip Code'
      : '';
  }
  getErrorContactNo(): any {
    return this.profile.get('contactNumber').hasError('required')
      ? 'contact Number is required'
      : this.profile.get('contactNumber').hasError('pattern')
      ? 'Please, Enter 10 digit Home Number'
      : '';
  }

  passwordMatchValidator(): any {
    return this.resetForm.get('confirmPassword').hasError('required')
      ? 'Confirm password is required'
      : this.resetForm.get('newPassword').value ===
        this.resetForm.get('confirmPassowrd').value
      ? 'Confirm password not matching'
      : '';
  }

  onStateSelection(event: any): any {
    this.city = [];
    // this.locationService.getFilteredJSONData(event).subscribe((data: any[]) => {
    //   this.city = data;
    // });
  }

  patchForm(role: UserRoles, data: Profile): void {
    if (role === this.userRoles.RPM_ADMIN) {
      this.profile.setValue({
        name: data.userProfile.name,
        emailId: this.username,
        contactNumber: data.userProfile.cellNumber,
      });
    } else {
      this.profile.setValue({
        name: data.userProfile.name,
        emailId: this.username,
        cellNumber: data.userProfile.cellNumber,
        homeNumber: data.userProfile.homeNumber,
        addressLine: data.userProfile.address.addressLine,
        state: data.userProfile.address.state,
        city: data.userProfile.address.city,
        zipCode: data.userProfile.address.zipCode,
      });
    }
  }

  onSubmit(): void {
    if (this.profile.invalid) {
      return;
    }
    const formValue = this.profile.value;
    let body: any;
    if (this.selectedRole === this.userRoles.RPM_ADMIN) {
      body = {
        userProfile: {
          name: formValue.name,
          emailId: formValue.emailId,
          contactNumber: formValue.contactNumber,
        },
      };
    } else {
      body = {
        userProfile: {
          address: {
            state: formValue.state,
            city: formValue.city,
            addressLine: formValue.addressLine,
            zipCode: formValue.zipCode,
          },
          name: formValue.name,
          emailId: formValue.emailId,
          homeNumber: formValue.homeNumber,
          cellNumber: formValue.cellNumber,
        },
      };
    }

    this.userProfileService.updateUserDetails(body).subscribe(
      () => {
        this.snackBarService.success('Updated successfully!', 2000);
      },
      () => {
        this.snackBarService.error('Update Failed!', 2000);
      }
    );
  }

  onResetPassword(): void {
    if (this.resetForm.invalid) {
      return;
    }
    const formValue = this.resetForm.value;

    this.userProfileService.resetPassword(formValue).subscribe(
      () => {
        this.snackBarService.success('Reset password successfully!', 2000);
      },
      () => {
        this.snackBarService.error('Reset Failed!', 2000);
      }
    );
  }
}
