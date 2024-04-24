import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AuthStateService } from '../../services/auth-state.service';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
})
export class ProfileImageComponent implements OnInit {
  @Input() shapeOfImage: string;
  @Input() profileImage: SafeResourceUrl;
  defaultUrl = 'assets/svg/DashboardIcons/Patient.svg';
  constructor(
    private navService: SidenavService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.authStateService.userLoggedIn.subscribe((value) => {
      if (value) {
        this.navService.profileImage.subscribe((val: SafeResourceUrl) => {
          this.profileImage = val;
        });
      }
    });
  }
  showImage() {
    if (this.profileImage) {
      return this.profileImage;
    } else {
      return this.defaultUrl;
    }
  }
}
