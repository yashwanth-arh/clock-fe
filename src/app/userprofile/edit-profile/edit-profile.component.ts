import { Component, OnInit } from '@angular/core';
import {  FormBuilder,  FormGroup,  Validators,} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profile:FormGroup

  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<EditProfileComponent>) { }

  ngOnInit(): void {
    this.validateHospitalForm();
  }

  private validateHospitalForm() {
    this.profile = this.fb.group({
      name: ['', Validators.required],
      emailid: ['', Validators.required],
      contactno: ['', Validators.required],
      role: ['', Validators.required],
    });
  }
}
