import { Router } from '@angular/router';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { FileService } from 'src/app/core/services/file.service';
import { ObservationBody } from 'src/app/shared/entities/observation-duration';
import {
  SettingsStateService,
  UnitSettings,
} from 'src/app/core/services/settings-state.service';
import { MatTableDataSource } from '@angular/material/table';
import { DateTransformationService } from 'src/app/core/services/date-transformation.service';
import { log } from 'console';

@Component({
  selector: 'app-observation-history',
  templateUrl: './observation-history.component.html',
  styleUrls: ['./observation-history.component.scss'],
})
export class ObservationHistoryComponent implements OnInit, AfterViewInit {
  patientId: string;
  @Input() category: string;
  @Input() appdrawer: any;
  loadRes = true;
  userId: string;
  username: string;
  weightPipe: boolean;
  maxDate = new Date();
  bsp = 1;
  wtp = 1;
  bpp = 1;
  wtsize = 45;
  bssize = 45;
  wtpageIndex = 0;
  bspageIndex = 0;
  bpsize = 45;
  bppageIndex = 0;
  roleid: any;
  userRole: string;
  defaultWeight: string;
  filterfromDate: string;
  filterToDate: string;
  observationWeightHistoryList: any = [];
  observationBPHistoryList: any = [];
  observationBSHistoryList: any = [];
  observationStartTime = new Date().getTime();
  obsBSColumns: string[] = ['presentBs', 'symptoms', 'createdAt'];
  obsWtColumns: string[] = ['presentWt', 'bmi', 'createdAtWt'];
  obsbpColumns: string[] = ['presentBp', 'symptoms', 'createdAtBp'];
  observationWeightDataSource = new MatTableDataSource<any>([]);
  @ViewChild('WtPaginator', { static: true }) wtPaginator: MatPaginator;
  observationBPDataSource = new MatTableDataSource<any>([]);
  @ViewChild('BpPaginator', { static: true }) bpPaginator: MatPaginator;
  observationBSDataSource = new MatTableDataSource<any>([]);
  @ViewChild('BsobsPaginator', { static: true }) bsObsPaginator: MatPaginator;

