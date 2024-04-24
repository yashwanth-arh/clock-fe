import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activation-info-page',
  templateUrl: './activation-info-page.component.html',
  styleUrls: ['./activation-info-page.component.scss']
})
export class ActivationInfoPageComponent {

  constructor(private router:Router) { }

  // ngOnInit(): void {;
  // };

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
