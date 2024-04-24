import { TitleCasePipe } from '@angular/common';
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-my-care-team',
  templateUrl: './my-care-team.component.html',
  styleUrls: ['./my-care-team.component.scss']
})
export class MyCareTeamComponent implements OnInit {
  careTeam: any;

  constructor(
    public dialogRef: MatDialogRef<MyCareTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private titlecasePipe: TitleCasePipe,
  ) {
    
   }

  ngOnInit(): void {

    this.careTeam=this.data.content
  }
  getPhysicianName(element) {
    return (
      (element?.firstName
        ? this.titlecasePipe.transform(element.firstName)
        : '') +
      ' ' +
     
      (element?.lastName ? this.titlecasePipe.transform(element.lastName) : '')
    );
  }

}
