import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
  titleboo: boolean = true;
  tit: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    this.tit = data.tit;
    this.title = data.title;
    this.message = data.message;
    if (this.tit) {
      this.titleboo = false;
    }
  }

  closeDialog(type): void {
    this.dialogRef.close(type);
  }
}

export class ConfirmDialogModel {
  tit: string;
  constructor(public title: string, public message: string) {}
}
