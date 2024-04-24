import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../CommonComponents/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../core/services/snackbar.service';
import { DeviceTypeService } from '../settings-management/services/device-type.service';
import { TicketService } from '../ticket/ticket.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CaregiverDashboardService } from '../CareproviderDashboard/caregiver-dashboard.service';
import { PatientManagementService } from '../patient-management/service/patient-management.service';
import { HospitalManagementService } from '../hospital-management/service/hospital-management.service';

@Component({
  selector: 'app-createsupportticket',
  templateUrl: './createsupportticket.component.html',
  styleUrls: ['./createsupportticket.component.scss'],
})
export class CreatesupportticketComponent implements OnInit, AfterViewInit {
  pdfimageSrc: any = [];
  vendorForm: FormGroup;
  body = new FormData();
  dataValue: any;
  imageSrc: any = [];
  compressImage: any;
  defaultSupport: any;
  attachment: any = [];
  selectedFiles: any = [];
  attachmentId: any;
  showImageIcon: string;
  showPDFIcon: string;
  seletedFileValues: any[] = [];
  imageName: string;
  pdfName: string;
  description: string = 'Description';
  details: any;
  userRole: any;
  submitted: boolean = false;
  datas: any;
  token: any;
  initializeCreateDeviceForm() {
    // this.vendorForm = this.fb.group({
    //   vendorName: [
    //     this.data ? this.data['vendorName'] : '',
    //     Validators.required,
    //   ],
    // });
    this.vendorForm = this.fb.group({
      ticketDescription: [
        this.dataValue.ticketDescription,
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(3000),
        ]),
      ],
      ticketSummary: [
        this.dataValue.ticketSummary,
        Validators.compose([Validators.required]),
      ],
      raisedToFacility: [this.dataValue.raisedToFacility, ''],
    });
  }
  constructor(
    public dialogRef: MatDialogRef<CreatesupportticketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
    private router: Router,
    private fb: FormBuilder,
    public hospitalService: HospitalManagementService,
    private service: DeviceTypeService,
    private services: CaregiverDashboardService,
    public snackbarService: SnackbarService,
    public ticketservice: TicketService,
    private _sanitizer: DomSanitizer,
    private dashboardService: CaregiverDashboardService,
    private patientService: PatientManagementService,
    public dialog: MatDialog
  ) {
    this.dataValue = data;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userRole = authDetails?.userDetails?.userRole;

    // this.imageSrc=this.dataValue?.attachmentUrl
  }
  ngOnInit() {
    this.initializeCreateDeviceForm();
    this.getAllTitles();
    setTimeout(() => {
      this.getDoctorDetails();
    }, 1000);
    if (this.userRole === 'CAREPROVIDER') {
      this.vendorForm.get('raisedToFacility').clearValidators();
      this.vendorForm
        .get('raisedToFacility')
        ?.setValidators(Validators.compose([Validators.required]));
      this.vendorForm.get('raisedToFacility')?.updateValueAndValidity();
    } else {
      this.vendorForm.removeControl('raisedToFacility');
    }
    this.token = this.randomStr(10, '12345abcde');
  }
  randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr?.length)];
    }
    return ans;
  }
  ngAfterViewInit(): void {
    if (this.dataValue !== 'add') {
      this.hospitalService
        .getSupportTicketsId(this.dataValue?.id)
        .subscribe((res) => {
          this.attachment = res?.Attachements;

          this.attachment = this.attachment.map((data) => {
            return data;
          });
          this.attachment.forEach((datas) => {
            this.downloadProfileIcon(datas);
          });
        });
    }
  }

  getDescriptionError() {
    return this.vendorForm.get('ticketDescription').hasError('required')
      ? 'Ticket Description is required'
      : this.vendorForm.get('ticketDescription').errors?.maxlength
      ? 'Description cant be more than 3000 characters'
      : this.vendorForm.get('ticketDescription').errors?.minlength
      ? 'Enter minimum 6 characters'
      : '';
  }
  getSummary() {
    this.vendorForm.get('ticketDescription').clearValidators();
    this.vendorForm.get('ticketDescription')?.updateValueAndValidity();

    if (this.vendorForm.get('ticketSummary').value == 'Others') {
      this.description = 'Description*';
      this.vendorForm.get('ticketDescription').clearValidators();
      this.vendorForm
        .get('ticketDescription')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(3000),
          ])
        );
      this.vendorForm.get('ticketDescription')?.updateValueAndValidity();
      // this.getDescriptionError();
    } else {
      this.description = 'Description';

      this.vendorForm.get('ticketDescription').clearValidators();
      this.vendorForm
        .get('ticketDescription')
        ?.setValidators(
          Validators.compose([
            Validators.minLength(6),
            Validators.maxLength(3000),
          ])
        );
      this.vendorForm.get('ticketDescription')?.updateValueAndValidity();
    }
  }

  downloadProfileIcon(url) {
    this.dashboardService.downloadProfileIcons(url.documentPath).subscribe(
      (res) => {
        if (res['fileName'].includes('pdf')) {
          this.pdfimageSrc.push({ url: 'assets/svg/pdf img.svg', id: url.id });
        } else {
          this.imageSrc.push({
            url: this._sanitizer.bypassSecurityTrustResourceUrl(
              'data:image/jpg;base64,' + res['file']
            ),
            id: url.id,
          });
        }
      },
      (err) => {}
    );
  }
  imagePreview() {
    this.patientService.downloadPatientConsentForm(
      this.dataValue.attachmentUrl
    );
  }

  uploadImage(event) {
    this.body.delete('files');
    this.seletedFileValues = [];
    this.pdfimageSrc = [];
    this.selectedFiles = [];
    this.imageName = '';

    const file: File = event.target.files[0];

    if (file && this.validateFile(file)) {
      for (let i = 0; i < event.target.files.length; i++) {
        // this.imageSrc.push(event.target.files[i]);

        if (
          event.target.files[i].type.includes('pdf') ||
          event.target.files[i].type.includes('png') ||
          event.target.files[i].type.includes('jpg') ||
          event.target.files[i].type.includes('jpeg')
        ) {
          if (event.target.files[0]?.type.includes('pdf')) {
            this.pdfimageSrc.push('assets/svg/pdf img.svg');
            this.body.append('files', event.target.files[0]);
            this.pdfName = event.target.files[0]?.name;
            this.showPDFIcon = 'assets/svg/Pdf Icon.svg';
            this.seletedFileValues.push({
              name: this.pdfName,
              icon: this.showPDFIcon,
            });
          } else {
            this.body.append('files', event.target.files[0]);
            this.selectedFiles.push(event.target.files[0]);
            this.imageName = event.target.files[0]?.name;
            this.showImageIcon = 'assets/svg/Image Icon.svg';
            this.seletedFileValues.push({
              name: this.imageName,
              icon: this.showImageIcon,
            });
            if (event.target.files && event.target.files[0]) {
              // var filesAmount = event.target.files.length;
              // for (let i = 0; i < filesAmount; i++) {
              const reader = new FileReader();

              reader.onload = (events: any) => {
                this.imageSrc.push(events.target.result);

                //  this.myForm.patchValue({
                //     fileSource: this.images
                //  });
              };

              reader.readAsDataURL(event.target.files[0]);
              // }
            }
          }
        } else {
          this.snackbarService.error('File not supported', 2000);
          return;
        }
      }
    } else {
      event.target.value = '';
    }
  }

  validateFile(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 100KB

    if (file.size > maxSize) {
      console.error('File size exceeds the maximum limit of 100KB.');
      this.snackbarService.error(
        'File size exceeds the maximum limit of 10MB.'
      );

      return false;
    }

    return true;
  }

  getDoctorDetails(): void {
    if (this.userRole == 'CAREPROVIDER') {
      this.datas = JSON.parse(localStorage.getItem('careproviderDetails'));
      this.details = this.datas.facilities;
      // this.services.getUserDetails().subscribe(
      //   (data) => {
      //     this.details = data.facilities;
      //   },
      //   (err) => {}
      // );
    }
  }
  removeSelectedFile(i, img) {
    if (this.dataValue == 'add') {
      const ele = document.getElementById('files') as HTMLInputElement;
      ele.value = '';
      this.imageSrc.splice(i, 1);
      this.selectedFiles.splice(i, 1);
      this.body.delete('files');
      if (this.selectedFiles.length) {
        this.selectedFiles.forEach((data) => {
          this.body.append('files', data);
        });
      }
      this.pdfimageSrc.splice(i, 1);
      this.seletedFileValues.splice(i, 1);
    } else {
      const message = `Are you sure you want delete?`;
      const dialogData = new ConfirmDialogModel('Confirm', message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          this.ticketservice.deleteTicketAttachmentById(img.id).subscribe(
            () => {
              const ele = document.getElementById('files') as HTMLInputElement;
              ele.value = '';
              if (this.imageSrc.length) {
                this.imageSrc.splice(i, 1);
              }
              if (this.pdfimageSrc.length) {
                this.pdfimageSrc.splice(i, 1);
              }

              this.snackbarService.success('Attachment deleted successfully');
            },
            (err) => {
              this.snackbarService.error('Could not delete attachment');
            }
          );
        }
      });
    }
  }
  getAllTitles() {
    this.ticketservice.getAllTitles().subscribe(
      (res) => {
        this.defaultSupport = res?.['questions'];
      },
      (err) => {}
    );
  }

  submitSupportTickets() {
    this.submitted = true;

    if (this.userRole === 'CAREPROVIDER') {
      const payload = {
        ticketDescription: this.vendorForm.get('ticketDescription').value,
        ticketSummary: this.vendorForm.get('ticketSummary').value,
        raisedToFacility: this.vendorForm.get('raisedToFacility').value,
        token: this.token,
      };
      this.body.append('ticketsPayload', JSON.stringify(payload));
    } else {
      const payload = {
        ticketDescription: this.vendorForm.get('ticketDescription').value,
        ticketSummary: this.vendorForm.get('ticketSummary').value,
        token: this.token,
      };
      this.body.append('ticketsPayload', JSON.stringify(payload));
    }
    // if (this.ticketId) {
    //   this.ticketservice.updateTicket(this.body, this.ticketId).subscribe(
    //     (res) => {
    //       this.snackbarService.success('Ticket updated successfully');
    //       this.vendorForm.reset();
    //       this.body.delete('files');
    //       this.imageSrc = '';

    //     },
    //     (err) => {
    //       this.body.delete('Attachments');
    //       this.snackbarService.error(err.message);
    //     }
    //   );
    // }
    if (this.dataValue === 'add') {
      this.ticketservice.createTicket(this.body).subscribe(
        (res) => {
          this.snackbarService.success('Ticket created successfully');
          this.vendorForm.reset();
          this.body.delete('files');
          this.imageSrc = [];
          this.pdfimageSrc = [];
          this.dialogRef.close(true);
          this.body.delete('Attachments');
          this.submitted = false;
        },
        (err) => {
          this.snackbarService.error(err.message);

          this.body.delete('ticketsPayload');
          this.submitted = false;
        }
      );
    } else {
      this.ticketservice.updateTicket(this.body, this.dataValue.id).subscribe(
        (res) => {
          this.snackbarService.success('Ticket updated successfully');
          this.vendorForm.reset();
          this.body.delete('files');
          this.imageSrc = [];
          this.selectedFiles = [];
          this.pdfimageSrc = [];
          this.dialogRef.close(true);
          this.body.delete('Attachments');
          this.submitted = false;
        },
        (err) => {
          this.body.delete('Attachments');
          this.snackbarService.error(err.message);
          this.submitted = false;
        }
      );
    }
  }
}
