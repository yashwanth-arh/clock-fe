import { TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialog,
} from '@angular/material/dialog';
import { TouchSequence } from 'selenium-webdriver';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { BranchService } from 'src/app/branches/branch/branch.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';
@Component({
  selector: 'app-careprovider-my-teams',
  templateUrl: './careprovider-my-teams.component.html',
  styleUrls: ['./careprovider-my-teams.component.scss'],
})
export class CareproviderMyTeamsComponent implements OnInit {
  doctorsClinicDialog: FormGroup;
  careProviderList = [];
  careprovider: any;
  public submitted = false;
  editClinicArr: any[] = [];
  showRightIcon: boolean = false;
  selectedProvider: any[] = [];
  mappedCareproviders: any[] = [];
  providerLists: any[] = [];
  user: any;
  userRole: any;
  showCancel: boolean = false;
  showSearch: boolean = true;
  adminAccess: string;
  constructor(
    public dialogRef: MatDialogRef<CareproviderMyTeamsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public branchService: BranchService,
    public doctorService: DoctorService,
    public snackBarService: SnackbarService,
    private auth: AuthService,
    private dialog: MatDialog,
    private titlecasePipe: TitleCasePipe
  ) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
  }

  ngOnInit(): void {
    this.user = this.auth.authData;
    this.userRole = this.user?.userDetails?.userRole;
    this.getAllMappedCareProviders();
    this.doctorsClinicDialog = this.fb.group({
      clinicIds: ['', [Validators.required]],
    });
    this.adminAccess = localStorage.getItem('adminAccess');
  }

  get fields(): any {
    return this.doctorsClinicDialog.controls;
  }
  getAllMappedCareProviders(): void {
    if (this.userRole === 'FACILITY_USER' || this.userRole === 'CAREPROVIDER') {
      this.doctorService.getCareProviders().subscribe((data: any) => {
        this.careProviderList = data.careProviderList;
        this.careProviderList.map((res, i) => {
          if (res.careProviderId === this.data.careProviderId) {
            this.careProviderList.splice(i, 1);
          }
        });

        this.providerLists = this.careProviderList;

        this.careProviderList.map((res) => {
          if (res) {
            res.added = false;
            return res;
          }
        });
        this.getMappedCareproviders();
      });
    } else if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'CAREPROVIDER'
    ) {
      this.doctorService
        .getCareProvidersById(this.data.careProviderId)
        .subscribe((data: any) => {
          this.careProviderList = data.careProviderList;

          this.providerLists = this.careProviderList;
          this.careProviderList.map((res) => {
            if (res) {
              res.added = false;
              return res;
            }
          });
          this.getMappedCareproviders();
        });
    }
  }
  searchCareprovider() {
    if (this.userRole === 'FACILITY_USER' || this.userRole === 'CAREPROVIDER') {
      if (this.careprovider?.length > 2) {
        this.doctorService
          .searchHospitalAdminCareProviders(
            this.data.careProviderId,
            this.careprovider
          )
          .subscribe((res) => {
            this.careProviderList = res.careProviderList;
            this.showCancel = true;
            this.showSearch = false;
          });
      } else {
        this.careProviderList = this.providerLists;
        this.showCancel = false;
        this.showSearch = true;
      }
    } else if (
      this.userRole === 'HOSPITAL_USER' ||
      this.userRole === 'CAREPROVIDER'
    ) {
      if (this.careprovider?.length > 2) {
        this.doctorService
          .searchHospitalAdminCareProviders(
            this.data.careProviderId,
            this.careprovider
          )
          .subscribe((res) => {
            this.careProviderList = res.careProviderList;
            this.showCancel = true;
            this.showSearch = false;
          });
      } else {
        this.careProviderList = this.providerLists;
        this.showCancel = false;
        this.showSearch = true;
      }
    }
  }
  removeCareProvider() {
    this.careProviderList = this.providerLists;
    this.showCancel = false;
    this.showSearch = true;
    this.careprovider = '';
  }
  addCareprovider(list) {
    if (list.added) {
      return;
    }
    this.selectedProvider = [];
    this.selectedProvider.push(list.id);
    let body = {
      requestTo: this.data.careProviderId,
      requestFrom: list.careProviderId,
    };
    this.doctorService.mapCareproviderToProvider(body).subscribe((res) => {
      this.snackBarService.success('Careprovider mapped successfully');
      list.added = true;
      this.getMappedCareproviders();
    });
  }
  unmapCareprovider(list) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Update Team',
        content: `You are removing “${list.firstName} ${list.lastName}” from the team. Please confirm.`,
      },
    };
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.selectedProvider = [];
          this.selectedProvider.push(list.careProviderId);
          let body = {
            requestTo: this.data.careProviderId,
            requestFrom: list.requestFrom,
          };
          this.doctorService
            .unmapCareProviderFromProvider(body)
            .subscribe((res) => {
              this.snackBarService.success(
                'Careprovider unmapped successfully'
              );
              this.getAllMappedCareProviders();
            });
        }
      });
  }
  getMappedCareproviders() {
    this.doctorService
      .mappedCareProviders(this.data.careProviderId)
      .subscribe((res) => {
        this.mappedCareproviders = res.mappedList;
        this.careProviderList.map((data) => {
          this.mappedCareproviders.forEach((val) => {
            if (data?.careProviderId === val.requestFrom) {
              data.added = true;
              return data;
            }
          });
        });
      });
  }
  getProviderName(list) {
    return (
      this.titlecasePipe.transform(list.firstName) +
      ' ' +
      this.titlecasePipe.transform(list.lastName)
    );
  }
  dummySubmit(): void {
    this.submitted = true;
    if (this.doctorsClinicDialog.invalid) {
      this.submitted = false;
      return;
    }
    const formValue = this.doctorsClinicDialog.value;
    const clincs = formValue.clinicIds.toString();
    this.doctorService.addClinicsToDoctor(this.data?.id, clincs).subscribe(
      (data) => {
        this.snackBarService.success('Assigned successfully!', 2000);
        // this.dialogRef.close();
      },
      (error) => {
        this.snackBarService.error('Failed!', 2000);
      }
    );
  }
}
