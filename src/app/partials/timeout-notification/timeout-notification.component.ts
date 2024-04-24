import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeout-notification',
  templateUrl: './timeout-notification.component.html',
  styleUrls: ['./timeout-notification.component.scss']
})
export class TimeoutNotificationComponent implements OnInit {
  public timeoutText: string;
  constructor() { }

  ngOnInit(): void {
    // add some text
    this.timeoutText = `May be your internet connection strength is low!. Please check your connection and click ok to reload!.`;
  }

  onClickOk(): void {
    window.location.reload();
  }
}
