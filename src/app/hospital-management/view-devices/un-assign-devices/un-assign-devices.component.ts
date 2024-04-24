import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-un-assign-devices',
  templateUrl: './un-assign-devices.component.html',
  styleUrls: ['./un-assign-devices.component.scss'],
})
export class UnAssignDevicesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UnAssignDevicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }
  confirm() {
    this.dialogRef.close(true);
  }
}
