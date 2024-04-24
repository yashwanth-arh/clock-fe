import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Idle } from '@ng-idle/core';

@Component({
  selector: 'app-timeout-dialog',
  templateUrl: './timeout-dialog.component.html',
  styleUrls: ['./timeout-dialog.component.scss'],
})
export class TimeoutDialogComponent implements OnInit {
  public countDown: number;
  constructor(
    public idle: Idle,
    public dialogRef: MatDialogRef<TimeoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.countDown = data.timeout;
  }

  ngOnInit(): void {
    // if (this.data) {
    this.idle?.onTimeoutWarning?.subscribe((count) => {
      this.countDown = count;
    });
    // }
  }
}
