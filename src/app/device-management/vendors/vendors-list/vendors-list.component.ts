import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
import { AddVendorsComponent } from '../add-vendors/add-vendors.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.scss'],
})
export class VendorsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  displayedColumns: string[] = ['vedername', 'agreement', 'action'];
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  dataSource: MatTableDataSource<any>;
  public deviceTypefilter: FormGroup;
  pdfimageSrc: any = [];
  userRole: any;

  constructor(
    public dialog: MatDialog,
    public deviceService: DeviceTypeService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private router: Router,
    private service: DeviceTypeService,
    private _sanitizer: DomSanitizer,
    public authService: AuthService,
    private renderer: Renderer2,
  ) {
    const user = this.authService.authData;
    this.userRole = user.userDetails?.userRole;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth');
    if (!this.router.routerState.snapshot.url.includes('login')) {
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
    this.deviceTypefilter = this.fb.group({
      searchquery: [''],
    });
    this.getVendorList();
  }
  getVendorList(pageNo = 0, pageSize = 10) {
    // this.paginator?.pageIndex ? this.paginator.pageIndex  : 0;
    // this.paginator?.pageSize ? this.paginator.pageSize = 10 : 10;
    if (localStorage.getItem('auth')) {
      this.deviceService
        .getVendors(
          this.paginator?.pageIndex ? this.paginator.pageIndex : 0,
          this.paginator?.pageSize ? this.paginator.pageSize : 10
        )
        .subscribe((data) => {
          this.dataSource = data.content;
          this.length = data.totalElements;
        });
    }
  }
  openPreview(element) {
    const vendorUrl =
      'Clockhealthcare-Upload/clock_files/deviceAttachments/' +
      element?.documentName;
    this.service.downloadVendorFile(vendorUrl).subscribe((data) => {
      // if (data['fileName'].includes('pdf')) {
      //   this.pdfimageSrc.push({
      //     url: 'data:application/pdf;base64,' + data['file'],
      //     name: data['fileName'],
      //   });
      // }
      const byteArray = new Uint8Array(
        atob(data['file'])
          .split('')
          .map((char) => char.charCodeAt(0))
      );
      if (vendorUrl.includes('pdf')) {
        const file = new Blob([byteArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      } else {
        const file = new Blob([byteArray], { type: 'image/png' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
      // this.pdfSrc = fileURL;
    });
  }
  openVendorDialog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    (dialogConfig.maxWidth = '100vw'),
      (dialogConfig.maxHeight = '100vh'),
      (dialogConfig.width = '350px'),
      (dialogConfig.data = data),
      this.dialog
        .open(AddVendorsComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => {
          this.getVendorList();
        });
  }
  scrollToTop() {
    
    const tableElement = this.table['_elementRef'].nativeElement;
    this.renderer.setProperty(tableElement, 'scrollTop', 0);
  }
  handlePageEvent(event: PageEvent): void {
    this.scrollToTop();
    this.length = event.length;
    this.getVendorList(event.pageIndex, event.pageSize);
  }
}
