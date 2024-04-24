import { AuthService } from 'src/app/core/services/auth.service';
import { ZipStateCityService } from './../../../core/services/zip-state-city.service';
import { InsuranceType } from './../../../shared/entities/insurance-type.enum';
import {
  Component,
  Directive,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PatientManagementService } from '../../service/patient-management.service';
import { Gender } from 'src/app/shared/entities/gender.enum';
import {
  emailRx,
  phoneNumberRx,
  maskRx,
  ssnRx,
  aadhaarNumberRx
} from 'src/app/shared/entities/routes';
import { Status } from 'src/app/settings-management/entities/cpt-code';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { Patient } from '../../entities/patient';
import { HospitalManagementService } from 'src/app/hospital-management/service/hospital-management.service';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { DiseaseService } from 'src/app/settings-management/services/disease.service';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { EmailNotTaken } from 'src/app/core/validators/async.email.validator';
import { LocationService } from 'src/app/core/services/location.service';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { DatePipe, formatDate } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
export interface ListItem {
  id: string;
  name: string;
}

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'DD/MM/YYYY',
//   },
//   display: {
//     dateInput: 'DD/MM/YYYY',
//     monthYearLabel: 'DD MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'DD MMMM YYYY',
//   },
// };
@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
  // providers: [
  //   // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
  //   // application's root module. We provide it at the component level here, due to limitations of
  //   // our example generation script.
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  //   },
  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ],
})
export class AddPatientComponent implements OnInit {
  public addPatientForm: FormGroup;
  /**
   * TODO Stepper forms
   */
  public mask = maskRx;