  fromDate = new Date();
  toDate = new Date();
  size = 3;
  obsChange = false;
  constructor(
    private service: CaregiverDashboardService,
    private snackbarService: SnackbarService,
    private fileService: FileService,
    private router: Router,
    private auth: AuthService,
    public settingsState: SettingsStateService,
    private caregiverSharedService: CaregiverSharedService,
    public dateService: DateTransformationService
  ) {
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.userId = localStorage.getItem('currentUserId');
    this.username = localStorage.getItem('currentUserName');
    this.patientId = localStorage.getItem('patientId');
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    if (this.userRole == 'DOCTOR') {
      setInterval(() => {
        this.setObservationTime();
      }, 30000);
    }

    if (localStorage.getItem('wt') == 'kg') {
      // this.weightPipe = true;
      this.settingsState.setWeightUnit('kg');
    } else {
      // this.weightPipe = true;
      this.settingsState.setWeightUnit('lbs');
    }
  }
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.caregiverSharedService.triggerdObservatioHist.subscribe((value) => {
      if (Object.keys(value).length) {
        this.obsChange = true;
        this.observationHistorybyDate(value['id'], this.fromDate, this.toDate);
      }
    });
    this.caregiverSharedService.triggerdDates.subscribe((value) => {
      if (
        Object.keys(value).length !== 0 &&
        !this.caregiverSharedService
          .formatDate(value['from'])
          .includes('NaN') &&
        !this.caregiverSharedService.formatDate(value['to']).includes('NaN')
      ) {
        const dynamicFromDate = this.caregiverSharedService.formatDate(
          value['from']
        );
        const dynamicFromTime = new Date(value['from']).toTimeString();
        const dynamicToDate = this.caregiverSharedService.formatDate(
          value['to']
        );
        const dynamicToTime = new Date(value['to']).toTimeString();

        (this.filterfromDate =
          dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8)),
          (this.filterToDate =
            dynamicToDate + 'T' + dynamicToTime.substring(0, 8));

        this.observationHistorybyDate(
          this.patientId,
          this.filterfromDate,
          this.filterToDate
        );
      } else {
        if (!this.obsChange) {
          this.observationHistorybyDate(
            this.patientId,
            this.fromDate,
            this.toDate
          );
        } else {
        }
      }
    });
    this.getSettingsValues();
  }
  ngAfterViewInit() {
    // setTimeout(()=>{
    this.observationBSDataSource.paginator = this.bsObsPaginator;
    this.observationBPDataSource.paginator = this.bpPaginator;
    this.observationWeightDataSource.paginator = this.wtPaginator;
    // })
  }

  setObservationTime(): void {
    const timeSpent = Math.floor(
      (new Date().getTime() - this.observationStartTime) / 1000
    );
    const updateBody: ObservationBody = {};
    // updateBody.clinincalNotes = timeSpent;
    localStorage.setItem('obstimeSpentDuration', JSON.stringify(timeSpent));
  }
  getSettingsValues(): void {
    this.defaultWeight = 'lbs';
    // this.settingsState
    //   .getStoredSettings(this.userId)
    //   .subscribe((res: UnitSettings) => {
    //     if (res.lbs) {
    //       this.settingsState.setWeightUnit('lbs');
    //     } else {
    //       this.settingsState.setWeightUnit('kg');
    //     }
    //     if (res.feet) {
    //       this.settingsState.setHeightUnit('inches');
    //     } else {
    //       this.settingsState.setHeightUnit('cms');
    //     }
    //   });
    // if (localStorage.getItem('wt') == 'kg') {
    //   this.settingsStateService.setWeightUnit('kg');
    // } else {
    //   this.settingsStateService.setWeightUnit('lbs');
    // }
  }
  async observationHistorybyDate(id, fDate, tDate) {
    const fromdate = new Date(fDate); // Or the date you'd like converted.
    const isoFromDateTime = new Date(
      fromdate.setHours(5, 30, 0, 0)
    ).toISOString();
    const todate = new Date(tDate); // Or the date you'd like converted.
    todate.setDate(todate.getDate());
    const isoToDateTime = new Date(todate.setHours(5, 29, 0, 0)).toISOString();
    const observationfromDate = isoFromDateTime.split('T');
    const observationtoDate = isoToDateTime.split('T');
    const body = {
      dateFrom: observationfromDate[0] + 'T' + '00:00:00',
      dateTo: observationtoDate[0] + 'T' + '23:59:59',
    };
    // let obsData;
    const obsData = await this.service
      .getObservationHistoryByPIddate(body, id, '')
      .toPromise();

    if (obsData) {
      this.loadRes = false;
      this.observationBSHistoryList = obsData.patientObsBs;
      this.observationBSHistoryList.forEach((list: any) => {
        if (
          list.symptomsBS !== null &&
          list?.symptomsBS !== 'NULL' &&
          list?.symptomsBS !== 'NA' &&
          list?.symptomsBS !== ''
        ) {
          const symptomsBs = JSON.parse(list.symptomsBS);
          symptomsBs.forEach((symptom) => {
            if (symptom.symptomUrl || symptom?.b) {
              symptom.fileName =
                symptom?.symptomUrl?.substring(
                  symptom.symptomUrl.lastIndexOf('/') + 1
                ) || symptom?.b?.substring(symptom.b.lastIndexOf('/') + 1);
            }
          });
          list.symptomsBS = symptomsBs;
        } else {
          list.symptomsBS = [];
        }
      });
      this.observationBSDataSource.data = this.observationBSHistoryList;
      this.observationBSDataSource.paginator = this.bsObsPaginator;

      this.observationBPHistoryList = obsData.patientObsBp;
      if (this.observationBPHistoryList.length) {
        this.observationBPHistoryList.forEach((list: any) => {
          if (
            list.symptomsBp !== null &&
            list?.symptomsBp !== 'NULL' &&
            list?.symptomsBp !== 'NA' &&
            list?.symptomsBp !== ''
          ) {
            const symptomsBP = JSON.parse(list.symptomsBp);
            symptomsBP.forEach((symptom) => {
              if (symptom.symptomUrl || symptom?.b) {
                symptom.fileName =
                  symptom?.symptomUrl?.substring(
                    symptom.symptomUrl.lastIndexOf('/') + 1
                  ) || symptom?.b?.substring(symptom.b.lastIndexOf('/') + 1);
              }
            });
            list.symptomsBp = symptomsBP;
          } else {
            list.symptomsBS = [];
          }
        });

        this.observationBPDataSource.data = this.observationBPHistoryList;
        this.observationWeightHistoryList = obsData.patientObswt;
        this.observationWeightDataSource.data =
          this.observationWeightHistoryList;
        this.observationBPDataSource.paginator = this.bpPaginator;
        this.observationWeightDataSource.paginator = this.wtPaginator;
      } else {
      }
      // },
      //   (err) => {
      //     if (err.status === 401) {
      //       this.router.navigate(['/login']);
      //     } else {
      //       this.snackbarService.error(err?.message);
      //     }
      //   }
      // );
    }

    // getWeightImage(image) {
    //   let wtImg = [];
    //   if (this.fileService.isValidJson(image)) {
    //     let str: string = '' + image;
    //     wtImg = typeof str === 'string' ? JSON.parse(str) : '';
    //     return wtImg;
    //   } else return '';
    // }
    // getBPImage(image) {
    //   let bpImg = [];
    //   if (this.fileService.isValidJson(image)) {
    //     let str: string = '' + image;
    //     bpImg = typeof str === 'string' ? JSON.parse(str) : '';
    //     return bpImg;
    //   } else return '';
    // }
  }
}
