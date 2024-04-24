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
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DoctorService } from 'src/app/doctor-management/service/doctor.service';

@Component({
  selector: 'app-provider-facility-map',
  templateUrl: './provider-facility-map.component.html',
  styleUrls: ['./provider-facility-map.component.scss'],
})
export class ProviderFacilityMapComponent implements OnInit {
  doctorsClinicDialog: FormGroup;
  clinicList = [];
  facility: any;
  public submitted = false;
  editClinicArr: any[] = [];
  showRightIcon: boolean = false;
  selectedFacility: any[] = [];
  mappedFacilities: any[] = [];
  facilityLists: any[] = [];
  showCancel: boolean = false;
  showSearch: boolean = true;
  adminAccess: string;
  constructor(
    public dialogRef: MatDialogRef<ProviderFacilityMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public branchService: BranchService,
    public doctorService: DoctorService,
    public snackBarService: SnackbarService,
    public dialog: MatDialog
  ) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
  }

  ngOnInit(): void {
    this.getAllFacilityList();
    this.doctorsClinicDialog = this.fb.group({
      clinicIds: ['', [Validators.required]],
    });
    this.adminAccess = localStorage.getItem('adminAccess');
  }

  get fields(): any {
    return this.doctorsClinicDialog.controls;
  }
  getAllFacilityList(): void {
    this.doctorService.getFacilityList().subscribe((data: any) => {
      this.clinicList = data;
      this.facilityLists = this.clinicList;
      this.clinicList.map((res) => {
        if (res) {
          res.added = false;
          return res;
        }
      });
      this.getMappedFacilities();
    });
  }
  searchFacility() {
    if (this.facility?.length > 1) {
      this.doctorService.searchFacility(this.facility).subscribe((res) => {
        this.clinicList = res;
        this.showCancel = true;
        this.showSearch = false;
      });
    } else {
      this.clinicList = this.facilityLists;
      this.showCancel = false;
    }
  }
  removeFacility() {
    this.clinicList = this.facilityLists;
    this.facility = '';
    this.showCancel = false;
    this.showSearch = true;
  }
  addFacility(list) {
    if (list.added) {
      return;
    }
    this.selectedFacility = [];
    this.selectedFacility.push(list.id);
    let body = {
      facilityId: this.selectedFacility,
      careProviderId: this.data.careProviderId,
    };
    this.doctorService.mapFacilityToProvider(body).subscribe((res) => {
      this.snackBarService.success('Facility mapped to provider successfully');
      list.added = true;
      this.getMappedFacilities();
    });
  }
  unmapFacility(item) {
    this.selectedFacility = [];
    this.selectedFacility.push(item.facilityId);
    let body = {
      facilityId: this.selectedFacility,
      careProviderId: this.data.careProviderId,
    };

    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Update Facility',
        content: `You are removing Facility “${item.facilityName}” for “${
          this.data.role == 'DOCTOR' ? 'Dr' : ''
        } ${this.data.firstName} ${this.data.lastName}”. Please confirm.`,
      },
    };
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.doctorService
            .unmapFacilityFromProvider(body)
            .subscribe((res) => {
              this.snackBarService.success('Facility unmapped successfully');
              this.getAllFacilityList();
            });
        }
      });
  }
  getMappedFacilities() {
    this.doctorService
      .mappedFacilities(this.data.careProviderId)
      .subscribe((res) => {
        this.mappedFacilities = res;
        this.clinicList.map((data) => {
          this.mappedFacilities.forEach((val) => {
            if (data?.id === val.facilityId && val.status !== 'INACTIVE') {
              data.added = true;
              return data;
            }
          });
        });
      });
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
