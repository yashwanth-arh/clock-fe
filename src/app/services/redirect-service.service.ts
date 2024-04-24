import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../core/services/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectServiceService {

  constructor(
    private route: Router,
    private snackBarService: SnackbarService

  ) { }


  redirectToNotificationPage(): void {
    this.route.navigate(['/notification']).then((e) => { });
  }

  goToLinkUser(PatientId: string): void {
    localStorage.setItem('PatientRegId', PatientId);
    localStorage.setItem('url', this.route.url);
    this.snackBarService.success('Redirecting to iHealth portal.', 3000);
    setTimeout(() => {
      window.open(localStorage.getItem('ihealthLoginURL'));
    }, 3001);
  }

}
