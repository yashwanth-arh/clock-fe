import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { SnackbarService } from '../../core/services/snackbar.service';
import { BranchService } from '../../branches/branch/branch.service';
import { OrgClinicEditComponent } from './org-clinic-edit/org-clinic-edit.component';
import { hospitalClinicDataSource } from '../service/hospital-clinic-data-source';
import { HospitalManagementService } from '../service/hospital-management.service';
import { LocationService } from 'src/app/core/services/location.service';
import { ToolbarService } from 'src/app/core/services/toolbar.service';

@Component({
  selector: 'app-hospital-clinic',
  templateUrl: './hospital-clinic.component.html',
  styleUrls: ['./hospital-clinic.component.scss'],
})
export class HospitalClinicComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  displayedColumns: string[] = [
    'name',
    'primaryContactNumber',
    //'email',
    'address.addressLine',
    'address.state',
    'address.city',
    'clinicNPI',
    'status',
    // 'action',
  ];

  organzationId: string;

  public dataSource: hospitalClinicDataSource;

  practiceList = [];
  state = [];
  city = [];
  status = ['ACTIVE', 'INACTIVE'];

  practiceClinicList: FormGroup;
  messageSuccess: boolean;

  constructor(
    private router: Router,
    public entityModalPopup: MatDialog,
    private branchservice: BranchService,
    public hospitalService: HospitalManagementService,
    private snackBarService: SnackbarService,
    public route: ActivatedRoute,
    private locationService: LocationService,
    public toolbarService: ToolbarService,
    private fb: FormBuilder
  ) {
    this.dataSource = new hospitalClinicDataSource(this.branchservice);
  }

  ngOnInit(): void {
    this.validatePracticeFilterForm();
    this.route.data.subscribe((res) => {
      this.route.queryParams.subscribe((params) => {
        // res.title = params.name + " Clinic";
        res.id = params.org_id;
        this.organzationId = params.org_id;
        this.dataSource.loadOrgBranchList(0, 0, '', '', this.organzationId);
        this.toolbarService.setToolbarLabel(params.name);
      });
    });

    this.hospitalService.getPracticeList().subscribe(
      (data: any) => {
        this.practiceList = data.hospitalList.filter(
          (element) => element.name != null
        );
      },
      (err) => {
        // this.snackBarService.error(err.message);
      }
    );

    this.locationService.getJSONData().subscribe((res: any[]) => {
      this.state = Object.keys(res);
    });

    this.dataSource.totalElemObservable.subscribe((data) => {
      if (data > 0) {
        this.messageSuccess = true;
      } else if (data === 0) {
        this.messageSuccess = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.toolbarService.setToolbarLabel('');
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadhospitalClinicPage()))
      .subscribe();
  }

  public loadhospitalClinicPage(): void {
    // eslint-disable-next-line max-len
    this.dataSource.loadOrgBranchList(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.organzationId
    );
  }

  // addBranch() {
  // 	const createEntityModalConfig = new MatDialogConfig();
  // 	createEntityModalConfig.disableClose = true;
  // 	(createEntityModalConfig.maxWidth = "100vw"),
  // 		(createEntityModalConfig.maxHeight = "120vh"),
  // 		(createEntityModalConfig.width = "750px"),
  // 		(createEntityModalConfig.data = { add: "add", value: null });
  // 	this.entityModalPopup
  // 		.open(BranchAddEditComponent, createEntityModalConfig)
  // 		.afterClosed()
  // 		.subscribe((e) => {
  // 			this.getBranchList();
  // 		});
  // }

  editBranch(entity: any): void {
    const editEntityModalConfig = new MatDialogConfig();
    editEntityModalConfig.disableClose = true;
    (editEntityModalConfig.maxWidth = '100vw'),
      (editEntityModalConfig.maxHeight = '120vh'),
      (editEntityModalConfig.width = '750px'),
      (editEntityModalConfig.data = entity);
    this.entityModalPopup
      .open(OrgClinicEditComponent, editEntityModalConfig)
      .afterClosed()
      .subscribe((e) => {
        this.getBranchList();
      });
  }

  getBranchList(
    pageNumber = 0,
    pageSize = 10,
    pageSort = 'lastUpdatedAt',
    direction = 'desc'
  ) {
    this.dataSource = new hospitalClinicDataSource(this.branchservice);
    this.dataSource.loadOrgBranchList(
      0,
      0,
      this.sort.active,
      this.sort.direction,
      this.organzationId
    );
  }

  getFieldName(element, key) {
    switch (key) {
      case 'hospital':
        return element && element.hospital ? element.hospital.name : 'N/A';
        break;
      case 'state':
        return element && element.address ? element.address.state : 'N/A';
        break;
      case 'city':
        return element && element.address ? element.address.city : 'N/A';
        break;
      case 'address':
        return element &&
          element.address &&
          element.address.addressLine &&
          element.address.addressLine !== ''
          ? element.address.addressLine
          : 'N/A';
        break;
      case 'zipcode':
        return element &&
          element.address &&
          element.address.zipCode &&
          element.address.zipCode !== ''
          ? element.address.zipCode
          : 'N/A';
        break;
      case 'emergencycontact':
        return element && element.emergencyContactNumber
          ? element.emergencyContactNumber
          : 'N/A';
        break;
      default:
        return 'N/A';
        break;
    }
  }

  viewhospital(): void {
    this.router.navigate(['home/hospitals']);
  }

  onStateSelection(event: any): any {
    this.city = [];
    // this.locationService.getFilteredJSONData(event).subscribe((data: any[]) => {
    //   this.city = data;
    // });
  }

  public validatePracticeFilterForm(): any {
    this.practiceClinicList = this.fb.group({
      // practice: [''],
      // state: [''],
      // city: [''],
      status: [''],
    });
  }
}
