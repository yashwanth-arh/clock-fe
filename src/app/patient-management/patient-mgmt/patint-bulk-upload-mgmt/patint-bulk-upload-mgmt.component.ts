import { BranchService } from 'src/app/branches/branch/branch.service';
import { HospitalManagementService } from './../../../hospital-management/service/hospital-management.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PatientManagementService } from 'src/app/patient-management/service/patient-management.service';
import { SnackbarService } from './../../../core/services/snackbar.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patint-bulk-upload-mgmt',
  templateUrl: './patint-bulk-upload-mgmt.component.html',
  styleUrls: ['./patint-bulk-upload-mgmt.component.scss']
})
export class PatintBulkUploadMgmtComponent implements OnInit {
  public uploadForm: FormGroup;
  branch: any = [];
  doctor: any = [];
  hospital: any = [];
  constructor(public fb: FormBuilder, private practiceService: HospitalManagementService, private branchService: BranchService,
    private snackBarService: SnackbarService, private patientMgmtService: PatientManagementService, public dialogRef: MatDialogRef<PatintBulkUploadMgmtComponent>) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      hospitalId: ['', Validators.compose([Validators.required])],
      branch: ['', Validators.compose([Validators.required])],
      primaryPhysician: ['', Validators.compose([Validators.required])],
      upload_file: ['', Validators.required],
    });
    this.practiceService.getPracticeList().subscribe((res: any) => {
      this.hospital = res.hospitalList.filter(
        (element) => element.name != null,
      );
    }, err => {
      // this.snackBarService.error(err.message);
    });
  }
  onSubmit() {
    const org_Id = this.uploadForm.get('hospitalId').value;
    const branch_Id = this.uploadForm.get('branch').value;
    const doc_Id = this.uploadForm.get('primaryPhysician').value;
    const org_data = this.hospital.find((ele) => {
      return ele.id == org_Id;
    });
    const branch_data = this.branch.find((ele) => {
      return ele.id == branch_Id;
    });
    const doctor_data = this.doctor.find((ele) => {
      return ele.id == doc_Id;
    });
    // 
    
    if (this.uploadForm.valid && org_data && branch_data && doctor_data) {
      const orgId = this.uploadForm.get('hospitalId').value;
      const branchId = this.uploadForm.get('branch').value;
      const docId = this.uploadForm.get('primaryPhysician').value;
      const orgName = org_data.name.trim();
      const branchName = branch_data.name.trim();
      const docName = doctor_data.name.trim();
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('upload_file').value);
      this.patientMgmtService.bulkUploadDevice(formData, orgId, orgName, branchId, branchName, docId, docName).subscribe(res => {
        if (res.status == 'success')
          {this.snackBarService.success('File uploaded successfully');}
        else
          {this.snackBarService.error(res.status);}
        this.dialogRef.close();
      },
        (error) => {
          this.snackBarService.error('Failed!', 2000);
        }
      );
    }

  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('upload_file').setValue(file);
    }
  }
  onhospitalSelection(event: any): any {
    this.branch = [];
    this.branchService
      .getFilteredhospitalBranch(event)
      .subscribe((res: any) => {
        if (res.branchList) {
          this.branch = res.branchList;
        }
      });

  }
  // onBranchSelection(event): any {
  //   this.doctor = [];
  //   this.branchService.getBranchDoctor(event,this.userRole).subscribe((data: any) => {
  //     this.doctor = data;
  //   });
  // }

}
