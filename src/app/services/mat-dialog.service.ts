import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class MatDialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(
    component: any,
    data?: any,
    width?: any,
    close?: boolean
  ): MatDialogRef<any> {
    const dialogRef = this.dialog.open(component, {
      maxWidth: width,
      data: data,
      disableClose: close,
    });
    return dialogRef;
  }
  closeDialog(dialogRef: MatDialogRef<any>): void {
    dialogRef.close(true);
  }
}
