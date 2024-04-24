import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PatientManagementService } from '../../service/patient-management.service';
import { PatientConsentFormDialogComponent } from '../patient-consent-form-dialog/patient-consent-form-dialog.component';

@Component({
  selector: 'app-patient-consent-form',
  templateUrl: './patient-consent-form.component.html',
  styleUrls: ['./patient-consent-form.component.scss'],
})
export class PatientConsentFormComponent implements OnInit {
  patientId: string;
  consentFormId: string;
  consentForms: any[] = [];
  imageUrl: any;
  pdfSrc: string;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private patService: PatientManagementService
  ) {
    this.pdfSrc =
      'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  }

  ngOnInit(): void {
    this.imageUrl = environment.imagePathUrl;
    this.patientId = this.route.snapshot.params.id;
    this.getConsentForm();
  }
  goToEnrollments(): void {
    this.router.navigate(['/home/patients']);
  }
  openAddPatientConsentDialog() {
    const editDialogRef = this.dialog.open(PatientConsentFormDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '40%',
      data: this.route.snapshot.params.id,
    });

    editDialogRef.afterClosed().subscribe(() => {});
  }
  downloadPatientConsentForm(): any {
    this.patService.downloadPatientConsentForm(
      this.consentForms[0].fileDownloadUrl
    );
  }

  getConsentForm() {
    this.patService.getPatientConsentFormByPatId(this.patientId).subscribe(
      (res) => {
        this.consentForms = res['consentFormListMap'];
      },
      (err) => {}
    );
  }
}
