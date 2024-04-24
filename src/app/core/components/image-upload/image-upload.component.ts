import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  UserProfile,
  UserProfileResponse,
} from 'src/app/shared/entities/user-profile';
import { AuthStateService } from '../../services/auth-state.service';
import { SidenavService } from '../../services/sidenav.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ImgUploadService } from './img-upload.service';

export class ImageSnippet {
  pending = false;
  status = 'init';
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  @Input() imagePath;
  public selectedFile: ImageSnippet;
  public profileImagePath: SafeResourceUrl;
  public profileData: UserProfile;
  public profileName: string;
  leavingComponent: boolean = false;

  defaultImage: string = 'assets/svg/DashboardIcons/Patient.svg';
  s3BaseUrl: any;
  constructor(
    private imageService: ImgUploadService,
    private domSanitizerService: DomSanitizer,
    private snackBarService: SnackbarService,
    private sideNavService: SidenavService,
    private authStateService: AuthStateService
  ) {
    this.leavingComponent = false;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.s3BaseUrl = authDetails?.s3BaseUrl;
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }

  private onSuccess(): void {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
    setTimeout(() => {
      this.getProfile();
    }, 1000);
    this.snackBarService.success('Profile picture uploaded successfully', 1000);
  }

  private onError(): void {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
    this.snackBarService.error('Profile upload failed!', 1000);
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    this.authStateService.userLoggedIn.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          this.getProfile();
        }, 1000);
      }
    });
  }
  getCameraIcon() {}
  /**
   * process file for upload
   */
  processFile(imageInput: any): void {
    const file: File = imageInput.files[0];

    if (
      file.type.includes('png') ||
      file.type.includes('jpg') ||
      file.type.includes('jpeg') && file
    ) {
      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {
        this.selectedFile = new ImageSnippet(event.target.result, file);
        this.selectedFile.pending = true;

        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (res) => {
            this.onSuccess();
          },
          (err) => {
            this.onError();
          }
        );
      });
      reader.readAsDataURL(file);
    } else {
      this.snackBarService.error('File not supported', 2000);
    }
  }

  /**
   *  get profile object
   */
  public getProfile(): void {
    if (this.leavingComponent) {
      return;
    }
    this.imageService.getProfileData().subscribe(
      (res: UserProfileResponse | any) => {
        if (res instanceof HttpErrorResponse) {
          // it's error
        } else {
          this.profileData = res.userProfile;
          this.profileName =
            this.profileData?.firstName + ' ' + this.profileData?.lastName;
          this.profileImagePath = `${this.s3BaseUrl}${res.userProfile?.profileImage?.image}`;
          const defaultImg = 'assets/svg/DashboardIcons/Patient.svg';

          this.imagePath = res.userProfile?.profileImage?.image
            ? this.profileImagePath
            : defaultImg;
          this.sideNavService.setProfileImage(this.imagePath);
        }
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );
  }
}
