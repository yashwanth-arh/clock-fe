import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-audio-call-dialog',
  templateUrl: './audio-call-dialog.component.html',
  styleUrls: ['./audio-call-dialog.component.scss'],
})
export class AudioCallDialogComponent implements OnInit {
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<AudioCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const audioCallModalConfig = new MatDialogConfig();
    audioCallModalConfig.position = { top: '62px' };
    this.dialogRef?.updatePosition(audioCallModalConfig?.position);
  }

  compress() {
    this.dialogRef.updateSize('547px', '309px');
    this.dialogRef?.updatePosition({ top: '62px', right: '3px' });
    this.hide = false;
  }

  expand() {
    this.dialogRef?.updateSize('1826px', '92vh');
    this.dialogRef?.updatePosition({ top: '62' });
    this.hide = true;
  }
}
