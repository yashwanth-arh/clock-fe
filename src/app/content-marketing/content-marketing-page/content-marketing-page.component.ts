import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditContentMarketingComponent } from '../add-edit-content-marketing/add-edit-content-marketing.component';
import { ContentMarketing } from '../content-marketing.service';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ActionToggleDialogComponent } from 'src/app/CommonComponents/doctor-patients-details/action-toggle-dialog/action-toggle-dialog.component';
import { FilterSharedService } from 'src/app/core/services/filter-shared.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-content-marketing-page',
  templateUrl: './content-marketing-page.component.html',
  styleUrls: ['./content-marketing-page.component.scss'],
})
export class ContentMarketingPageComponent implements OnInit,OnDestroy {
  contentList: any[] = [];
  pageSizeOptions = [9, 25, 100];
  length;
  pageIndex = 0;
  @ViewChild('videoPlayer', { static: false }) videoPlayerRef: ElementRef;

  video: HTMLVideoElement;
  leavingComponent: boolean = false;
  isVideoPlaying: boolean;
  adminAccess: string;
  basePath: any;
  searchQuery: any;
  statusFilter: any;
  changeStatus: string;
  constructor(
    public dialog: MatDialog,
    private contentMarketing: ContentMarketing,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private snackBarService: SnackbarService,
    private filterService: FilterSharedService,
    private titlecasePipe: TitleCasePipe
  ) {}

