import { AuthService } from './../../../core/services/auth.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { SnackbarService } from './../../../core/services/snackbar.service';
import { Component, OnInit, Inject } from '@angular/core';
import { DoctorDashboardService } from 'src/app/doctor-dashboard/doctor-dashboard.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-note-share-dialog',
  templateUrl: './note-share-dialog.component.html',
  styleUrls: ['./note-share-dialog.component.scss'],
})
export class NoteShareDialogComponent implements OnInit {
  roleid: any;
  userRole: string;
  caregiverLists: any = [];
  patientId: any;
  doctorDetails: any;
  selectedOptions: any = [];
  notesArr: any = [];
  personAdded = false;
  scopeId: any;
  checkboxItems = [];
  selectedIds: number[] = [];
  constructor(
    private auth: AuthService,
    private service: CaregiverDashboardService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<NoteShareDialogComponent>,
    private docService: DoctorDashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.patientId = data.patientId;
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.scopeId = user?.userDetails?.['scopeId'];
    this.userRole = user?.userDetails?.userRole;
  }

  ngOnInit(): void {
    this.caregiverlist(this.patientId);
    this.docDetails();
  }

  getName(e) {
    return e?.id !== this.scopeId ? e?.firstName + ' ' + e?.lastName : '';
  }

  toggleCheckbox(id) {
    const index = this.selectedIds.indexOf(id);
    if (index === -1) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds.splice(index, 1);
    }
  }

  isSelected(id) {
    return this.selectedIds.includes(id);
  }

  toggleSelectAll() {
    if (this.areAllSelected()) {
      this.selectedIds = [];
    } else {
      this.selectedIds = this.caregiverLists.map((item) => item);
    }
  }

  areAllSelected(): boolean {
    return this.selectedIds.length === this.caregiverLists.length;
  }

  caregiverlist(id) {
    // if (this.userRole == 'CAREGIVER') {
    // this.service.getcaregiverList().subscribe(
    //   (res) => {
    // this.caregiverLists = [];
    this.service.getDoctorDetails().subscribe(
      (data) => {
        // this.doctorDetails = data?.careProviders;
        data.careProviders.map((e) => {
          if (e.requestFrom !== this.scopeId) {
            this.caregiverLists.push(e);
            // Create a form control for each checkbox and add them to the form array
          }
        });

        const docObj = {
          id: this.doctorDetails?.id,
          name: this.doctorDetails?.firstName,
        };
        // this.caregiverLists.push(docObj);
        // res.forEach((e) => {
        //   const caregiverObj = { id: e.careGiverId, name: e.name };
        //   this.caregiverLists.push(caregiverObj);
        // });
      },
      (err) => {
        // this.snackbarService.error(err.error?.message);
      }
    );

    //   },
    //   (err) => {
    //     // this.snackbarService.error(err.error?.message);
    //   }
    // );
    // }
    // else {
    //   this.docService.getcaregiverList(id).subscribe(
    //     (res) => {
    //       res.forEach((e) => {
    //         const caregiverObj = { id: e.careGiverId, name: e.name };
    //         this.caregiverLists.push(caregiverObj);
    //       });
    //     },
    //     (err) => {
    //       // this.snackbarService.error(err.error?.message);
    //     }
    //   );
    // }
  }
  docDetails() {
    this.service.getDoctorDetails().subscribe(
      (res) => {
        this.doctorDetails = res?.careProviders;
      },
      (err) => {
        // this.snackbarService.error(err?.message);
      }
    );
  }
  randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }
  saveAndShareNote() {
    if (!this.selectedIds.length) {
      this.snackbarService.error('No person selected to share');
    } else {
      this.personAdded = true;
      this.dialogRef.close(this.selectedIds);
    }
    // this.selectedOptions.forEach((e) => {
    //   let content = {
    //     "patientId": this.patientId,
    //     "description": this.data.description,
    //     "senderId": this.data.senderId,
    //     "senderName": this.data.senderName,
    //     "receiverId": e.id,
    //     "receiverName": e.name,
    //     "flag": this.randomStr(10, '12345abcde'),
    //     "eShared": 1
    //   }
    //   this.notesArr.push(content);
    // })
    // let body = {
    //   patientNotes: this.notesArr
    // }
    // this.service.createNotes(body).subscribe((res) => {
    //   this.snackbarService.success('Note added and shared successfully');
    //   this.dialogRef.close(res);
    // });
  }

  // if (ele == 'add') {
  //   this.service.createNotes(content).subscribe((res) => {
  //     this.snackbarService.success('Note added and shared successfully');
  //     this.getNotes(this.patientId);
  //     this.cancelNote();
  //   });
  // }
}
