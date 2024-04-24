import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-toggle-dialog',
  templateUrl: './action-toggle-dialog.component.html',
  styleUrls: ['./action-toggle-dialog.component.scss'],
})
export class ActionToggleDialogComponent implements OnInit {
  changedStatus: boolean;
  constructor(
    public dialogRef: MatDialogRef<ActionToggleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }

  // closeDialog(type): void {
  // this.changedStatus=type;
  // }
}
