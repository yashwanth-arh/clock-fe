import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as Drugs from '../../../assets/json/drugs.json';
import { AddMedicationComponent } from './add-medication/add-medication.component';
import { TooltipPosition } from '@angular/material/tooltip';
import {
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { ObservationBody } from 'src/app/shared/entities/observation-duration';
import { CompressImageService } from 'src/app/services/compress-image.service';
import { environment } from 'src/environments/environment';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';
import { MatDialogService } from 'src/app/services/mat-dialog.service';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import { ActionToggleDialogComponent } from '../doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { DatePipe } from '@angular/common';
import { ExistDiagnosisComponent } from '../doctor-patients-details/diagnostic/add-diagnostic/exist-diagnosis/exist-diagnosis.component';

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(50, 250, 500);
  }
}
@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy },
  ],
})
export class MedicationComponent implements OnInit, AfterViewInit, OnDestroy {
  maxDate: Date = new Date();
  filterfromDate: string;
  filterToDate: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  @ViewChild('f') myNgForm: any;
  isSubmitted = false;
  patientId: string;
  loadRes = true;
  loadResPresDelete: boolean;
  loadResAddEditMedication: boolean;
  loadPresRes = true;
  medicationDataSource: any;
  public medicationForm: FormGroup;
  medicationHistoryList: any = [];
  userRole: string;
  newMedication = false;
  showfield = false;
  hideButton = true;
  dateRestrict = new Date();
  maxdate = new Date();
  roleid: any;
  p = 1;
  pmed = 1;
  medp = 1;
  pres = 1;
  patientUnderMedication: boolean;
  showmedicationAdherence = false;
  size = 4;
  medsize = 1;
  presSizeCaregiver = 5;
  presSizeDoctor = 4;
  pageIndex = 0;
  prescriptionlist: any;
  image: any;
  presImage: any;
  imagePath: any = [];
  medicationId: any;
  updateMedication = false;
  drugslist: any = [];
  filteredMedicine: Observable<any>;
  medicine: string[] = [];
  showNewChooseFile = false;
  details: any;
  doctorId: any;
  presFiles: any;
  minDate = new Date();
  frequency: any = [
    'Once a day',
    'Two times a day',
    'Three times a day',
    'Four times a day',
    'Once a week',
  ];
  medicineUnits: any = [
    'Mg(milligram)',
    'g(gram)',
    'ml(millilitre)',
    'l(litre)',
    'Ounce',
    'Drops',
    'IU',
    'Teaspoons',
    'Unit',
    'Other',
  ];
  formulation: any = [
    'ampoule/vial(s)',
    'application(s)',
    'sachet(s)',
    'unit(s)',
    'tablespoon(s)',
    'injection(s)',
    'capsule(s)',
    'milligram(mg)',
    'gram(s)',
    'pill(s)',
    'dose(s)',
    'puff(s)',
    'pair(s)',
    'suppository',
    'tablet(s)',
  ];
  route: any = ['Oral', 'IV', 'IM', 'SC', 'Inhalation', 'Topical', 'Other'];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  prescriptionfiles: any = [];
  observationStartTime = new Date().getTime();
  showOverLay: boolean;
  imageUrl: string;
  displayedColumns: string[] = [
    'date',
    'medicineName',
    'medicineDose/unit',
    'frequency',
    'duration',
    'quantity',
    'formulation',
    'route',
    'action',
  ];
  displayedAdherenceColumns: string[] = [
    'date',
    'medicationName',
    'medicationTaken',
    'medicationTime',
  ];
  position: TooltipPosition = 'right';
  viewImg = false;
  downloadIconDefault = 'assets/svg/Upload.svg';
  whiteDownloadIcon = 'assets/svg/Upload White.svg';
  columns: any = ['updatedBy', 'date', 'title', 'actions'];
  adheranceMedication: any;
  imageTitle: string;
  pdfimageSrc = '';
  imageSrc = '';
  body = new FormData();
  medicineName: any;
  showEdit: boolean;
  changedStatus: any;
  userId: any;
  addPermission: string;
  data: any;
  leavingComponent = false;
  constructor(
    private service: CaregiverDashboardService,
    private docservice: DoctorDashboardService,
    private caregiverSharedservice: CaregiverSharedService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private docService: DoctorDashboardService,
    private auth: AuthService,
    private compressImage: CompressImageService,
    private patientService: PatientManagementService,
    private matDialogService: MatDialogService,
    private datePipe: DatePipe
  ) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate);
    this.minDate.setFullYear(currentDate.getFullYear() - 5);
    this.maxdate = new Date(currentDate);
    this.maxdate.setFullYear(currentDate.getFullYear() + 5);
    const user = this.auth.authData;
    this.userId = user?.userDetails['scopeId'];
    this.imageUrl = environment.imagePathUrl;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.drugslist = Drugs['default'].drug_names;
    this.patientId = localStorage.getItem('patientId');
    this.addPermission = localStorage.getItem('medicationPermission');
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    this.chartToDate = new Date();
    this.showOverLay = false;
    this.getDetails();
    if (this.userRole == 'DOCTOR') {
      setInterval(() => {
        this.setObservationTime();
      }, 30000);
    }
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  ngAfterViewInit() {
    this.leavingComponent = false;

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
        // (this.filterfromDate =
        //   dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8)),
        //   (this.filterToDate =
        //     dynamicToDate + 'T' + dynamicToTime.substring(0, 8)),
        //   this.getAdherence(
        //     this.patientId,
        //     this.filterfromDate,
        //     this.filterToDate
        //   );

        // } else if (Object.keys(value).length && value.hasOwnProperty('id')) {
        //   // this.getAdherence(value['id'], this.chartFromDate, this.chartToDate);
        // } else {
        //   // this.getAdherence(this.patientId, this.chartFromDate, this.chartToDate);
        // }
      }
    });
  }

  ngOnInit(): void {
    // this.patientUnderMedication = JSON.parse(
    //   localStorage.getItem('patientUnderMedication')
    // );
    this.patientUnderMedication = true;
    this.leavingComponent = false;
    // this.medicationNames();
    this.caregiverSharedservice.triggerdMedications.subscribe((value) => {
      if (Object.keys(value).length) {
        this.medicationHist(localStorage.getItem('patientId'));
        // this.prescriptions(value['id']);
      } else {
        this.medicationHist(localStorage.getItem('patientId'));
        // this.prescriptions(this.patientId);
      }
    });

    this.medicationForm = this.fb.group({
      medicineName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noWhitespaceValidator,
        ]),
      ],
      medicineDose: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ]),
      ],
      medicineUnit: ['', Validators.required],
      formulation: ['', Validators.required],
      route: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          Validators.max(365),
          Validators.pattern(/^$|^([0-9]|[1-9][0-9]|[1][0][0])?/),
        ]),
      ],
      medicationStartDate: ['', Validators.required],
      quantity: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          Validators.max(999),
          Validators.min(1),
        ],
      ],
    });
    // this.medicine = this.drugslist;
    // this.filteredMedicine = this.medicationForm
    //   .get('medicineName')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map((value) => this.medicinefilter(value))
    //   );
  }
  //   getFilteredMedicine(evt){
  //   }

  onTableDataChange(event: any) {
    this.pmed = event;
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  uploadImage(event) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (
          event.target.files[i].type.includes('.sheet') ||
          event.target.files[i].type.includes('.xls') ||
          event.target.files[i].type.includes('ms-excel')
        ) {
          this.snackbarService.error('File not supported', 2000);
          return;
        }
        // else if (event.target.files[i].name.includes('.jpeg') || event.target.files[i].name.includes('.jpg')) {
        //   this.snackbarService.error('Please upload only png files');
        //   return;
        // }
        const [_file] = event.target.files;
        if (event.target.files[i]?.type.includes('pdf')) {
          this.pdfimageSrc = 'assets/svg/pdf img.svg';
          this.body.append('file', event.target.files[i]);
        } else {
          reader.readAsDataURL(_file);
          reader.onload = () => {
            this.imageSrc = reader.result as string;
          };
          if (event.target.files[i]?.size > 5242880) {
            this.compressImage
              .compress(event.target.files[i])
              .pipe(take(1))
              .subscribe((compressedImage) => {
                this.body.append('file', compressedImage);
              });
          } else if (event.target.files[i]?.size > 10485760) {
            this.snackbarService.error('Upload file upto 10 mb');
          } else {
            this.body.append('file', event.target.files[i]);
          }
        }
        //
      }
    }
  }
  removeSelectedFile() {
    const ele = document.getElementById('file') as HTMLInputElement;
    ele.value = '';
    this.imageSrc = '';
    this.pdfimageSrc = '';
    this.body.delete('file');
    this.body.delete('patientId');
    this.body.delete('title');
  }
  medicationNames(e) {
    // console.log(e);

    // fetch(
    //   '../../../assets/json/drugs.json' +
    //     this.medicationForm.controls['medicineName']?.value
    // )
    //   .then((res) => res.json())
    //   .then((res) => {
    // const searchTerm = e.target.value.toLowerCase(); // Convert input to lowercase

    // if (searchTerm.length >= 2) {
    // this.medicine = this.drugslist.filter((val) =>
    //   val.toLowerCase().includes(searchTerm)
    // );
    // } else {
    //   this.medicine = []; // Clear the autocomplete options when input is too short.
    // }

    // res is now an Actor
    // });
    this.medicine = [];
    if (this.medicationForm.controls['medicineName']?.value?.length > 1) {
    this.service
      .getMedicationNames(this.medicationForm.controls['medicineName']?.value)
      .subscribe(
        (data) => {
          this.medicine = data.drug_names;
          // this.medicinefilter(this.medicine);
        },
        (err) => {
          // this.snackbarService.error(err.message);
        }
        );
      }else{
        
        this.medicine = [];
    }
  }
  // savePrescription() {
  //   this.isSubmitted = true;
  //   if (!this.imageTitle) {
  //     this.snackbarService.error('Enter prescription title');
  //     this.isSubmitted = false;
  //     return;
  //   }
  //   if (this.imageTitle.length < 3) {
  //     this.snackbarService.error('Enter minimum 3 characters');
  //     this.isSubmitted = false;
  //     return;
  //   }
  //   if (this.imageTitle.length > 30) {
  //     this.snackbarService.error('Enter maximum 30 characters');
  //     this.isSubmitted = false;
  //     return;
  //   }
  //   if (this.body.has('patientId')) {
  //     this.body.delete('patientId');
  //     this.body.append('patientId', this.patientId);
  //   } else {
  //     this.body.append('patientId', this.patientId);
  //   }
  //   if (this.body.has('title')) {
  //     this.body.delete('title');
  //     this.body.append('title', this.imageTitle);
  //   } else {
  //     this.body.append('title', this.imageTitle);
  //   }

  //   this.docService.uploadPrescrition(this.body, this.patientId).subscribe(
  //     () => {
  //       this.snackbarService.success('File uploaded successfully');
  //       this.prescriptions(this.patientId);
  //       this.body.delete('file');
  //       this.isSubmitted = false;
  //       this.imageSrc = '';
  //       this.pdfimageSrc = '';
  //       this.imageTitle = '';
  //     },
  //     () => {
  //       this.snackbarService.error('Failed to upload', 2000);
  //       this.isSubmitted = false;
  //     }
  //   );
  // }
  setObservationTime(): void {
    const timeSpent = Math.floor(
      (new Date().getTime() - this.observationStartTime) / 1000
    );
    const updateBody: ObservationBody = {};
    // updateBody.clinincalNotes = timeSpent;
    localStorage.setItem(
      'medicationtimeSpentDuration',
      JSON.stringify(timeSpent)
    );
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
  getDetails() {
    this.data = JSON.parse(localStorage.getItem('careproviderDetails'));
    this.details = this.data;
    this.doctorId = this.details.id;
    // this.service.getUserDetails().subscribe(
    //   (data) => {
    //     this.details = data;
    //     this.doctorId = this.details.id;
    //   },
    //   (err) => {
    //     // this.snackbarService.error(err.message);
    //   }
    // );
  }

  trimString(text, length) {
    return text?.length > length ? text?.substring(0, length) + '...' : text;
  }
  medicationHist(id) {
    if (this.leavingComponent) {
      return;
    }
    this.service.getMedicationHistory(id).subscribe(
      (data) => {
        this.medicationHistoryList = data['content'];
        this.medicationHistoryList.sort(
          (a, b) => new Date(b.date1).getTime() - new Date(a.date1).getTime()
        );
        this.medicationDataSource = this.medicationHistoryList;
        this.loadRes = false;
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }

  getErrorPreBP(): any {
    return this.medicationForm.get('pre_bp').hasError('required')
      ? 'Pre BP is required'
      : this.medicationForm.get('pre_bp').hasError('pattern')
      ? 'Please Enter Valid BP'
      : '';
  }
  getErrorPostBP(): any {
    return this.medicationForm.get('post_bp').hasError('required')
      ? 'Post BP is required'
      : this.medicationForm.get('post_bp').hasError('pattern')
      ? 'Please Enter Valid BP'
      : '';
  }
  openMedicationForm() {
    this.updateMedication = false;

    this.medicationForm.reset();

    this.removeValidators();
    this.myNgForm.resetForm();
    this.showfield = false;
    this.hideButton = !this.hideButton;
    this.medicationId = null;
    this.showEdit = false;
  }

  getAdherence(id, fDate, tDate) {
    const body = {
      dateFrom: fDate,
      dateTo: tDate,
    };
    this.service.getMedicationAdherencelist(id, body).subscribe(
      (data) => {
        this.adheranceMedication = data.adherence;
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }
  getByTabChange(evt) {
    if (evt.index == 2) {
      this.showmedicationAdherence = true;
      this.caregiverSharedservice.changeMedicationAdhrence(true);
    }
  }
  downloadIcon() {
    this.downloadIconDefault = 'assets/svg/Upload White.svg';
  }
  downloadIconOut() {
    this.downloadIconDefault = 'assets/svg/Upload.svg';
  }
  removeValidators() {
    this.medicationForm.removeControl('post_wt');
    this.medicationForm.removeControl('post_bp');
    this.medicationForm.removeControl('next_dialysis_date');
    this.medicationForm.removeControl('id');
  }

  createMedication(valid, value, data) {
    if (this.medicationForm.invalid) {
      if (this.medicationForm.controls['medicineName'].invalid) {
        this.medicationForm.controls['medicineName'].markAsTouched();
        return;
      } else if (this.medicationForm.controls['medicineDose'].invalid) {
        this.medicationForm.controls['medicineDose'].markAsTouched();
        return;
      } else if (this.medicationForm.controls['duration'].invalid) {
        this.medicationForm.controls['duration'].markAsTouched();
        return;
      }
    }

    this.isSubmitted = true;
    // if (!valid) return this.snackbarService.error('Enter valid data');
    if (this.medicationForm.get('medicineDose').value < 0.1) {
      this.snackbarService.error('Enter valid medication dose');
      this.loadResAddEditMedication = false;
      this.isSubmitted = false;
      return;
    } else if (this.medicationForm.get('duration').value < 0.1) {
      this.snackbarService.error('Enter valid medication duration');
      this.loadResAddEditMedication = false;
      this.isSubmitted = false;
      return;
    }
    if (!this.medicationId) {
      // value.patientId = this.patientId;
      value.createdBy = this.doctorId;
      value.medicineDose = value.medicineDose.toString();
      value.duration = value.duration.toString();
      const newDate = this.datePipe.transform(
        value.medicationStartDate,
        'yyyy-MM-dd'
      );
      value.medicationStartDate = newDate;

      // const pastActivityDialog: MatDialogConfig = {
      //   disableClose: true,
      //   maxWidth: '100vw',
      //   maxHeight: '110vh',
      //   width: '300px',
      //   data: {
      //     title: `You are adding medication for "${localStorage.getItem(
      //       'patientName'
      //     )}". Please Confirm`,
      //   },
      // };
      // // The user can't close the dialog by clicking outside its body
      // this.dialog
      //   .open(ExistDiagnosisComponent, pastActivityDialog)
      //   .afterClosed()
      //   .subscribe((e) => {
      //     if (e) {
      //       this.loadResAddEditMedication = true;
      //       this.docservice.addMedication(value, this.patientId).subscribe(
      //         () => {
      //           this.loadResAddEditMedication = false;
      //           this.isSubmitted = false;
      //           this.newMedication = false;
      //           this.medicationHist(this.patientId);
      //           this.snackbarService.success('Medication added successfully');
      //           this.medicationForm.reset();
      //         },
      //         (err) => {
      //           this.isSubmitted = false;
      //           this.loadResAddEditMedication = false;
      //           // this.snackbarService.error(err.message);
      //         }
      //       );
      //     } else {
      //       this.isSubmitted = false;
      //     }
      //   });

      this.loadResAddEditMedication = true;
      this.docservice.addMedication(value, this.patientId).subscribe(
        () => {
          this.loadResAddEditMedication = false;
          this.isSubmitted = false;
          this.newMedication = false;
          this.medicationHist(this.patientId);
          this.snackbarService.success('Medication added successfully');
          this.medicationForm.reset();
        },
        (err) => {
          this.isSubmitted = false;
          this.loadResAddEditMedication = false;
          // this.snackbarService.error(err.message);
        }
      );
    } else {
      value.medicineDose = value.medicineDose.toString();
      value.duration = value.duration.toString();
      value.patientId = this.patientId;
      this.docservice.editMedication(value, this.medicationId).subscribe(
        () => {
          this.loadResAddEditMedication = false;
          this.isSubmitted = false;
          this.snackbarService.success('Medication updated successfully');
          this.newMedication = false;
          this.medicationHist(this.patientId);
          this.medicationForm.reset();
          this.medicationId = null;
          this.showEdit = false;
        },
        (err) => {
          this.isSubmitted = false;
          this.loadResAddEditMedication = false;
          // this.snackbarService.error(err.error.message);
        }
      );
    }
  }
  editMedication(ele) {
    this.showEdit = true;
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
  }
  // prescriptions(id) {
  //   this.service.getPrescriptions(id).subscribe(
  //     (data) => {
  //       this.imagePath = data.prescriptionListMap;
  //       this.loadPresRes = false;
  //     },
  //     (err) => {
  //       // this.snackbarService.error(err.message);
  //     }
  //   );
  // }
  // uploadprescriptions(id) {
  //   this.service.uploadPrescrition(id).subscribe(
  //     () => {
  //       this.showNewChooseFile = true;
  //       this.snackbarService.success('File uploaded successfully');
  //     },
  //     (err) => {
  //       // this.snackbarService.error(err.message);
  //     }
  //   );
  // }

  confirmDialog(element): void {
    const message = `Are you sure you want delete?`;
    const dialogData = new ConfirmDialogModel('Confirm', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.docService.deleteMedication(element.id).subscribe(
          () => {
            this.snackbarService.success('Medication deleted successfully');
            this.medicationForm.reset();
            this.updateMedication = false;
            this.medicationId = null;
            this.medicationHist(this.patientId);
          },
          (err) => {
            this.snackbarService.error('Could not delete medication');
          }
        );
      }
    });
  }
  // confirmDialogPrescription(element): void {
  //   const message = `Are you sure you want delete?`;
  //   const dialogData = new ConfirmDialogModel('Confirm', message);
  //   const dialogRef = this.matDialogService.openDialog(
  //     ConfirmDialogComponent,
  //     dialogData,
  //     '400px',
  //     true
  //   );
  //   dialogRef.afterClosed().subscribe((dialogResult) => {
  //     if (dialogResult) {
  //       this.loadResPresDelete = true;
  //       this.docService.deletePrescription(element.id).subscribe(() => {
  //         this.snackbarService.success('Prescription deleted successfully');
  //         // this.myInputVariable.nativeElement.value = '';
  //         this.prescriptions(this.patientId);
  //         this.loadResPresDelete = false;
  //       });
  //     }
  //   });
  // }
  omit_special_char(event): boolean {
    // const k;
    const k = event.charCode; //         k = event.keyCode;  (Both can be used)
    if (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    ) {
      return true;
    } else {
      return false;
    }
  }
  openAddMedication(element) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '426px',
      height: '62vh',
      data: element,
      position: {
        // right: '15vw',
        top: '8vh',
      },
    };
    this.dialog.closeAll();
    // const weightModalConfig = new MatDialogConfig();
    // weightModalConfig.disableClose = false;
    // (weightModalConfig.width = '485px'),
    // (weightModalConfig.height = '40vh'),
    // (weightModalConfig.position = { right: `15vw`, top: '8vh' }),
    // const addmedi = weightModalConfig.data = element;
    this.dialog
      .open(AddMedicationComponent, weightModalConfig)
      .afterClosed()
      .subscribe(() => {
        this.medicationHist(this.patientId);
      });
  }
  getPage(event) {
    this.pmed = event;
    this.medp = event;
  }
  imagePreview(img) {
    this.downloadProfileIcon(img);
  }
  downloadProfileIcon(img) {
    this.patientService.downloadPatientConsentForm(img);
  }

  actionToggleChange(tableRow) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are changing the status for "${
          tableRow.medicineName
        }" to "${
          tableRow.medicationStatus === 'ACTIVE' ? 'Inactive' : 'Active'
        }" . Please Confirm`,
      },
      // position: {
      //   // right: '15vw',
      //   top: '8vh',
      // },
    };
    this.dialog.closeAll();
    // const weightModalConfig = new MatDialogConfig();
    // weightModalConfig.disableClose = false;
    // (weightModalConfig.width = '485px'),
    // (weightModalConfig.height = '40vh'),
    // (weightModalConfig.position = { right: `15vw`, top: '8vh' }),
    // const addmedi = weightModalConfig.data = element;
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          // this.medicationHist(this.patientId);
          this.changedStatus = res;

          this.docService
            .changeMedicine(
              tableRow.medicationStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              tableRow.medicationId
            )
            .subscribe((res) => {
              this.snackbarService.success('Status updated successfully');
              this.medicationHist(this.patientId);

              // this.myInputVariable.nativeElement.value = '';
            });
        } else {
          this.medicationHist(this.patientId);
        }
      });
  }

  medicineNameErr() {
    return this.medicationForm.get('medicineName').hasError('required')
      ? 'Medicine is required'
      : this.medicationForm.get('medicineName').hasError('minlength')
      ? 'Enter minimum 2 characters'
      : this.medicationForm.get('medicineName').hasError('whitespace')
      ? 'Only spaces are not allowed'
      : this.medicationForm.get('medicineName').hasError('maxlength')
      ? 'Enter maximum 50 characters'
      : '';
  }

  medicationErr() {
    return this.medicationForm.get('medicineDose').hasError('required')
      ? 'Dose is required'
      : this.medicationForm.get('medicineDose').hasError('minlength')
      ? 'Enter minimum 1 characters'
      : this.medicationForm.get('medicineDose').hasError('pattern')
      ? 'Enter only numbers'
      : '';
  }
  quntityErr() {
    return this.medicationForm.get('quantity').hasError('required')
      ? 'Quantity is required'
      : this.medicationForm.get('quantity').hasError('minlength')
      ? 'Enter minimum 1 characters'
      : this.medicationForm.get('quantity').hasError('maxlength')
      ? 'Enter maximum 3 characters'
      : this.medicationForm.get('quantity').hasError('max')
      ? 'Enter only between 1 to 999'
      : this.medicationForm.get('quantity').hasError('min')
      ? 'Enter only between 1 to 999'
      : '';
  }
  daysErr() {
    return this.medicationForm.get('duration').hasError('required')
      ? 'Duration is required'
      : this.medicationForm.get('duration').hasError('minlength')
      ? 'Enter minimum 1 day'
      : this.medicationForm.get('duration').hasError('max')
      ? 'Enter maximum 365 days'
      : this.medicationForm.get('duration').hasError('pattern')
      ? 'Enter only numbers'
      : '';
  }
}
