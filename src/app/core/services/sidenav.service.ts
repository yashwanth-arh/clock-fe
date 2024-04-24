import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/entities/user-profile';
import { phoneNumberRx } from 'src/app/shared/entities/routes';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  public navExpanded: BehaviorSubject<boolean>;
  public profileDrawerOpened: BehaviorSubject<boolean>;
  public profilePhoto = new BehaviorSubject<string>('');
  public loggedInUserDetails = new BehaviorSubject<UserProfile>(null);

  public phoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  public zipCode = /^([0-9]{5})$/;

  constructor(private fb: FormBuilder) {
    this.navExpanded = new BehaviorSubject<boolean>(true);
    this.profileDrawerOpened = new BehaviorSubject<boolean>(false);
  }

  setNavExpanded(value: boolean): void {
    this.navExpanded.next(value);
  }

  get expanded(): Observable<boolean> {
    return this.navExpanded.asObservable();
  }

  get isExpanded(): boolean {
    return this.navExpanded.value;
  }

  /** Side nav for edit profile */
  setProfileOpened(value: boolean): void {
    this.profileDrawerOpened.next(value);
  }

  get drawerOpened(): Observable<boolean> {
    return this.profileDrawerOpened.asObservable();
  }

  /** Setting profile image when edit profile toggles */
  setProfileImage(value): void {
    this.profilePhoto.next(value);
  }

  get profileImage(): Observable<string> {
    return this.profilePhoto.asObservable();
  }

  /** Sets user details in edit profile form when edit screen toggles */
  setUserDetails(value: UserProfile): void {
    this.loggedInUserDetails.next(value);
  }

  get userDetails(): Observable<UserProfile> {
    return this.loggedInUserDetails.asObservable();
  }

  userProfileInfo(): UserProfile {
    return this.loggedInUserDetails.value;
  }

  public generateProfileFormBasedOnRole(
    role: string,
    outputForm: FormGroup,
    prefillData: any
  ): FormGroup {
    const roleIdx = role.toUpperCase();
    outputForm = new FormGroup({});
    switch (roleIdx) {
      case 'BRANCH_USER':
        outputForm = this.fb.group({
          firstName: [
            prefillData?.firstName ? prefillData.firstName : '',
            Validators.required,
          ],
          lastName: [
            prefillData?.lastName ? prefillData.lastName : '',
            Validators.required,
          ],
          middleName: [prefillData?.middleName ? prefillData.middleName : ''],
          contactNumber: [
            prefillData?.contactNumber ? prefillData.contactNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
        });
        break;
      case 'hospital_USER':
        outputForm = this.fb.group({
          firstName: [
            prefillData?.firstName ? prefillData.firstName : '',
            Validators.required,
          ],
          lastName: [
            prefillData?.lastName ? prefillData.lastName : '',
            Validators.required,
          ],
          middleName: [prefillData?.middleName ? prefillData.middleName : ''],
          contactNumber: [
            prefillData?.contactNumber ? prefillData.contactNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
        });
        break;
      case 'DOCTOR':
        outputForm = this.fb.group({
          name: [
            prefillData?.name ? prefillData.name : '',
            Validators.required,
          ],
          homeNumber: [
            prefillData?.homeNumber ? prefillData.homeNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
          cellNumber: [
            prefillData?.cellNumber ? prefillData.cellNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
        });
        break;
      case 'RPM_ADMIN':
        outputForm = this.fb.group({
          name: [
            prefillData?.name ? prefillData.name : '',
            Validators.required,
          ],
        });
        break;
      case 'BILLER':
        outputForm = this.fb.group({
          firstName: [
            prefillData?.firstName ? prefillData.firstName : '',
            Validators.required,
          ],
          lastName: [
            prefillData?.lastName ? prefillData.lastName : '',
            Validators.required,
          ],
          middleName: [prefillData?.middleName ? prefillData.middleName : ''],
          contactNumber: [
            prefillData?.contactNumber ? prefillData.contactNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
        });
        break;
      default:
        outputForm = this.fb.group({});
        break;
    }

    return outputForm;
  }

  public patchProfileFormBasedOnRole(
    role: string,
    outputForm: FormGroup,
    prefillData: UserProfile
  ): FormGroup {
    const roleIdx = role.toUpperCase();
    switch (roleIdx) {
      case 'BRANCH_USER':
        outputForm.patchValue({
          firstName: prefillData?.firstName ? prefillData.firstName : '',
          lastName: prefillData?.lastName ? prefillData.lastName : '',
          middleName: prefillData?.middleName ? prefillData.middleName : '',
          contactNumber: prefillData?.contactNumber
            ? prefillData.contactNumber
            : '',
        });
        // outputForm = this.fb.group({
        //   firstName: [prefillData?.firstName ? prefillData.firstName : '', Validators.required],
        //   lastName: [prefillData?.lastName ? prefillData.lastName : '', Validators.required],
        //   middleName: [prefillData?.middleName ? prefillData.middleName : ''],
        //   contactNumber: [
        //     prefillData?.contactNumber ? prefillData.contactNumber : '',
        //     [Validators.required, Validators.pattern(phoneNumberRx)]],
        // });
        break;
      case 'hospital_USER':
        outputForm = this.fb.group({
          firstName: [
            prefillData?.firstName ? prefillData.firstName : '',
            Validators.required,
          ],
          lastName: [
            prefillData?.lastName ? prefillData.lastName : '',
            Validators.required,
          ],
          middleName: [prefillData?.middleName ? prefillData.middleName : ''],
          contactNumber: [
            prefillData?.contactNumber ? prefillData.contactNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
        });
        break;
      case 'DOCTOR':
        outputForm = this.fb.group({
          name: [
            prefillData?.name ? prefillData.name : '',
            Validators.required,
          ],
          homeNumber: [
            prefillData?.homeNumber ? prefillData.homeNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
          cellNumber: [
            prefillData?.cellNumber ? prefillData.cellNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
        });
        break;
      case 'RPM_ADMIN':
        outputForm = this.fb.group({
          name: [
            prefillData?.name ? prefillData.name : '',
            Validators.required,
          ],
        });
        break;
      case 'BILLER':
        outputForm = this.fb.group({
          firstName: [
            prefillData?.firstName ? prefillData.firstName : '',
            Validators.required,
          ],
          lastName: [
            prefillData?.lastName ? prefillData.lastName : '',
            Validators.required,
          ],
          middleName: [prefillData?.middleName ? prefillData.middleName : ''],
          contactNumber: [
            prefillData?.contactNumber ? prefillData.contactNumber : '',
            [Validators.required, Validators.pattern(phoneNumberRx)],
          ],
        });
        break;
      default:
        outputForm = this.fb.group({});
        break;
    }

    return outputForm;
  }
}
