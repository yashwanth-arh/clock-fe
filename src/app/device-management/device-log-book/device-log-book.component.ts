import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-log-book',
  templateUrl: './device-log-book.component.html',
  styleUrls: ['./device-log-book.component.scss'],
})
export class DeviceLogBookComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  backToDevice() {
    this.router.navigate(['home/devices']);
  }
}
