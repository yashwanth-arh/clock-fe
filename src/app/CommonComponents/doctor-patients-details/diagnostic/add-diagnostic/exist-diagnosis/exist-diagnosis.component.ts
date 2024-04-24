import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exist-diagnosis',
  templateUrl: './exist-diagnosis.component.html',
  styleUrls: ['./exist-diagnosis.component.scss'],
})
export class ExistDiagnosisComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ExistDiagnosisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
