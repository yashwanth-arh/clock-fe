import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent {
  @Input() name: string;
  @Input() date: any;
  @Input() image: string;
  constructor() {
  }
}
