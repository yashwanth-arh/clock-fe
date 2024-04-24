import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-note-read-more',
  templateUrl: './note-read-more.component.html',
  styleUrls: ['./note-read-more.component.scss']
})
export class NoteReadMoreComponent {

  constructor(public dialogRef: MatDialogRef<NoteReadMoreComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