  ngOnInit(): void {
    this.leavingComponent = false;
    // this.getContentMarketList(0, 9);
    this.filterService.globalContentCall('');
    this.filterService.statusContentCall('');
    this.adminAccess = localStorage.getItem('adminAccess');
    this.filterService.globalContent.subscribe((res) => {
      if (Object.keys(res).length) {
        this.searchQuery = res.searchContent;

        this.getContentMarketList(0, 9);
      } else {
        this.searchQuery = '';
        this.getContentMarketList(0, 9);
      }
      // if (Object.keys(res).length) {
      //   this.search(res.searchQuery);
      // } else {
      //   this.searchFilterValues = '';
      //   this.loadhospitalPage();
      // }
    });
    this.filterService.statusContent.subscribe((res) => {
      if (res.status !== 'ALL') {
        this.statusFilter = res.status;

        if (Object.keys(res).length) {
          this.getContentMarketList(0, 9);
        }
      } else {
        this.statusFilter = '';
        this.getContentMarketList(0, 9);
      }
    });
  }
  ngAfterViewInit() {
    this.leavingComponent = false;
    this.video = this.videoPlayerRef.nativeElement as HTMLVideoElement;
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  addContent() {
    const data = '';
    const addEditContentMarketingConfig = new MatDialogConfig();
    addEditContentMarketingConfig.disableClose = true; // The user can't close the dialog by clicking outside it''s body
    (addEditContentMarketingConfig.maxWidth = '100vw'), // Modal maximum width
      (addEditContentMarketingConfig.maxHeight = '100vh'), // Modal maximum height
      // editModalDeviceConfig.height = "78vh"; // Modal height
      (addEditContentMarketingConfig.width = '1037px'); // Modal width
    addEditContentMarketingConfig.data = { mode: 'add', deviceDetails: data }; // Passing each recor data by id to modal pop-up fields
    this.dialog
      .open(AddEditContentMarketingComponent, addEditContentMarketingConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.getContentMarketList(0, 9);
        }
      });
  }
  togglePlayPause() {
    // this.videoPlayerRef.nativeElement.play();

    if (
      this.videoPlayerRef.nativeElement.paused ||
      this.videoPlayerRef.nativeElement.ended
    ) {
      this.isVideoPlaying = true;
      this.videoPlayerRef.nativeElement.play();
    } else {
      this.isVideoPlaying = false;
      this.videoPlayerRef.nativeElement.pause();
    }
  }
  editContent(item) {
    const data = '';
    const addEditContentMarketingConfig = new MatDialogConfig();
    addEditContentMarketingConfig.disableClose = true; // The user can't close the dialog by clicking outside it''s body
    (addEditContentMarketingConfig.maxWidth = '100vw'), // Modal maximum width
      (addEditContentMarketingConfig.maxHeight = '100vh'), // Modal maximum height
      // editModalDeviceConfig.height = "78vh"; // Modal height
      (addEditContentMarketingConfig.width = '1037px'); // Modal width
    addEditContentMarketingConfig.data = {
      mode: 'edit',
      contentMarketingDetails: item,
    }; // Passing each recor data by id to modal pop-up fields
    this.dialog
      .open(AddEditContentMarketingComponent, addEditContentMarketingConfig)
      .afterClosed()
      .subscribe((e) => {
        if (e) {
          this.getContentMarketList(0, 9);
        }
      });
  }
  statusChange(ele) {
    if (ele.status == 'ACTIVE') {
      this.changeStatus = 'INACTIVE';
    } else {
      this.changeStatus = 'ACTIVE';
    }

    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Status Change',
        content: `You are updating status as "${
          this.changeStatus == 'ACTIVE' ? 'Active' : 'Inactive'
        }"`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.contentMarketing
            .statusChange(this.changeStatus, ele.id)
            .subscribe((data: any) => {
              this.snackBarService.success(data.message);
              this.getContentMarketList(0, 9);
            });
        } else {
        }
      });
  }

  getContentMarketList(pageIndex, pageSize) {
    if (this.leavingComponent) {
      return;
    }
    this.contentList = [];
    this.contentMarketing
      .getAllContentHospitalList(
        pageIndex,
        pageSize,
        this.statusFilter,
        this.searchQuery
      )
      .subscribe((res) => {
        this.contentList = res?.contentMarketingList?.content;
        this.basePath = res?.fileBaseUrl;
        this.length = res.contentMarketingList?.totalElements;
        // res.content.forEach((element) => {
        //   let fileURL;
        //   let newUrl;
        //   let base64DataUrl;
        //   this.contentMarketing
        //     .downloadContentMarketingFiles(
        //       element.attachments.includes('Clockhealthcare-Upload/clock_files')
        //         ? element.attachments
        //         : `Clockhealthcare-Upload/clock_files/contentmarketing/${element.attachments}`
        //     )
        //     .subscribe((data) => {
        //       if (data['fileName'].includes('mp4')) {
        //         base64DataUrl = 'data:video/mp4;base64,' + data['file'];
        //       } else if (data['fileName'].includes('png')) {
        //         base64DataUrl = 'data:image/png;base64,' + data['file'];
        //       } else if (data['fileName'].includes('jpg')) {
        //         base64DataUrl = 'data:image/jpg;base64,' + data['file'];
        //       } else if (data['fileName'].includes('jpeg')) {
        //         base64DataUrl = 'data:image/jpeg;base64,' + data['file'];
        //       }
        //       this.contentList.push({
        //         id: element?.id,
        //         url: base64DataUrl,
        //         status: element?.status,
        //         description: element?.description,
        //         title: element?.title,
        //       });
        //     });
        // });
      });
  }
  // createObjectUrl(blobUrl: string): string {
  //   const url = URL.createObjectURL(blobUrl);
  //   return this.sanitizer.bypassSecurityTrustUrl(url) as string;
  // }
  handlePageEvent(event: PageEvent) {
    // this.table.nativeElement.scrollIntoView();
    this.length = event.length;
    this.getContentMarketList(event.pageIndex, event.pageSize);
  }
  deleteContent(item) {
    const weightModalConfig: MatDialogConfig = {
      disableClose: true,
      width: '385px',
      height: '185px',
      data: {
        title: 'Delete Content',
        content: `Are you sure you want to delete this file?. Please Confirm`,
      },
    };
    // this.dialog.closeAll();
    this.dialog
      .open(ActionToggleDialogComponent, weightModalConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.contentMarketing.deleteContent(item.id).subscribe((res) => {
            if (res) {
              this.snackBarService.success(res.message);
              this.getContentMarketList(0, 9);
            }
          });
        } else {
        }
      });
  }
}
