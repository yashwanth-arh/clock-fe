import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss']
})
export class OfflineComponent implements OnInit {
  public isOnline: boolean;
  public status: string;
  public currentUrl:string;
  constructor(
    public dialogRef: MatDialogRef<OfflineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private connectionService: ConnectionService,
    private route: ActivatedRoute,private router:Router
  ) {
    this.status = 'Offline';
  }

  ngOnInit(): void {
    // 
    this.currentUrl=this.route.snapshot['_routerState'].url;
    this.connectionService.connectionMonitor().subscribe((checkInternet: boolean) => {

      
      this.isOnline = checkInternet;
      if (checkInternet) {
        this.status = 'Offline';
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.router.navigate([this.currentUrl]);
    window.location.reload();
  }


}