  public personalDetailsForm: FormGroup;
  public contactDetailsForm: FormGroup;
  public addressDetailsForm: FormGroup;
  public insuranceDetailsForm: FormGroup;
  public clinicDetailsForm: FormGroup;
  public healthDetailsForm: FormGroup;
  public EMRDetailsForm: FormGroup;
  public isEditable = false;
  public medicareForm: FormGroup;
  public otherInsurerForm: FormGroup;
  public address: FormGroup;
  public keyEventWeight = [];
  public keyEventHeight = [];
  /**
   * Set this value to true, to get a linear stepper
   */
  public isLinearStepper = true;
  public isSubmitted = false;
  public gender = Gender;
  public genderList = [];
  dia = 80;
  public insuranceType = InsuranceType;
  public insuranceTypeList = [];
  public state = [];
  branch = [];
  hospital = [];
  doctor = [];
  pdiseases = [];
  sdiseases = [];
  cptcode = [];
  tomorrow = new Date();
  city: string[] = [];
  CityFilteredOptions: Observable<any>;
  zipCode: string[] = [];
  zipCodeFilteredOptions: Observable<any>;
  minDate = new Date();
  ssnMask = ssnRx;
  today = new Date();
  /**
   * Disease auto complete chip list requirements
   */
  pvisible = true;
  pselectable = true;
  premovable = true;
  pseparatorKeysCodes: number[] = [ENTER, COMMA];
  filteredCodes: Observable<string[]>;
  svisible = true;
  sselectable = true;
  sremovable = true;
  protected currentPatient: Patient;
  sseparatorKeysCodes: number[] = [ENTER, COMMA];
  patUnderMedications: any = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];
  pcodes: string[] = [];
  scodes: string[] = [];
  pnames: string[] = [];
  snames: string[] = [];
  allCodes: string[] = [];
  primaryDiagnosisSelected = false;
  secondaryDiagnosisSelected = false;
  dateRestrict = new Date();
  primaryCodes: string;
  secondaryCodes: string;
  primaryNames: string;
  secondaryNames: string;
  userRole: string;
  inList: any = [];
  occupationList: any[] = [];
  BPRegex = /^\d{1,3}\/\d{1,3}$/;
  @ViewChild('primarycodeInput') primarycodeInput: ElementRef<HTMLInputElement>;
  @ViewChild('secondarycodeInput')
  secondarycodeInput: ElementRef<HTMLInputElement>;
  formattedAddress = '';

  showerror = false;
  submitted = false;
  bpValue: any;
  bpArray: any = [];
  showBPError = false;
  options: Options = new Options({
    types: [],
    componentRestrictions: { country: 'IN' },
  });
  // @ViewChild('pauto') matAutocomplete: MatAutocomplete;
  // @ViewChild('sauto') matAutocomplete: MatAutocomplete;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('search') searchTextBox: ElementRef;
  selectedValues = [];
  searchTextboxControl = new FormControl();
  keyUpObservable: any;
  clinicList: any;
  facilityI: any;
  facilitiesData: any = [];
  providerid: any;
  diagnosisData: any;
  diagnosis: boolean = false;
  onlyZeros: any;
  vitalsList: any;
  checkUserLoggedIn: boolean = false;
  filteredDataToSearch: any[] = [];
  careTeamToSearch: any[] = [];
  filteredOptions: Observable<any>;
  filteredOptionsProvider: Observable<any>;
  existingCareTeam: any[];
  existingProvider: any;
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private patientService: PatientManagementService,
    private snackBar: SnackbarService,
    private practiceService: HospitalManagementService,
    private branchService: BranchService,
    private diseaseService: DiseaseService,
    private ZipStateCityService: ZipStateCityService,
    private authService: AuthService,
    private locationService: LocationService,
    private branchservice: BranchService,
    private service: CaregiverDashboardService,
    public caregiversharedService: CaregiverSharedService,
    public datePipe: DatePipe
  ) {
    this.onlyZeros = /^(?!0+$)[\w\s\S]+$/;
    const currentYear = new Date().getFullYear();
    this.dateRestrict = new Date(currentYear - 8, 0, 31);
    const currentDate = new Date(); // Get the current date
    this.dateRestrict = new Date(
      currentDate.getFullYear() - 8,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const emailregex: RegExp = emailRx;
    this.today.setDate(this.today.getDate());
    const phoneNumber: RegExp = phoneNumberRx;
    const aadharNumber: RegExp = aadhaarNumberRx;
    
    const user = this.authService.authData;
    this.userRole = user?.userDetails?.userRole;
    this.providerid = user?.userDetails['scopeId'];
    // const currentDate = new Date();
    this.minDate = new Date(currentDate);
    this.minDate.setFullYear(currentDate.getFullYear() - 100);
    this.userRole;

    this.occupationList = [
      { name: 'Working', value: 'Working' },
      { name: 'Retired', value: 'Retired' },
      { name: 'Housewife', value: 'Housewife' },
      { name: 'Househusband', value: 'Househusband' },
      { name: 'Student', value: 'Student' },
      { name: 'Enterpreneur', value: 'Enterpreneur' },
      { name: 'Freelancer', value: 'Freelancer' },
      { name: 'Sportsperson', value: 'Sportsperson' },
      { name: 'Farmer', value: 'Farmer' },
      { name: 'Others', value: 'Others' },
    ];
    this.genderList = [
      { name: 'Male', value: 'MALE' },
      { name: 'Female', value: 'FEMALE' },
      { name: 'Transgender Male', value: 'TRANSGENDER_Male' },
      { name: 'Transgender Female', value: 'TRANSGENDER_Female' },
      {
        name: 'Transgender(as non-binary)',
        value: 'TRANSGENDER_AS_NON_BINARY',
      },
      { name: 'non-binary', value: 'NON_BINARY' },
      { name: 'Gender-queer', value: 'GENDER_QUEER' },
      { name: 'Two-spirit', value: 'TWO_SPIRIT' },
      { name: 'Dont want to disclose', value: 'DONT_WANT_TO_DISCLOSE' },
    ];

    this.insuranceTypeList = Object.keys(this.insuranceType);
    const storedData = JSON.parse(localStorage.getItem('storedData'));
    /**
     * Forms
     */
    // const zipCode = /^([0-9]{5})$/;
    const name = /^[a-zA-Z ]*$/;
    const zip = /^(?!0+$)\d+$/;
    const numberdecimal = /^[0-9.]+$/;

    // if (this.data?.mode === 'edit') {
    //   let dummy = [];
    //   this.data?.patient['careTeam'].map((e) => {
    //     let body = {
    //       firstName: e.firstName,
    //       id: e.id,
    //       Status: e.status,
    //     };
    //     dummy.push(body);
    //   });
    //   this.existingCareTeam = dummy;
    // }

    this.personalDetailsForm = this.fb.group({
      data,
      firstName: [
        storedData ? storedData.firstName : null,
        [
          Validators.required,
          Validators.pattern(name),
          // Validators.pattern(this.onlyZeros),
          Validators.minLength(3),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ],
      ],
      middleName: [
        storedData ? storedData.middleName : null,
        Validators.compose([
          Validators.nullValidator,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$'),
          // this.noWhitespaceValidator,
          // Validators.pattern(this.onlyZeros),
        ]),
      ],
      lastName: [
        storedData ? storedData.lastName : null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('^[a-zA-Z ]*$'),
          // Validators.pattern(this.onlyZeros),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ],
      ],
      dateOfBirth: [
        storedData ? storedData.dateOfBirth : null,
        Validators.compose([Validators.required]),
      ],
      age: [
        storedData ? storedData.age : null,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      gender: [
        storedData ? storedData.gender : null,
        Validators.compose([Validators.required]),
      ],
      occupation: [
        storedData ? storedData.occupation : null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z ]*$'),
          this.noWhitespaceValidator,
          // Validators.pattern(this.onlyZeros),
        ],
      ],
      aadhaarNumber: [
        storedData ? storedData.aadhaarNumber : null,
        [
          Validators.required,
          Validators.minLength(2),
          // Validators.maxLength(30),
          // Validators.pattern('^[a-zA-Z ]*$'),
          this.noWhitespaceValidator,
          // Validators.pattern(this.onlyZeros),
        Validators.pattern(aadharNumber),
        ],
      ],
    });

    (this.contactDetailsForm = this.fb.group({
      homeNumber: [
        storedData ? storedData.homeNumber : null,
        [Validators.pattern(phoneNumber)],
      ],
      cellNumber: [
        storedData ? storedData.cellNumber : null,
        [Validators.required, Validators.pattern(phoneNumber)],
      ],
      personalEmail: [
        storedData ? storedData.personalEmail : null,
        [Validators.required, Validators.pattern(emailregex)],
        EmailNotTaken.createValidator(this.authService),
      ],
      // care365Email: [storedData ? storedData.care365Email : null],
      // address: this.fb.group({;
      addressLine: [
        storedData ? storedData.addressLine : null,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.onlyZeros),
          Validators.maxLength(200),
          this.noWhitespaceValidator,
        ]),
      ],
      country: [
        storedData ? storedData.country : null,
        Validators.compose([Validators.required]),
      ],
      countryCode: [, Validators.compose([Validators.required])],
      city: [
        storedData ? storedData.city : null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(name),
        ]),
      ],
      state: [
        storedData ? storedData.state : null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z ]*$'),
          this.noWhitespaceValidator,
        ]),
      ],
      zipCode: [
        storedData ? storedData.zipCode : null,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.onlyZeros),
        ]),
      ],
    })),
      // });

      (this.clinicDetailsForm = this.fb.group({
        facilityId: [
          storedData ? storedData.branch : null,
          Validators.compose([Validators.required]),
        ],

        providerId: [
          storedData ? storedData.providerId : null,
          Validators.compose([Validators.required]),
        ],
        careTeamId: [''],
        // primaryDiagnosis: [storedData ? storedData.primaryDiagnosis : null],
        // secondaryDiagnosis: [storedData ? storedData.secondaryDiagnosis : null],
      }));
    if (
      this.userRole == 'FACILITY_USER' ||
      this.userRole == 'CARECOORDINATOR'
    ) {
      this.clinicDetailsForm?.removeControl('facilityId');
    }

    this.healthDetailsForm = this.fb.group({
      diagnosislist: [storedData ? storedData.diagnosislist : null],
      // dryWeight: [],
      // lastDialysisDate: [],
      // nextDialysisDate: [],
      height: [
        storedData ? storedData.height : null,
        Validators.compose([
          Validators.required,
          Validators.max(250),
          Validators.min(50),
        ]),
      ],
      ldlLevels: [storedData ? storedData.ldlLevels : null, ''],
      randomSugar: [storedData ? storedData.randomSugar : null, ''],
      postPrandial: [storedData ? storedData.postPrandial : null, ''],
      fastingSugar: [storedData ? storedData.fastingSugar : null, ''],
      date: [this.today, Validators.compose([Validators.required])],
      hdlLevels: [storedData ? storedData.hdlLevels : null, ''],
      trilycerideLevels: [storedData ? storedData.trilycerideLevels : null, ''],
      cholestralLevels: [storedData ? storedData.cholestralLevels : null, ''],
      weight: [
        storedData ? storedData.weight : null,
        Validators.compose([
          Validators.required,
          Validators.max(800),
          Validators.min(30),
        ]),
      ],
      // duration: [],
      clinicBloodPressure: [
        storedData ? storedData.clinicBloodPressure : null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d{1,3}\/\d{1,3}$/),
        ]),
      ],
      // clinicBg: [storedData ? storedData.clinicBg : null],
      clinicPulseRate: [
        storedData ? storedData.clinicPulseRate : null,
        Validators.compose([
          Validators.required,
          Validators.max(200),
          Validators.min(10),
        ]),
      ],
      baselineSystolic: [
        120,
        Validators.compose([
          Validators.required,
          Validators.min(30),
          Validators.max(500),
        ]),
      ],
      baselineDiastolic: [
        80,
        Validators.compose([
          Validators.required,
          Validators.min(30),
          Validators.max(500),
        ]),
      ],
      hba1c: [
        storedData ? storedData.hba1c : null,
        Validators.compose([Validators.min(1), Validators.max(99)]),
      ],
      // patientUnderMadication: [
      //   storedData ? storedData.patientUnderMadication : null,
      //   Validators.compose([Validators.required]),
      // ],
      // dmi: [null, Validators.compose([Validators.required])],
    });

    this.EMRDetailsForm = this.fb.group({
      ssn: [null],

      emrPatientId: [null],
    });
  }

  ngOnInit(): void {
    this.today.setDate(this.today.getDate());
    this.filteredOptions = this.searchTextboxControl.valueChanges.pipe(
      startWith<string>(''),
      map((name) => this._filter(name))
    );

    if (this.data) {
      if (this.data?.mode === 'edit') {
        this.practiceService
          .checkUserIsLoggedIn(this.data?.patient.id)
          .subscribe((res) => {
            this.checkUserLoggedIn = res?.checkUserLoggedIn;
          });
      }
      if (this.data.diagnostics == 'update') {
        this.diagnosis = true;
      }
      if (this.userRole == 'CAREPROVIDER') {
        this.patientService.getDiagnosis(this.data?.patient?.id).subscribe(
          (data) => {
            this.diagnosisData = data[0];
            this.healthDetailsForm
              .get('diagnosislist')
              .setValue(this.diagnosisData.diagnosisList);
            this.healthDetailsForm
              .get('baselineSystolic')
              .setValue(this.diagnosisData.baselinesystolic);
            this.healthDetailsForm
              .get('height')
              .setValue(this.diagnosisData.height);
            this.healthDetailsForm
              .get('weight')
              .setValue(this.diagnosisData.weight);
            this.healthDetailsForm
              .get('clinicBloodPressure')
              .setValue(this.diagnosisData.clinicbloodpressure);
            this.healthDetailsForm
              .get('clinicPulseRate')
              .setValue(this.diagnosisData.cinicpulserate);
            this.healthDetailsForm
              .get('baselineDiastolic')
              .setValue(this.diagnosisData.baselinediastolic);
            this.healthDetailsForm
              .get('ldlLevels')
              .setValue(this.diagnosisData.ldllevels);
            this.healthDetailsForm
              .get('randomSugar')
              .setValue(this.diagnosisData.randomSugar);
            this.healthDetailsForm
              .get('postPrandial')
              .setValue(this.diagnosisData.postPrandial);
            this.healthDetailsForm
              .get('fastingSugar')
              .setValue(this.diagnosisData.fastingSugar);
            this.healthDetailsForm
              .get('hdlLevels')
              .setValue(this.diagnosisData.hdllevels);
            this.healthDetailsForm
              .get('date')
              .setValue(this.diagnosisData.date);
            this.healthDetailsForm
              .get('trilycerideLevels')
              .setValue(this.diagnosisData.triglyceridelevels);
            this.healthDetailsForm
              .get('cholestralLevels')
              .setValue(this.diagnosisData.cholestrallevel);
            this.healthDetailsForm
              .get('hba1c')
              .setValue(this.diagnosisData.hb1c);
            //   this.healthDetailsForm
            //     .get('patientUnderMadication')
            //     .setValue(this.diagnosisData.patientundermedication);
          },
          (error) => {}
        );
      }
    }
    this.currentPatient = this.data?.patient;

    this.facilitiesData = JSON.parse(localStorage.getItem('facilitiesdata'));

    this.CityFilteredOptions = this.contactDetailsForm
      .get('city')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCitySearch(value))
      );
    //

    // this.keyUpObservable = this.contactDetailsForm
    //   .get('zipCode')
    //   ?.valueChanges.pipe(
    //     map((data: any) => {
    //       return data;
    //     }),
    //     filter((res) => res?.length > 5),

    //     debounceTime(1000),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((phoneStr) => {
    //     this.onZipCodeSelection('');
    //   });
    if (this.userRole === 'HOSPITAL_USER') {
      this.branchservice.getClinicDropdownList().subscribe((data: any) => {
        this.clinicList = data;
        let c = [];
        this.clinicList.forEach((res) => {
          c.push(res.id);
        });
      });
    } else if (this.userRole === 'CAREPROVIDER') {
      this.clinicList = this.facilitiesData;
      this.clinicDetailsForm?.removeControl('careTeamId');
    }
    if (
      this.userRole === 'FACILITY_USER' ||
      this.userRole === 'CARECOORDINATOR'
    ) {
      this.onBranchSelection(undefined);
    }

    if (this.currentPatient) {
      this.onhospitalSelection(this.data.patient.hospitalId, '');
      // this.practiceService.getPracticeList().subscribe(
      //   (res: any) => {
      //     if (res.hospitalList?.length) {
      //       this.hospital = res.hospitalList.filter(
      //         (element) => element.id == this.data.patient.hospitalId
      //       );
      //     }
      //     // this.hospital.sort((a, b) => (a.name > b.name ? 1 : -1));
      //     // this.getBranches();
      //     this.clinicDetailsForm
      //       .get('hospitalId')
      //       .setValue(this.hospital?.length ? this.hospital[0] : null);
      //     this.onhospitalSelection(
      //       this.hospital?.length ? this.hospital[0].id : null,
      //       ''
      //     );
      //   },
      //   (err) => {
      //     // this.snackBar.error(err.message);
      //   }
      // );
      if (this.userRole == 'CAREPROVIDER') {
        this.service.getdiagnosislist().subscribe((res) => {
          this.vitalsList = res.ICDCODES;

          this.vitalsList.filter((e) => {
            if (e.id === this.diagnosisData.diagnosisList) {
              this.healthDetailsForm.get('diagnosislist').setValue(e);
            }
          });
        });
      }
      this.currentPatient = this.data?.patient;
      const splittedPrimaryName =
        this.currentPatient?.primaryDiagnosis?.split(',');
      const splittedSecondaryName =
        this.currentPatient?.secondaryDiagnosis?.split(',');
      const splittedPrimaryCode =
        this.currentPatient?.primaryicdcode?.split(',');
      const splittedSecondaryCode =
        this.currentPatient?.secondaryicdcode?.split(',');

      let primaryDiag;
      let seconDiag;

      let primaryIcd;
      let seconIcd;
      for (let i = 0; i < splittedPrimaryName?.length; i++) {
        primaryDiag = splittedPrimaryName[i];
        this.pnames.push(primaryDiag);
      }
      for (let i = 0; i < splittedSecondaryName?.length; i++) {
        seconDiag = splittedSecondaryName[i];
        if (seconDiag) {
          this.snames.push(seconDiag);
        }
      }
      for (let i = 0; i < splittedPrimaryCode?.length; i++) {
        primaryIcd = splittedPrimaryCode[i];
        this.pcodes.push(primaryIcd);
      }
      for (let i = 0; i < splittedSecondaryCode?.length; i++) {
        seconIcd = splittedSecondaryCode[i];
        if (seconIcd) {
          this.scodes.push(seconIcd);
        }
      }
      if (this.userRole == 'HOSPITAL_USER') {
        let facilitiesID = [];
        this.currentPatient['facilities'].forEach((res) => {
          facilitiesID.push(res.id);
        });

        this.onBranchSelection(facilitiesID);
      } else {
        this.onBranchSelection('');
      }
      const name = /^[a-zA-Z][a-zA-Z\s]*$/;
      this.personalDetailsForm = this.fb.group({
        firstName: [
          this.currentPatient['patientFirstName'],
          [
            Validators.required,
            Validators.pattern(name),
            // Validators.pattern(this.onlyZeros),
            Validators.minLength(3),
            Validators.maxLength(50),
            this.noWhitespaceValidator,
          ],
        ],
        middleName: [
          this.currentPatient['patientmiddleName']
            ? this.currentPatient['patientmiddleName']
            : null,
          Validators.compose([
            Validators.nullValidator,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$'),
            // Validators.pattern(this.onlyZeros),
          ]),
        ],
        lastName: [
          this.currentPatient['patientLastName'],
          [
            Validators.required,
            Validators.minLength(1),
            Validators.pattern('^[a-zA-Z ]*$'),
            // Validators.pattern(this.onlyZeros),
            Validators.maxLength(50),
            this.noWhitespaceValidator,
          ],
        ],
        dateOfBirth: [
          this.currentPatient['dob'],
          Validators.compose([Validators.required]),
        ],
        age: [
          this.currentPatient.age,
          Validators.compose([Validators.required]),
        ],
        gender: [
          this.currentPatient.gender,
          Validators.compose([Validators.required]),
        ],
        occupation: [
          this.currentPatient['occupation'],
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(30),
            Validators.pattern('^[a-zA-Z ]*$'),
            this.noWhitespaceValidator,
            // Validators.pattern(this.onlyZeros)
          ],
        ],
        aadhaarNumber: [
          this.currentPatient['aadhaarNumber'],
          [
            Validators.required,
            Validators.minLength(2),
            // Validators.maxLength(30),
            // Validators.pattern('^[a-zA-Z ]*$'),
            this.noWhitespaceValidator,
            // Validators.pattern(this.onlyZeros)
            Validators.pattern(aadhaarNumberRx),
          ],
        ],
      });

      (this.contactDetailsForm = this.fb.group({
        homeNumber: [
          this.currentPatient.homeNumber,
          [Validators.pattern(phoneNumberRx)],
        ],
        cellNumber: [
          this.currentPatient.cellNumber,
          [Validators.required, Validators.pattern(phoneNumberRx)],
        ],
        personalEmail: [
          this.currentPatient.personalEmail,
          [Validators.required, Validators.pattern(emailRx)],
        ],
        // care365Email: [this.currentPatient.personalEmail, [Validators.required]],

        // address: this.fb.group({
        addressLine: [
          this.currentPatient['addressLine'],
          Validators.compose([
            Validators.required,
            Validators.pattern(this.onlyZeros),
            this.noWhitespaceValidator,
          ]),
        ],
        country: [
          this.currentPatient['country'],
          Validators.compose([Validators.required]),
        ],
        countryCode: [
          this.currentPatient['countryCode'],
          Validators.compose([Validators.required]),
        ],
        city: [
          this.currentPatient['city'],
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
            Validators.pattern('^[a-zA-Z ]*$'),
            this.noWhitespaceValidator,
          ]),
        ],
        state: [
          this.currentPatient['state'],
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('^[a-zA-Z ]*$'),
            this.noWhitespaceValidator,
          ]),
        ],
        zipCode: [
          this.currentPatient['zipCode'],
          Validators.compose([
            Validators.required,
            Validators.pattern(this.onlyZeros),
          ]),
        ],
      })),
        // });

        this.onZipCodeSelection(this.currentPatient['zipCode']);
      this.getcountry(this.currentPatient['country']);
      // this.onhospitalSelection(this.currentPatient.branch?.hospital.id);
      this.clinicDetailsForm = this.fb.group({
        hospitalId: [this.currentPatient.branch?.hospital.id, []],
        facilityId: [
          this.currentPatient['facilities']
            ? this.currentPatient['facilities']
            : '',
          Validators.compose([Validators.required]),
        ],
        providerId: [
          this.currentPatient['careProviders']
            ? this.currentPatient['careProviders'][0]
            : '',
          Validators.compose([Validators.required]),
        ],
        careTeamId: [''],
        // primaryDiagnosis: [
        //   this.pnames,
        //   Validators.compose([Validators.required]),
        // ],
        // secondaryDiagnosis: [this.snames],
      });
      if (
        this.userRole == 'FACILITY_USER' ||
        this.userRole == 'CARECOORDINATOR'
      ) {
        this.clinicDetailsForm?.removeControl('facilityId');
        this.clinicDetailsForm?.removeControl('hospitalId');
      }
      // if (this.userRole == 'CAREPROVIDER') {
      //   this.clinicDetailsForm?.removeControl('facilityId');
      //   this.clinicDetailsForm?.removeControl('hospitalId');
      // }

      if (this.currentPatient && this.currentPatient['facilities']?.length) {
        let facilitiesID = [];
        this.currentPatient['facilities'].forEach((res) => {
          facilitiesID.push(res.id);
        });
        this.clinicDetailsForm
          .get('facilityId')
          .setValue(facilitiesID.map((fId: any[]) => fId));
      }
      let careproviderID = [];
      if (this.currentPatient && this.currentPatient['careProviders']?.length) {
        this.currentPatient['careProviders'].forEach((res) => {
          const body = {
            firstName: res.firstName + ' ' + res.lastName,
            id: res.id,
            Status: res.status,
          };
          careproviderID.push(body);
        });

        this.clinicDetailsForm.get('providerId').setValue(careproviderID[0]);
      }

      if (this.currentPatient && this.currentPatient['careTeam']?.length) {
        let facilitiesID = [];
        this.currentPatient['careTeam'].forEach((res) => {
          // let body = {
          //   firstName: res.firstName + ' ' + res.lastName,
          //   id: res.id,
          //   Status: res.status,
          // };
          facilitiesID.push(res.id);
        });
        // this.clinicDetailsForm.get('careTeamId').patchValue(facilitiesID);

        this.clinicDetailsForm
          .get('careTeamId')
          .setValue(facilitiesID.map((fId: any[]) => fId));
        // this.setSelectedValues();
      }

      this.healthDetailsForm = this.fb.group({
        diagnosislist: [null],
        // dryWeight: [null],
        // lastDialysisDate: [null],
        // nextDialysisDate: [null],
        height: [null, Validators.compose([Validators.required])],
        weight: [
          null,
          Validators.compose([Validators.required, Validators.max(800)]),
        ],
        // duration: [null],
        clinicBloodPressure: [null],
        // clinicBg: [this.diagnosisData['clinicBg']],
        clinicPulseRate: [
          null,
          Validators.compose([
            Validators.required,
            Validators.max(200),
            Validators.min(10),
          ]),
        ],
        baselineSystolic: [
          null,
          Validators.compose([
            Validators.required,
            Validators.max(500),
            Validators.min(30),
          ]),
        ],
        baselineDiastolic: [
          null,
          Validators.compose([
            Validators.required,
            Validators.max(500),
            Validators.min(30),
          ]),
        ],
        ldlLevels: [null, ''],
        randomSugar: [null, ''],
        postPrandial: [null, ''],
        fastingSugar: [null, ''],
        hdlLevels: [null, ''],
        date: [null, Validators.compose([Validators.required])],
        trilycerideLevels: [null, ''],
        cholestralLevels: [null, ''],
        hba1c: [
          null,
          Validators.compose([Validators.min(1), Validators.max(99)]),
        ],
        // patientUnderMadication: null,
      });
      this.EMRDetailsForm = this.fb.group({
        // ssn: [this.currentPatient['ssn']],
        ssn: [this.currentPatient['ssn']],
        emrPatientId: [
          this.currentPatient['emrPatientId'],
          Validators.compose([Validators.required]),
        ],
      });
    } else {
      // this.diseaseService
      //   .fetchDiseaseList('Essential (primary) hypertension')
      //   .subscribe((res) => {
      //     this.pdiseases = res.icdCodes;
      //     if (this.pdiseases?.length) {
      //       this.clinicDetailsForm
      //         .get('primaryDiagnosis')
      //         .setValue(this.pdiseases[0]);
      //       this.pcodes.push(this.pdiseases[0].id);
      //       this.primaryNames = this.pnames.join('&');
      //       this.pnames.push(this.pdiseases[0].name);
      //       this.primarycodeInput.nativeElement.value = null;
      //       this.primarydiseaseCodeCtrl.setValue(this.currentPatientpdiseases[0].id);
      //       this.getDiagnosis.setValue(this.pcodes.join());
      //       this.primaryDiagnosisSelected = true;
      //     }
      //   });
    }

    if (this.userRole === 'CAREPROVIDER') {
      this.clinicDetailsForm?.removeControl('careTeamId');
    }

    this.handleInsuranceType();
  }

  // preventPaste(event: ClipboardEvent): void {
  //   event.preventDefault();
  // }

  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();

    this.clinicDetailsForm.get('careTeamId').patchValue(this.selectedValues);
    let filteredList = this.careTeamToSearch.filter((doc) =>
      doc.firstName.toLowerCase().includes(filterValue)
    );
    return filteredList;
  }
  private _filterVal(name: string) {
    const filterValue = name.toLowerCase();

    return this.doctor.filter(
      (option) => option.firstName.toLowerCase().indexOf(filterValue) === 0
    );
  }
  setSelectedValues() {
    if (
      this.clinicDetailsForm.get('careTeamId').value &&
      this.clinicDetailsForm.get('careTeamId').value.length > 0
    ) {
      this.clinicDetailsForm.get('careTeamId').value.forEach((e) => {
        if (this.selectedValues.indexOf(e) == -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }
  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1);
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }
  lookup(e) {
    this.filteredDataToSearch = this.careTeamToSearch.filter((doc) =>
      doc.firstName.toLowerCase().includes(e.value)
    );
  }

  clean(t) {
    t.value = '';
    this.lookup(t.value);
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  public handleAddressChange(address: any) {
    this.formattedAddress = address.formatted_address;
    this.addressLine.setValue(this.formattedAddress);
  }

  allowAlphaNumericOnKeyPress(event: KeyboardEvent): boolean {
    const inputChar = event.key;
    if (/[a-zA-Z0-9]/.test(inputChar)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  // changeZipcode() {
  //   if (this.zipcode?.value?.length < 6) {
  //     this.statesData.setValue(null);
  //   }
  // }
  changeZipcode() {
    if (
      this.contactDetailsForm.get('country')?.value === 'India' &&
      this.contactDetailsForm.get('zipCode')?.value?.length === 6
    ) {
      this.onZipCodeSelection('');
    } else if (
      this.contactDetailsForm.get('country')?.value === 'USA' &&
      this.contactDetailsForm.get('zipCode')?.value?.length === 5
    ) {
      this.onZipCodeSelection('');
    } else if (
      this.contactDetailsForm.get('zipCode')?.value?.length < 6 &&
      this.contactDetailsForm.get('zipCode')?.value?.length > 1
    ) {
      this.contactDetailsForm.get('state').setValue(null);
      this.contactDetailsForm.get('city').setValue(null);
    } else if (this.contactDetailsForm.get('zipCode')?.value?.length === 0) {
      if (this.contactDetailsForm.get('country')?.value === 'India') {
        this.contactDetailsForm
          .get('zipCode')
          .setValidators([
            Validators.required,
            Validators.maxLength(6),
            Validators.minLength(6),
            Validators.pattern(this.onlyZeros),
          ]);
      } else if ('USA') {
        this.contactDetailsForm
          .get('zipCode')
          .setValidators([
            Validators.required,
            Validators.maxLength(5),
            Validators.minLength(5),
            Validators.pattern(this.onlyZeros),
          ]);
      }

      this.contactDetailsForm.get('zipCode').updateValueAndValidity();
      this.contactDetailsForm.get('zipCode').setValue(null);
      this.contactDetailsForm.get('state').setValue(null);
      this.contactDetailsForm.get('city').setValue(null);
    }
  }
  storeData() {
    this.careTeamToSearch = this.doctor.filter(
      (item) => item.id !== this.clinicDetailsForm.get('providerId').value.id
    );
    if (this.careTeamToSearch.length) {
      this.clinicDetailsForm.get('careTeamId').enable();
    }
    if (
      this.currentPatient &&
      this.clinicDetailsForm.get('providerId').value.id !==
        this.currentPatient['careProviders'][0].id
    ) {
      this.selectedValues = [];

      this.clinicDetailsForm.get('careTeamId').reset();
    }
    this.filteredDataToSearch = this.careTeamToSearch;
    this.filteredOptions = this.searchTextboxControl.valueChanges.pipe(
      startWith<string>(''),
      map((name) => this._filter(name))
    );
    // if (!this.data?.patient) {
    //   const values: Patient = {
    //     ...this.contactDetailsForm.value,
    //     ...this.personalDetailsForm.value,
    //     ...this.clinicDetailsForm.value,
    //   };
    //   // localStorage.setItem('storedData', JSON.stringify(values));
    // }
  }
  storeCareData(e) {
    if (e.value && e.value.length > 0) {
      const values: Patient = {
        ...this.contactDetailsForm.value,
        ...this.personalDetailsForm.value,
        ...this.clinicDetailsForm.value,
      };
    }

    // if (!this.data?.patient) {
    //   const values: Patient = {
    //     ...this.contactDetailsForm.value,
    //     ...this.personalDetailsForm.value,
    //     ...this.clinicDetailsForm.value,
    //   };
    // localStorage.setItem('storedData', JSON.stringify(values));
    // }
  }
  onKeyUp() {
    if (this.clinicDetailsForm.get('hospitalId').value.length > 3) {
      this.practiceService
        .searchPracticelist(this.clinicDetailsForm.get('hospitalId').value)
        .subscribe((res) => {
          this.hospital = res;
        });
    }
  }
  // enableFields(event): any {
  // 	if (event.medicareAdvantageInsurer.length > 0) {
  // 		this.medAdvIndividualNumber = true;
  // 		this.medAdvGroupNumber = true;
  // 	} else if (event.medicareAdvantageInsurer.length === 0) {
  // 		this.medAdvIndividualNumber = false;
  // 		this.medAdvGroupNumber = false;
  // 	}
  // }
  /**
   * Personal details
   */

  get firstName(): FormControl {
    return this.personalDetailsForm.get('firstName') as FormControl;
  }
  get middleName(): FormControl {
    return this.personalDetailsForm.get('middleName') as FormControl;
  }
  get hba1c(): FormControl {
    return this.healthDetailsForm.get('hba1c') as FormControl;
  }
  get cholestralLevels(): FormControl {
    return this.healthDetailsForm.get('cholestralLevels') as FormControl;
  }
  get hdlLevels(): FormControl {
    return this.healthDetailsForm.get('hdlLevels') as FormControl;
  }
  get ldlLevels(): FormControl {
    return this.healthDetailsForm.get('ldlLevels') as FormControl;
  }
  get trilycerideLevels(): FormControl {
    return this.healthDetailsForm.get('trilycerideLevels') as FormControl;
  }
  get randomSugar(): FormControl {
    return this.healthDetailsForm.get('randomSugar') as FormControl;
  }
  get postPrandial(): FormControl {
    return this.healthDetailsForm.get('postPrandial') as FormControl;
  }
  get fastingSugar(): FormControl {
    return this.healthDetailsForm.get('fastingSugar') as FormControl;
  }
  get lastName(): FormControl {
    return this.personalDetailsForm.get('lastName') as FormControl;
  }
  get dateOfBirth(): FormControl {
    return this.personalDetailsForm.get('dateOfBirth') as FormControl;
  }
  get age(): FormControl {
    return this.personalDetailsForm.get('age') as FormControl;
  }
  get occupation(): FormControl {
    return this.personalDetailsForm.get('occupation') as FormControl;
  }
  get aadhaarNumber(): FormControl {
    return this.personalDetailsForm.get('aadhaarNumber') as FormControl;
  }
  get patientGender(): FormControl {
    return this.personalDetailsForm.get('gender') as FormControl;
  }

  get homeNumber(): FormControl {
    return this.contactDetailsForm.get('homeNumber') as FormControl;
  }
  get cellNumber(): FormControl {
    return this.contactDetailsForm.get('cellNumber') as FormControl;
  }
  get personalEmail(): FormControl {
    return this.contactDetailsForm.get('personalEmail') as FormControl;
  }
  get care365Email(): FormControl {
    return this.contactDetailsForm.get('care365Email') as FormControl;
  }
  get insuranceDetails(): FormControl {
    return this.insuranceDetailsForm.get('insuranceType') as FormControl;
  }
  get insuranceData(): FormGroup {
    return this.insuranceDetailsForm.get('insuranceData') as FormGroup;
  }

  get primarydiseaseCodeCtrl(): FormControl {
    return this.clinicDetailsForm.get('primaryDiagnosis') as FormControl;
  }

  get secondarydiseaseCodeCtrl(): FormControl {
    return this.clinicDetailsForm.get('secondaryDiagnosis') as FormControl;
  }

  get zipcode(): FormControl {
    return this.contactDetailsForm.get('zipCode') as FormControl;
  }
  get addressLine(): FormControl {
    return this.contactDetailsForm.get('addressLine') as FormControl;
  }
  get statesData(): FormControl {
    return this.contactDetailsForm.get('state') as FormControl;
  }
  get cityData(): FormControl {
    return this.contactDetailsForm.get('city') as FormControl;
  }
  get countryData(): FormControl {
    return this.contactDetailsForm.get('country') as FormControl;
  }
  get countryCodeData(): FormControl {
    return this.contactDetailsForm.get('countryCode') as FormControl;
  }

  get patientBranch(): FormControl {
    return this.clinicDetailsForm.get('branch') as FormControl;
  }
  get providerId(): FormControl {
    return this.clinicDetailsForm.get('providerId') as FormControl;
  }
  get ssn(): FormControl {
    return this.EMRDetailsForm.get('ssn') as FormControl;
  }
  getErrorEmail(): any {
    return this.contactDetailsForm.get('personalEmail').hasError('required')
      ? 'Email Id is required'
      : this.contactDetailsForm.get('personalEmail').hasError('pattern')
      ? 'Not a valid email address'
      : this.contactDetailsForm.get('personalEmail').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : '';
  }
  getErrorAddress(): any {
    return this.contactDetailsForm.get('addressLine').hasError('required')
      ? 'Address is required'
      : this.contactDetailsForm.get('addressLine').hasError('pattern')
      ? 'Only zeros are not allowed'
      : this.contactDetailsForm.get('addressLine').hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.contactDetailsForm.get('addressLine').hasError('maxlength')
      ? 'Max length should be 200 characters'
      : this.contactDetailsForm.get('addressLine').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : '';
  }
  limitKeypress(event, value, maxLength) {
    if (value != undefined && value.toString().length >= maxLength) {
      event.preventDefault();
    }
  }
  getZipCodeError() {
    return this.zipcode.hasError('required')
      ? 'Zipcode is required'
      : this.zipcode.hasError('maxlength')
      ? this.countryData?.value === 'India'
        ? `Enter valid 6 digit zipcode`
        : `Enter valid 5 digit zipcode`
      : !this.state.length
      ? this.countryData?.value === 'India'
        ? 'Enter valid 6 digit zipcode'
        : 'Enter valid 5 digit zipcode'
      : this.zipcode.hasError('minlength')
      ? this.countryData?.value === 'India'
        ? `Enter valid 6 digit zipcode`
        : `Enter valid 5 digit zipcode`
      : '';
  }
  getStateError() {
    return this.statesData.hasError('required')
      ? 'State is required'
      : this.statesData.hasError('pattern')
      ? 'Only Zeros not allowed'
      : this.statesData.get('pattern').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.statesData.hasError('maxlength')
      ? `Maximum length is ${this.statesData.errors.maxlength.requiredLength}`
      : this.statesData.hasError('minlength')
      ? `Minimum length is ${this.statesData.errors.minLength.requiredLength}`
      : '';
  }
  getErrorBP(): any {
    if (
      /^\d{1,3}\/\d{1,3}$/.test(
        this.healthDetailsForm.get('clinicBloodPressure').value
      )
    ) {
    } else if (this.healthDetailsForm.get('clinicBloodPressure').value) {
      this.showBPError = true;
    }
    return this.healthDetailsForm
      .get('clinicBloodPressure')
      .hasError('required')
      ? 'Clinic Blood Pressure is required'
      : this.healthDetailsForm.get('clinicBloodPressure').hasError('pattern')
      ? 'Enter valid BP'
      : '';
  }
  get emailId(): FormControl {
    return this.contactDetailsForm.get('personalEmail') as FormControl;
  }
  handleInsuranceType(): void {
    if (!this.data?.patient) {
      // this.insuranceDetailsForm.removeControl('insuranceData');
      // this.insuranceDetailsForm.addControl(
      //   'insuranceData',
      //   this.fb.group({
      //     medicareNumber: [null],
      //     medicareAdvantageInsurer: [null],
      //     medAdvIndividualNumber: [null],
      //     medAdvGroupNumber: [null],
      //   })
      // );
      // this.insuranceDetails.valueChanges.subscribe((res) => {
      //   if (res === 'OTHERS') {
      //     this.insuranceDetailsForm.removeControl('insuranceData');
      //     this.insuranceDetailsForm.addControl(
      //       'insuranceData',
      //       this.fb.group({
      //         medicareNumber: [null],
      //         medicareAdvantageInsurer: [null],
      //       })
      //     );
      //   } else
      //   if (res === 'MEDICARE') {
      //     this.insuranceDetailsForm.removeControl('insuranceData');
      //     this.insuranceDetailsForm.addControl(
      //       'insuranceData',
      //       this.fb.group({
      //         medicareNumber: [null],
      //         medicareAdvantageInsurer: [null],
      //         medAdvIndividualNumber: [null],
      //         medAdvGroupNumber: [null],
      //         // insuranceName: [null],
      //         // insuranceno: [null]
      //       })
      //     );
      //   }
      // });
    } else {
      // this.insuranceDetails.setValue(this.currentPatient['insuranceType']);
      // this.insuranceDetails.valueChanges.subscribe((res) => {
      // if (this.currentPatient['insuranceType'] === 'OTHERS') {
      //   this.insuranceDetailsForm.removeControl('insuranceData');
      //   this.insuranceDetailsForm.addControl(
      //     'insuranceData',
      //     this.fb.group({
      //       medicareNumber: [
      //         this.currentPatient['insuranceData'].medicareNumber,
      //       ],
      //       medicareAdvantageInsurer: [
      //         this.currentPatient['insuranceData'].medicareAdvantageInsurer,
      //       ],
      //     })
      //   );
      //   this.insuranceDetails.setValue(this.currentPatient['insuranceType']);
      // } else
      if (this.currentPatient['insuranceType'] === null) {
        this.insuranceDetailsForm.removeControl('insuranceData');
        this.insuranceDetailsForm.addControl(
          'insuranceData',
          this.fb.group({
            medicareNumber: [
              this.currentPatient['insuranceData'].medicareNumber,
            ],
            medicareAdvantageInsurer: [
              this.currentPatient['insuranceData'].medicareAdvantageInsurer,
            ],
            medAdvIndividualNumber: [
              this.currentPatient['insuranceData'].medAdvIndividualNumber,
            ],
            medAdvGroupNumber: [
              this.currentPatient['insuranceData'].medAdvGroupNumber,
            ],
          })
        );
        this.insuranceDetails.setValue(this.currentPatient['insuranceType']);
      }
      // })
    }
  }

  getDiseaseErr(): string {
    return this.clinicDetailsForm.get('primaryDiagnosis').hasError('required')
      ? 'Primary Diagnosis is required'
      : this.clinicDetailsForm
          .get('secondaryDiagnosis')
          .hasError('valueSelected')
      ? 'Select disease from below options'
      : null;
  }
  redirectTO(RegURL: string): void {
    this.snackBar.openSnackBar('Redirecting to iHealth portal.', 'wait', 3000);
    setTimeout(() => {
      window.open(RegURL);
    }, 3001);
  }

  displayName(obj): any {
    return obj ? obj.name : undefined;
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
  onlyNumbersDecimal(event: any) {
    const inputChar = event.key;
    if (/^[0-9.]+$/.test(inputChar)) {
      return true;
    } else {
      event.stopImmediatePropagation();
      return false;
    }
  }

  onhospitalSelection(id, event: any): any {
    this.branch = [];
    this.branchService;
    // .getFilteredhospitalBranch(id ? id : event.option?.value.id)
    // .subscribe((res: any) => {

    //   if (res.branchList) {
    //     this.branch = res.branchList;
    //     // this.branch.sort((a, b) => (a.name > b.name ? 1 : -1));
    //     this.patientBranch.reset();
    //     this.providerId.reset();
    //     if (this.userRole == 'BRANCH_USER') {
    //       this.clinicDetailsForm.get('branch').setValue(this.branch[0].id);
    //       this.onBranchSelection(this.branch[0].id);
    //     }
    //     if (this.data?.patient && this.userRole == 'RPM_ADMIN') {
    //       const bId = this.branch.find((ele) => {
    //         return ele.id == this.data?.patient?.branch.id;
    //       });

    //       this.clinicDetailsForm.get('branch').setValue(bId?.id);
    //       this.doctor = [];
    //       this.branchService
    //         .getBranchDoctor1()
    //         .subscribe((data: any) => {

    //           this.doctor = data;

    //           const docId = this.doctor.find((ele) => {
    //             return ele.id == this.data?.patient?.providerId.id;
    //           });
    //           this.clinicDetailsForm
    //             .get('providerId')
    //             .setValue(docId?.id);
    //         });
    //     } else if (
    //       this.data?.patient &&
    //       (this.userRole == 'HOSPITAL_USER' ||
    //         this.userRole == 'BRANCH_USER')
    //     ) {
    //       this.doctor = [];
    //       this.branchService
    //         .getBranchDoctor1()
    //         .subscribe((data: any) => {

    //           this.doctor = data;
    //         });
    //       this.clinicDetailsForm
    //         .get('branch')
    //         .setValue(this.data?.patient?.branch.id);
    //       this.clinicDetailsForm
    //         .get('providerId')
    //         .setValue(this.data?.patient?.providerId.id);
    //     }
    //   }
    // });
    // this.storeData();
    // this.onBranchSelection(this.currentPatient.branch?.id);
  }
  // getBranches() {
  //   this.branchService
  //     .getFilteredhospitalBranch(this.hospital[0]?.id)
  //     .subscribe((data: any) => {
  //       if (data.branchList) {
  //         this.branch = data.branchList;
  //         // this.branch.sort((a, b) => (a.name > b.name ? 1 : -1));
  //         this.clinicDetailsForm.get('branch').setValue(this.branch[0]?.id);
  //         this.onBranchSelection(this.branch[0]?.id);
  //         this.patientBranch.reset();
  //         this.providerId.reset();
  //       }
  //     });
  // }

  dispSelOrg() {
    return (val) => this.formatOrg(val);
  }
  formatOrg(_val) {
    if (_val) {
      return _val.name;
    }
    return '';
  }
  dispdia() {
    return (val) => this.formatdia(val);
  }
  formatdia(_val) {
    if (_val) {
      return _val.icdName;
    }
    return '';
  }

  onBranchSelection(event): any {
    this.doctor = [];
    if (this.userRole == 'CAREPROVIDER') {
      this.clinicDetailsForm?.get('providerId').setValue(this.providerid);
    } else {
      this.branchService
        .getBranchDoctor(event, this.userRole)
        .subscribe((data: any) => {
          if (data?.length == 0) {
            this.snackBar.error(
              'No Primary Physician exists for the selected facility'
            );
          }
          this.doctor = data.filter((item) => item.Status === 'ACTIVE');
          this.filteredOptionsProvider = this.clinicDetailsForm
            .get('providerId')
            .valueChanges.pipe(
              startWith(''),
              map((value) =>
                typeof value === 'string' ? value : value.firstName
              ),
              map((name) =>
                name ? this._filterVal(name) : this.doctor.slice()
              )
            );
          this.storeData();
        });
      // this.storeCareData();
    }
  }
  bpValidation(event: any) {
    const inputChar = event.key;

    if (/^\d$|\//.test(inputChar)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  getcountry(event) {
    // this.contactDetailsForm.get('state').reset();
    // this.contactDetailsForm.get('city').reset();
    // this.contactDetailsForm.get('zipCode').reset();
    if (event === 'India') {
      this.contactDetailsForm
        .get('zipCode')
        .setValidators([
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern(this.onlyZeros),
        ]);
      this.contactDetailsForm.get('countryCode').setValue('+91');
    } else if ('USA') {
      this.contactDetailsForm
        .get('zipCode')
        .setValidators([
          Validators.maxLength(5),
          Validators.minLength(5),
          Validators.pattern(this.onlyZeros),
        ]);
      this.contactDetailsForm.get('countryCode').setValue('+1');
    }
  }
  getCountry(event) {
    this.contactDetailsForm.get('zipCode').reset();
    this.contactDetailsForm.get('state').reset();
    this.contactDetailsForm.get('city').reset();
    if (event.value === 'India') {
      this.contactDetailsForm
        .get('zipCode')
        .setValidators([
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern(/^(?!0*$)\d+$/),
        ]);
      this.contactDetailsForm.get('countryCode').setValue('+91');
    } else if ('USA') {
      this.contactDetailsForm
        .get('zipCode')
        .setValidators([
          Validators.required,
          Validators.maxLength(5),
          Validators.minLength(5),
          Validators.pattern(/^(?!0*$)\d+$/),
        ]);
      this.contactDetailsForm.get('countryCode').setValue('+1');
    }
  }

  calculateAge(event: MatDatepickerInputEvent<any>): void {
    const age = moment().diff(event.value, 'years');
    this.personalDetailsForm.patchValue({ age });
    const values: Patient = {
      ...this.contactDetailsForm.value,
      ...this.personalDetailsForm.value,
      // ...this.insuranceDetailsForm.value,
      ...this.clinicDetailsForm.value,
      // ...this.healthDetailsForm.value,
      // ...this.EMRDetailsForm.value,
    };
    // localStorage.setItem('storedData', JSON.stringify(values));
    // const selectedDate = event.value;

    // if (selectedDate) {
    //   const formattedDateOfBirth = this.datePipe.transform(selectedDate, 'dd/MM/yyyy');
    //   this.dateOfBirth.setValue(formattedDateOfBirth); // Set the formatted date as the input value
    // }
  }

  onStateSelection(event: any): any {
    this.city = [];
    this.state.forEach((ele) => {
      if (event == ele['primary_city']) {
        this.city.push(ele['primary_city']);
      }
    });
  }

  private _filterCitySearch(value: string): string[] {
    const filterCityValue = value.toLowerCase();
    return this.city.filter((option) =>
      option.toLowerCase().includes(filterCityValue)
    );
  }
  filterDiagnosis() {
    this.vitalsList = [];
    if (this.healthDetailsForm.controls['diagnosislist']?.value?.length > 2) {
      this.service
        .getdiagnosislistNames(
          this.healthDetailsForm.controls['diagnosislist']?.value
        )
        .subscribe((res) => {
          this.vitalsList = res.ICDCODES;
        });
    }
  }

  keyUp(event): any {
    event.target.value = event.target.value.trim();
  }
  onZipCodeSelection(data): any {
    this.state = [];
    let zipcodeVal;
    if (data) {
      zipcodeVal = data;
    } else {
      zipcodeVal = this.contactDetailsForm.get('zipCode').value;
    }
    if (
      this.contactDetailsForm.get('country')?.value === 'India' &&
      this.contactDetailsForm.get('zipCode')?.value?.length === 6
    ) {
      this.ZipStateCityService.getStateCity(zipcodeVal).subscribe(
        (res: any[]) => {
          this.state = res;
          if (res['results'].length) {
            this.state =
              res['results'][0].address_components[
                res['results'][0].address_components.length - 2
              ].long_name;
            this.city = res['results'][0].address_components[1].long_name;
            this.cityData?.setValue(this.city);
            this.statesData.setValue(this.state);
          }
          if (!this.statesData.value) {
            this.snackBar.error('Enter state manually');
          }
        },
        (err) => {
          // this.countryData.setValue('India');
          // this.countryCodeData.setValue('91');
        }
      );
    } else if (
      this.contactDetailsForm.get('country')?.value === 'USA' &&
      this.contactDetailsForm.get('zipCode')?.value?.length === 5
    ) {
      this.ZipStateCityService.getStateCity(zipcodeVal).subscribe(
        (res: any[]) => {
          this.state = res;
          if (res['results'].length) {
            this.state =
              res['results'][0].address_components[
                res['results'][0].address_components.length - 2
              ].long_name;
            this.city = res['results'][0].address_components[1].long_name;

            this.cityData?.setValue(this.city);
            this.statesData.setValue(this.state);
          }
          if (!this.statesData.value) {
            this.snackBar.error('Enter state manually');
          }
        },
        (err) => {
          // this.countryData.setValue('India');
          // this.countryCodeData.setValue('91');
        }
      );
    }
  }

  getIncList() {
    this.patientService.getInsuranceDetails().subscribe(
      (res) => {
        this.inList = res;
      },
      (err) => {
        // this.snackBar.error(err.error.message);
      }
    );
  }
  onPrimaryDiseaseKeyUp(value: string): void {
    // this.pa
    if (value.length >= 4) {
      this.diseaseService.fetchDiseaseList(value).subscribe((res) => {
        this.pdiseases = res.icdCodes;
        if (this.pdiseases.length) {
        }
      });
    }
  }
  onSecondaryDiseaseKeyUp(value: string): void {
    // this.pa
    if (value.length >= 4) {
      this.diseaseService.fetchDiseaseList(value).subscribe((res) => {
        this.sdiseases = res.icdCodes;
      });
    }
  }
  getPDError() {
    return this.clinicDetailsForm.get('primaryDiagnosis').hasError('required')
      ? 'Primary Diagnosis is required'
      : !this.primaryDiagnosisSelected
      ? 'Primary Diagnosis is required'
      : null;
  }
  getSDError() {
    return this.clinicDetailsForm.get('secondaryDiagnosis').hasError('required')
      ? 'Secondary Diagnosis is required'
      : null;
  }
  pdonfocusOut(event: any) {
    //
    if (!this.primaryDiagnosisSelected) {
      event.target.value = '';
    }
  }
  sdonfocusOut(event: any) {
    //
    if (!this.secondaryDiagnosisSelected) {
      event.target.value = '';
    }
  }
  addPrimary(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || null).trim()) {
      this.pcodes.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = null;
    }

    this.primarydiseaseCodeCtrl.setValue(null);
  }
  addSecondary(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || null).trim()) {
      this.scodes.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = null;
    }
    this.secondarydiseaseCodeCtrl.setValue(null);
    // this.storeData();
    // this.storeCareData();
  }

  removePrimary(code: string): void {
    if (!this.data?.patient) {
      this.pdiseases = [];
    }
    const index = this.pnames.indexOf(code);
    if (index >= 0) {
      this.pcodes.splice(index, 1);
      this.pnames.splice(index, 1);
    }
    if (!this.pnames.length) {
      this.clinicDetailsForm.get('primaryDiagnosis').setValue(null);
    }
  }
  removeSecondary(code: string): void {
    const index = this.snames.indexOf(code);
    if (index >= 0) {
      this.scodes.splice(index, 1);
      this.snames.splice(index, 1);
    }
    if (!this.snames.length) {
      this.clinicDetailsForm.get('secondaryDiagnosis').setValue(null);
    }
  }
  dispSelPrimary() {
    return (val) => {
      //
      this.formatPrimary(val);
    };
  }
  formatPrimary(_val) {
    if (this.data?.patient) {
      _val.forEach((e) => {
        //
        return e;
      });
    } else {
      return _val.id;
    }
  }
  dispSelSecondary() {
    return (val) => this.formatSecondary(val);
  }
  formatSecondary(_val) {
    if (this.data?.patient) {
      _val.forEach((e) => {
        return e;
      });
    } else {
      return _val.id;
    }
  }
  primaryselected(event: MatAutocompleteSelectedEvent): void {
    this.pcodes.push(event.option.value.id);
    this.primaryNames = this.pnames.join('&');
    this.pnames.push(event.option.value.name);
    this.primaryCodes = this.pcodes.join('&');
    this.primarycodeInput.nativeElement.value = null;
    this.primarydiseaseCodeCtrl.setValue(event.option.value.id);
    this.getDiagnosis.setValue(this.pcodes.join());
    this.primaryDiagnosisSelected = true;
  }
  get getDiagnosis(): FormControl {
    return this.healthDetailsForm.get('diagnosis') as FormControl;
  }

  secondaryselected(event: MatAutocompleteSelectedEvent): void {
    this.scodes.push(event.option.value.id);
    this.secondaryNames = this.snames.join('&');
    this.snames.push(event.option.value.name);
    this.secondaryCodes = this.scodes.join('&');
    this.secondarycodeInput.nativeElement.value = null;
    this.secondarydiseaseCodeCtrl.setValue(event.option.value.id);
    this.getDiagnosis.setValue(
      this.getDiagnosis.value + ',' + this.scodes.join()
    );
    const splittedDiagnosis = this.getDiagnosis.value.split(',');
    const uniqueChars = [...new Set(splittedDiagnosis)];
    this.getDiagnosis.setValue(uniqueChars.join());
    const scodeStr = this.scodes.toString();
    const pcodeStr = this.pcodes.toString();
    const joinedCodes = pcodeStr + ',' + scodeStr;
    if (joinedCodes !== this.getDiagnosis.value) {
      this.getDiagnosis.setValue(null);
      this.getDiagnosis.setValue(joinedCodes);
    }
    this.secondaryDiagnosisSelected = true;
  }
  getErrorZipCode(): any {
    return this.contactDetailsForm.get('zipCode').hasError('required')
      ? 'Zip Code is required'
      : this.contactDetailsForm.get('zipCode').hasError('pattern')
      ? 'Please, Enter 5 digit Zip Code'
      : null;
  }
  validateTextWeight(evt) {
    if (evt.target.value.length === 0) {
      this.keyEventWeight = [];
    } else {
      this.keyEventWeight.push(evt.data);
    }
  }
  validateTextHeight(evt) {
    if (evt.target.value.length === 0) {
      this.keyEventHeight = [];
    } else {
      this.keyEventHeight.push(evt.data);
    }
  }
  validateTextBP() {
    this.bpValue = this.healthDetailsForm.get('clinicBloodPressure').value;
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
  // weightValueChange(){
  //   if(!this.healthDetailsForm.get('weight').value){
  //     this.keyEvent = [];
  //   }
  // }

  validateIncNo(evt) {
    if (evt.target.value.length > 30) {
      return false;
    } else {
      return true;
    }
  }
  // onKeyDown(event: KeyboardEvent): void {
  //   const inputValue = (event.target as HTMLInputElement).value;
  //   const restrictedPattern = /^\d{1,3}\/\d{1,3}$/;

  //   if (restrictedPattern.test(inputValue)) {
  //     event.preventDefault();
  //   }
  // }
  onSubmit(): any {
    this.submitted = true;

    // if (this.userRole == 'CAREPROVIDER') {
    //   if (!this.healthDetailsForm.value?.date.includes('T')) {
    //     var d = new Date(this.healthDetailsForm.value?.date.toISOString());
    //   } else {
    //     var d = new Date(this.healthDetailsForm.value?.date);
    //   }

    //   d.setHours(d.getHours() + 5);
    //   d.setMinutes(d.getMinutes() + 30);
    //   this.healthDetailsForm.value.date = d;
    // }
    if (
      this.userRole !== 'FACILITY_USER' &&
      this.userRole !== 'CARECOORDINATOR'
    ) {
      this.clinicDetailsForm.get('facilityId').value?.toString();
    }

    if (this.contactDetailsForm.invalid || this.personalDetailsForm.invalid) {
      return;
    }
    if (this.clinicDetailsForm.value.clinicBg < 1) {
      this.snackBar.error('Enter valid clinic BG');
      return;
    } else if (this.clinicDetailsForm.value.hba1c < 1) {
      this.snackBar.error('Enter valid hba1c');
      return;
    } else if (this.clinicDetailsForm.value.clinicPulseRate < 1) {
      this.snackBar.error('Enter valid clinic pulse');
      return;
    }
    this.contactDetailsForm.value.personalEmail =
      this.contactDetailsForm.value.personalEmail.toLowerCase();
    this.clinicDetailsForm.value.hospitalId = this.clinicDetailsForm.value
      .hospitalId?.id
      ? this.clinicDetailsForm.value.hospitalId.id
      : this.clinicDetailsForm.value.hospitalId;

    const values: Patient = {
      ...this.contactDetailsForm.value,
      ...this.personalDetailsForm.value,

      ...this.clinicDetailsForm.value,
    };

    values.firstName = values.firstName.trim();
    values.lastName = values.lastName.trim();
    values['addressLine'] = values['addressLine'].trim();
    values['city'] = values['city'].trim();
    values.middleName = values.middleName ? values.middleName.trim() : null;
    values.homeNumber = values.homeNumber ? values.homeNumber : null;

    values.branch = values.branch;
    values['dateOfBirth'] = this.caregiversharedService.formatDate(
      values['dateOfBirth']
    );
    // values.lastUpdatedAt = new Date().toISOString();
    // values.flag = false;
    if (this.userRole === 'HOSPITAL_USER' || this.userRole === 'CAREPROVIDER') {
      this.facilityI = this.clinicDetailsForm.get('facilityId')?.value;
    }
    const providerId = this.clinicDetailsForm.get('providerId')?.value.id;
    // const careTeamId = this.clinicDetailsForm.get('careTeamId')?.value;

    const docId = this.clinicDetailsForm.get('providerId').value.id;
    // const branch_data = this.branch.find((ele) => {;
    //   return ele.id == facilityId;
    // });

    if (this.userRole === 'HOSPITAL_USER') {
      this.clinicDetailsForm.get('facilityId').setValue(this.facilityI);
    }
    // this.clinicDetailsForm.get('facilityId').setValue(facilityId);
    const doctor_data = this.doctor.find((ele) => {
      return ele.id == docId;
    });
    // this.clinicDetailsForm.get('providerId').setValue(doctor_data);
    // values.branch = this.clinicDetailsForm.get('branch').value
    //   ? this.clinicDetailsForm.get('branch').value
    //   : null;
    // values.providerId = this.clinicDetailsForm.get('providerId')
    //   .value
    //   ? this.clinicDetailsForm.get('providerId').value
    //   : null;
    // this.clinicDetailsForm.get('branch').setValue(branchId);
    // this.clinicDetailsForm.get('providerId').setValue(docId);

    // if (this.data?.patient) {
    //   values.primaryicdcode = this.pcodes.toString();
    //   values.secondaryicdcode = !this.scodes.length ? null : this.scodes.toString();
    // }
    if (this.userRole === 'HOSPITAL_USER') {
      values['facilityId'] = this.facilityI;
    }
    if (this.userRole === 'CAREPROVIDER' && !this.data) {
      Object.assign(values, ...this.healthDetailsForm.value);
      values['facilityId'] = this.facilityI;
      if (values['diagnosislist'] && values['diagnosislist'].id) {
        values['diagnosislist'] = values['diagnosislist'].id;
      } else {
        values['diagnosislist'] = null;
      }
      // else if(!values['diagnosislist'].id){
      //   console.log(this.healthDetailsForm.get('diagnosislist').value);
      //   console.log('mmm');

      //   values['diagnosislist']=this.healthDetailsForm.get('diagnosislist').value;
      // }
    }
    if (values['date']) {
      var isoString = formatDate(
        values['date'],
        'yyyy-MM-ddTHH:mm:ss',
        'en-US'
      );
    }

    values.cholestralLevels = values.cholestralLevels
      ? values.cholestralLevels
      : null;
    values.hba1c = values.hba1c ? values.hba1c : null;
    values.hdlLevels = values.hdlLevels ? values.hdlLevels : null;
    values.ldlLevels = values.ldlLevels ? values.ldlLevels : null;
    values.trilycerideLevels = values.trilycerideLevels
      ? values.trilycerideLevels
      : null;
    values.randomSugar = values.randomSugar ? values.randomSugar : null;
    values.cholestralLevels = values.cholestralLevels
      ? values.cholestralLevels
      : null;
    values.fastingSugar = values.fastingSugar ? values.fastingSugar : null;
    values.postPrandial = values.postPrandial ? values.postPrandial : null;

    values['date'] = isoString;
    if (this.userRole === 'CAREPROVIDER' && !this.currentPatient) {
      values['providerId'] = [providerId];
    } else {
      values['providerId'] = [providerId];
    }
    if (this.userRole !== ('CAREPROVIDER' || 'CARECOORDINATOR')) {
      if (this.clinicDetailsForm.get('careTeamId').value?.length > 0) {
        let dummy = [];
        this.clinicDetailsForm.get('careTeamId').value.forEach((e) => {
          if (dummy.indexOf(e) == -1) {
            dummy.push(e);
          }
        });

        values['careTeamId'] = dummy.length ? dummy : [];
      }
    }
    if (!this.data?.patient) {
      this.patientService.addPatient(values).subscribe(
        () => {
          this.snackBar.success('Patient added successfully!');
          this.caregiversharedService.changeTabCounts(true);
          this.personalDetailsForm.reset();
          this.contactDetailsForm.reset();
          // this.clinicDetailsForm.reset();
          // this.insuranceDetailsForm.reset();
          this.dialogRef.close(true);
          this.isSubmitted = false;
          this.submitted = true;
          localStorage.removeItem('currentDilaog');
          localStorage.removeItem('storedData');
        },
        (error) => {
          if (error.err === 409) {
            this.snackBar.error(error.message);
          }

          this.isSubmitted = false;
          this.submitted = false;
          // this.clinicDetailsForm.get('branch').setValue(this.clinicDetailsForm.get('branch').value)
          // this.clinicDetailsForm.get('providerId').setValue(this.clinicDetailsForm.get('providerId').value)
        }
      );
    } else {
      this.patientService
        .editPatient(values, this.currentPatient['id'])
        .subscribe(
          () => {
            this.snackBar.success('Patient updated successfully!');
            this.personalDetailsForm.reset();
            this.contactDetailsForm.reset();
            this.clinicDetailsForm.reset();
            // this.insuranceDetailsForm.reset();
            this.dialogRef.close(true);
            this.isSubmitted = false;
            this.submitted = true;
          },
          (error) => {
            if (error.err === 409) {
              this.snackBar.error(error.message);
            }

            this.isSubmitted = false;
            this.submitted = false;
          }
        );
    }
  }
  getPermission() {
    let users = ['HOSPITAL_USER'];

    if (users.includes(this.userRole)) {
      return true;
    } else {
      return false;
    }
  }
  displayFn(user): string | undefined {
    return user ? user.firstName : undefined;
  }
}
