import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';
import { MatDialogService } from 'src/app/services/mat-dialog.service';
import { environment } from 'src/environments/environment';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActionToggleDialogComponent } from '../action-toggle-dialog/action-toggle-dialog.component';
import { element } from 'protractor';
import { FormControl, Validators } from '@angular/forms';
import { ImagePreviewComponent } from './image-preview/image-preview.component';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent implements OnInit, OnDestroy {
  userRole: string;
  singleControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  loadRes = true;
  imagePath: any = [];
  imageUrl: string;
  loadPresRes = true;
  showNewChooseFile = false;
  @ViewChild('f') myNgForm: any;
  columns: any = [
    // 'updatedBy',
    'date',
    'fileName',
    'actions',
  ];
  status: string[] = ['ACTIVE', 'INACTIVE'];
  patientId: string;
  loadResPresDelete: boolean;
  imageTitle: string;
  imageSrc: string;
  compressImage: any;
  body = new FormData();
  pdfimageSrc: string;
  isSubmitted: boolean;
  loadResAddEditMedication: boolean;
  pres = 1;
  presSizeCaregiver = 5;
  presSizeDoctor = 4;
  medicationHistoryList: any = [];
  medicationDataSource: any;
  addPermission: string;
  userid: any;
  urls: any;
  leavingComponent = false;

  constructor(
    private auth: AuthService,
    private service: CaregiverDashboardService,
    private snackbarService: SnackbarService,
    private patientService: PatientManagementService,
    private matDialogService: MatDialogService,
    public dialog: MatDialog,
    private docService: DoctorDashboardService,
    private caregiverSharedservice: CaregiverSharedService
  ) {
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.urls = environment.s3Baseurl;
    const user = this.auth.authData;
    this.imageUrl = environment.imagePathUrl;
    this.addPermission = localStorage.getItem('medicationPermission');
    this.userRole = user?.userDetails?.userRole;
    this.patientId = localStorage.getItem('patientId');
    this.userid = user.userDetails['scopeId'];
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }

  ngOnInit(): void {
    this.leavingComponent = false;

    this.caregiverSharedservice.triggerdMedications.subscribe((value) => {
      if (Object.keys(value).length !== 0) {
        // this.medicationHist(value['id']);
        this.prescriptions(localStorage.getItem('patientId'));
      } else {
        // this.medicationHist(this.patientId);
        this.prescriptions(localStorage.getItem('patientId'));
      }
    });
  }
  openImage(img) {
    img.includes('pdf');
    if (img.includes('pdf')) {
      window.open(img, '_blank');
    } else {
      const pastActivityDialog: MatDialogConfig = {
        disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vh',
        // width: '300px',
        data: { image: img },
      };
      // The user can't close the dialog by clicking outside its body
      this.dialog
        .open(ImagePreviewComponent, pastActivityDialog)
        .afterClosed()
        .subscribe((e) => {});
    }
  }
  actionToggleChange(tableRow) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '382px',
      height: '182px',
      data: {
        title: 'Status Change',
        content: `You are changing the status from ${
          tableRow.status === 'ACTIVE' ? 'Active' : 'Inactive'
        } to ${
          tableRow.status === 'ACTIVE' ? 'Inactive' : 'Active'
        } for prescription. Please Confirm`,
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
      .subscribe((e) => {
        if (e) {
          this.service
            .updatePrescriptionStatus(
              tableRow.prescriptionId,
              tableRow.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            )
            .subscribe((res) => {
              this.snackbarService.success('Status updated successfully');
              this.prescriptions(this.patientId);
            });
        } else {
          this.prescriptions(this.patientId);
        }
      });
  }
  // openPreview(e, i) {
  //   // window.open(e + i);
  //   const imageUrl = 'https://qa-guide.clockhealth.com/Clockhealthcare-Upload/clock_files/prescription/prescription.png';
  //   URL.createObjectURL(imageUrl);
  //   window.open(
  //     URL.createObjectURL(imageUrl),
  //     '_blank',
  //     'toolbar=0,location=0,menubar=0'
  //   );
  // }

  // medicationHist(id) {
  //   this.service.getMedicationHistory(id).subscribe(
  //     (data) => {
  //       this.medicationHistoryList = data;
  //       if (this.medicationHistoryList.length) {
  //         this.medicationHistoryList?.sort(
  //           (a, b) => new Date(b.date1).getTime() - new Date(a.date1).getTime()
  //         );

  //         this.medicationDataSource = this.medicationHistoryList;
  //       }
  //       this.loadRes = false;
  //     },
  //     (err) => {
  //       // this.snackbarService.error(err.message);
  //     }
  //   );
  // }

  prescriptions(id) {
    if (this.leavingComponent) {
      return;
    }
    this.loadPresRes = true;
    this.service.getPrescriptions(id).subscribe(
      (data) => {
        this.imagePath = data.content;
        this.loadPresRes = false;
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }
  uploadprescriptions(id) {
    this.service.uploadPrescrition(id).subscribe(
      () => {
        this.showNewChooseFile = true;
        this.snackbarService.success('File uploaded successfully');
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }

  imagePreview(img) {
    this.downloadProfileIcon(img);
  }
  downloadProfileIcon(img) {
    this.patientService.downloadPatientConsentForm(img);
  }

  confirmDialogPrescription(element): void {
    const message = `Are you sure you want delete?`;
    const dialogData = new ConfirmDialogModel('Confirm', message);
    const dialogRef = this.matDialogService.openDialog(
      ConfirmDialogComponent,
      dialogData,
      '400px',
      true
    );
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.loadResPresDelete = true;
        this.docService
          .deletePrescription(element.prescriptionId)
          .subscribe(() => {
            this.snackbarService.success('Prescription deleted successfully');
            // this.myInputVariable.nativeElement.value = '';
            this.prescriptions(this.patientId);
            this.loadResPresDelete = false;
          });
      }
    });
  }

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

  getInputValues(event) {
    if (event.target.type === 'text') {
      this.imageTitle = '' || event.target.value;
    } else {
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
    this.isSubmitted = this.imageTitle.length <= 2 || !this.body.has('file');
  }

  removeSelectedFile() {
    const ele = document.getElementById('file') as HTMLInputElement;
    ele.value = '';
    this.imageSrc = '';
    this.pdfimageSrc = '';
    this.body.delete('file');
    this.body.delete('patientId');
    this.body.delete('fileName');
    this.isSubmitted = true;
  }
  canclePrescriptioForm() {
    this.imageTitle = '';
    this.imageSrc = '';
    this.pdfimageSrc = '';
    this.imageTitle = '';
    this.singleControl.reset();
    this.myNgForm.resetForm();
  }
  savePrescription() {
    this.isSubmitted = true;
    if (!this.imageTitle) {
      this.snackbarService.error('Enter prescription title');
      this.isSubmitted = false;
      return;
    }
    if (this.imageTitle.length < 3) {
      this.snackbarService.error('Enter minimum 3 characters');
      this.isSubmitted = false;
      return;
    }
    if (this.imageTitle.length > 30) {
      this.snackbarService.error('Enter maximum 30 characters');
      this.isSubmitted = false;
      return;
    }
    if (this.body.has('patientId')) {
      this.body.delete('patientId');
      this.body.append('patientId', this.patientId);
    } else {
      this.body.append('patientId', this.patientId);
    }
    if (this.body.has('fileName')) {
      this.body.delete('fileName');
      this.body.append('fileName', this.imageTitle);
    } else {
      this.body.append('fileName', this.imageTitle);
    }

    this.docService.uploadPrescrition(this.body, this.patientId).subscribe(
      (res) => {
        this.snackbarService.success(res.message);
        this.prescriptions(this.patientId);
        this.body.delete('file');
        this.singleControl.reset();
        this.isSubmitted = false;
        this.imageSrc = '';
        this.pdfimageSrc = '';
        this.imageTitle = '';
        this.myNgForm.resetForm();
      },
      () => {
        // this.snackbarService.error('Failed to upload', 2000);
        this.isSubmitted = false;
      }
    );
  }
}
