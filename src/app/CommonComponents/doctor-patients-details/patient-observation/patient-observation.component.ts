import { ThrowStmt } from '@angular/compiler';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { FileService } from 'src/app/core/services/file.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EveningObservation } from 'src/app/shared/models/eveningObservation.model';
import { MorningObservation } from 'src/app/shared/models/morningObservation.model';
import { DayObservation } from 'src/app/shared/models/observation.model';

@Component({
  selector: 'app-patient-observation',
  templateUrl: './patient-observation.component.html',
  styleUrls: ['./patient-observation.component.scss'],
})
export class PatientObservationComponent implements OnDestroy {
  public loadRes = false;
  patientObservationDataSource = new MatTableDataSource();
  observationBSHistoryList: any = [];
  observationBPHistoryList: any = [];
  dayObservationlist: any = [];
  searchedfromDate: Date;
  searchedtoDate: Date;
  Obsfromdate: Date;
  ObsTodate: Date;
  isoFromDateTime: string;
  isoToDateTime: string;
  dpid: any;
  dateModified: boolean;
  leavingComponent: boolean = false;
  showNoRecord = false;
  clickedFilter = false;
  obsColumns: string[] = [
    'date',
    'bpDay',
    'indicators',
    'bpDaySymptoms',
    // 'bpEve',
    // 'bpEveSymptoms',
    'sort',
  ];
  adherenceCount = 0;
  selectedAllZone = true;
  selectedGreenZone = false;
  selectedRedZone = false;
  selectedOrangeZone = false;
  selectedNonAdherence = false;
  nonAdherenceData: any = [];
  nonAdherenceCount: number;
  observationStartDate: any;
  observationEndDate: any;
  onBoradingDate: string;
  length: any;
  constructor(
    private caregiverDashbaordservice: CaregiverDashboardService,
    public route: ActivatedRoute,
    public fileService: FileService,
    public caregiverSharedService: CaregiverSharedService,
    private elementRef: ElementRef,
    private snackbarService: SnackbarService
  ) {
    this.leavingComponent = false;
    this.onLoad();
    // this.loadData('');
    // this.caregiverSharedService.triggeredPatientonBoardDate.subscribe((res) => {
    //   if (res) {
    //     this.onBoradingDate = res;
    this.caregiverSharedService.triggerdDates.subscribe((data) => {
      this.dpid = data.id;
      if (
        Object.keys(data).length !== 0 &&
        !this.caregiverSharedService.formatDate(data['from']).includes('NaN') &&
        !this.caregiverSharedService.formatDate(data['to']).includes('NaN')
      ) {
        this.Obsfromdate = new Date(data['from']);
        this.ObsTodate = new Date(data['to']);
        this.ObsTodate.setDate(this.ObsTodate.getDate() + 1);

        this.dateModified = true;
        this.filterByZone('');
        // this.loadData('');
      } else {
        this.dpid = localStorage.getItem('patientId');
        this.onLoad();
        this.loadData('');
      }
    });
    //   }
    // });
  }

  // ngOnInit(): void {}
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  onLoad() {
    if (this.leavingComponent) {
      return;
    }
    this.dpid = localStorage.getItem('patientId');
    this.Obsfromdate = new Date();
    if (
      this.getMonthCount(new Date().getMonth() + 1, new Date().getFullYear()) ==
      30
    ) {
      this.Obsfromdate.setDate(this.Obsfromdate.getDate() - 30);
      if (new Date(this.onBoradingDate) > this.Obsfromdate) {
        this.Obsfromdate = new Date(this.onBoradingDate);
      }
    } else if (
      this.getMonthCount(new Date().getMonth() + 1, new Date().getFullYear()) ==
      31
    ) {
      this.Obsfromdate.setDate(this.Obsfromdate.getDate() - 31);
      if (new Date(this.onBoradingDate) > this.Obsfromdate) {
        this.Obsfromdate = new Date(this.onBoradingDate);
      }
    } else if (
      this.getMonthCount(new Date().getMonth() + 1, new Date().getFullYear()) ==
      28
    ) {
      this.Obsfromdate.setDate(this.Obsfromdate.getDate() - 28);
      if (new Date(this.onBoradingDate) > this.Obsfromdate) {
        this.Obsfromdate = new Date(this.onBoradingDate);
      }
    } else if (
      this.getMonthCount(new Date().getMonth() + 1, new Date().getFullYear()) ==
      29
    ) {
      this.Obsfromdate.setDate(this.Obsfromdate.getDate() - 29);
      if (new Date(this.onBoradingDate) > this.Obsfromdate) {
        this.Obsfromdate = new Date(this.onBoradingDate);
      }
    }

    this.ObsTodate = new Date(new Date().toISOString());

    this.ObsTodate.setDate(this.ObsTodate.getDate());

    const observationFromDateSplitted =
      this.Obsfromdate.toISOString().split('T');
    this.observationStartDate =
      observationFromDateSplitted[0] + 'T' + '00:00:00';

    const observationToDateSplitted = this.ObsTodate.toISOString().split('T');
    this.observationEndDate = observationToDateSplitted[0] + 'T' + '23:59:59';

    this.caregiverSharedService.triggerdObservation.subscribe((value) => {
      if (value) {
        this.dpid = value;
        this.loadData('');
      }
    });
  }
  // eslint-disable-next-line max-len
  loadData(zone): any {
    if (this.leavingComponent) {
      return;
    }

    // if (
    //   this.Obsfromdate.toDateString() === this.ObsTodate.toDateString() &&
    //   !this.dateModified
    // ) {
    //   this.onLoad();
    // }
    if (
      this.observationStartDate === this.observationEndDate &&
      !this.dateModified
    ) {
      this.onLoad();
    }

    this.dpid = localStorage.getItem('patientId');
    this.loadRes = true;
    this.dayObservationlist = [];

    if (this.dateModified && !this.clickedFilter) {
      localStorage.removeItem('observationFromDate');
      localStorage.removeItem('observationToDate');
      this.Obsfromdate = new Date(this.Obsfromdate.toISOString());

      this.Obsfromdate.setDate(this.Obsfromdate.getDate() + 1);

      this.ObsTodate = new Date(this.ObsTodate.toISOString());

      this.ObsTodate.setDate(this.ObsTodate.getDate());
      // const observationFromDateSplitted =
      //   this.Obsfromdate.toISOString().split('T');
      // this.observationStartDate =
      //   observationFromDateSplitted[0] + ' ' + '00:00:00';
      // const observationToDateSplitted = this.ObsTodate.toISOString().split('T');
      // this.observationEndDate = observationToDateSplitted[0] + ' ' + '23:59:59';
      this.observationStartDate =
        this.Obsfromdate.toISOString().split('T')[0] + 'T00:00:00';
      this.observationEndDate =
        this.ObsTodate.toISOString().split('T')[0] + 'T23:59:59';
    } else if (this.dateModified && this.clickedFilter) {
      // this.observationStartDate.setDate(
      //   this.observationStartDate.getDate() + 1
      // );
      // const observationFromDateSplitted = this.observationStartDate
      //   .toISOString()
      //   .split('T');
      // this.observationStartDate =
      //   observationFromDateSplitted[0] + 'T' + '00:00:00';
      // const observationToDateSplitted = this.observationEndDate
      //   .toISOString()
      //   .split('T');
      // this.observationEndDate = observationToDateSplitted[0] + 'T' + '23:59:59';
      // this.Obsfromdate = new Date(this.Obsfromdate.toISOString());

      // this.Obsfromdate.setDate(this.Obsfromdate.getDate() + 1);

      // this.ObsTodate = new Date(this.ObsTodate.toISOString());

      // this.ObsTodate.setDate(this.ObsTodate.getDate());
      this.observationStartDate =
        this.Obsfromdate.toISOString().split('T')[0] + 'T00:00:00';
      this.observationEndDate =
        this.ObsTodate.toISOString().split('T')[0] + 'T23:59:59';
    }
    // let from = JSON.parse(localStorage.getItem('observationFromDate'));
    // let to = JSON.parse(localStorage.getItem('observationToDate'));
    if (this.observationEndDate && this.observationStartDate) {
      this.observationStartDate =
        this.Obsfromdate.toISOString().split('T')[0] + 'T00:00:00';
      this.observationEndDate =
        this.ObsTodate.toISOString().split('T')[0] + 'T23:59:59';
    }

    const body = {
      dateFrom: this.observationStartDate,
      // dateTo: this.ObsTodate.setDate(this.ObsTodate.getDate() + 1),
      dateTo: this.observationEndDate,
    };

    localStorage.setItem('currentFromDate', this.observationStartDate);
    localStorage.setItem('currentToDate', this.observationEndDate);
    this.caregiverDashbaordservice
      .getObservationHistoryByPIddate(body, this.dpid, zone)
      .pipe(catchError(() => of([])))
      .subscribe(
        (data: any) => {
          this.patientObservationDataSource = data?.content;
          this.loadRes = false;
          this.length = data?.totalElements;

          // if (data) {
          //   const allObs: any[] = [];
          //   this.observationBPHistoryList = data.patientObsBp;

          //   var d = new Date(this.observationEndDate);
          //   for (
          //     var d = new Date(this.observationEndDate);
          //     d > new Date(this.observationStartDate);
          //     d.setDate(d.getDate() - 1)
          //   ) {
          //     var Obsdate = new Date(d).toDateString();
          //     const morningObs = new MorningObservation();
          //     const eveningObs = new EveningObservation();
          //     const dayObs = new DayObservation();

          //     if (this.observationBPHistoryList?.length) {
          //       const filetredBPlist = this.observationBPHistoryList.filter(
          //         (e) => {
          //           const splitedDate = e.createdAt?.split('T');
          //           const updatedDate = splitedDate[0];
          //           return new Date(updatedDate).toDateString() == Obsdate;
          //         }
          //       );

          //       for (let j = 0; j < filetredBPlist.length; j++) {
          //         const formattedDate = filetredBPlist[j].createdAt.split('.');

          //         const hour = new Date(formattedDate[0]).getHours();

          //         if (hour < 12) {
          //           if (
          //             morningObs == undefined ||
          //             morningObs.presentBp == null ||
          //             morningObs.presentBp == undefined
          //           ) {
          //             this.getSymptomBP(filetredBPlist[j]);
          //             this.addBPMorObs(morningObs, filetredBPlist[j]);
          //           } else {
          //             if (
          //               morningObs.BPZoneofPatient >
          //                 filetredBPlist[j].zoneOfPatient
          //               //   &&
          //               // morningObs.bpType == 'hypo'
          //             ) {
          //               this.getSymptomBP(filetredBPlist[j]);
          //               this.addBPMorObs(morningObs, filetredBPlist[j]);
          //             } else if (
          //               morningObs.BPZoneofPatient >
          //                 filetredBPlist[j].zoneOfPatient
          //               //    &&
          //               // morningObs.bpType == 'hyper'
          //             ) {
          //               this.getSymptomBP(filetredBPlist[j]);
          //               this.addBPMorObs(morningObs, filetredBPlist[j]);
          //             }
          //           }
          //         }

          //         if (hour >= 12) {
          //           if (
          //             eveningObs == undefined ||
          //             eveningObs.presentBp == null ||
          //             eveningObs.presentBp == undefined
          //           ) {
          //             this.getSymptomBP(filetredBPlist[j]);
          //             this.addBPEvenObs(eveningObs, filetredBPlist[j]);
          //           } else {
          //             if (
          //               eveningObs.BPZoneofPatient >
          //                 filetredBPlist[j].zoneOfPatient
          //               //    &&
          //               // eveningObs.bpType === 'hypo'
          //             ) {
          //               this.getSymptomBP(filetredBPlist[j]);
          //               this.addBPEvenObs(eveningObs, filetredBPlist[j]);
          //             } else if (
          //               eveningObs.BPZoneofPatient >
          //                 filetredBPlist[j].zoneOfPatient
          //               //    &&
          //               // eveningObs.bpType === 'hyper'
          //             ) {
          //               this.getSymptomBP(filetredBPlist[j]);
          //               this.addBPEvenObs(eveningObs, filetredBPlist[j]);
          //             }
          //           }
          //         }

          //         // this.dayObservationlist.reverse();
          //       }
          //       // this.dayObservationlist.shift();
          //       // delete this.dayObservationlist.;
          //     }

          //     dayObs.morningObservation = morningObs;
          //     dayObs.eveningObservation = eveningObs;
          //     dayObs.observationDate = Obsdate;
          //     allObs.push(dayObs);
          //     this.dayObservationlist = [];
          //     const dayy = [];
          //     if (!this.searchedfromDate && !this.searchedtoDate) {
          //       for (let i = 0; i < allObs.length; i++) {
          //         // if (i !== 0) {
          //         if (
          //           (Object.keys(allObs[i].eveningObservation).length ||
          //             Object.keys(allObs[i].morningObservation).length) &&
          //           !this.selectedNonAdherence
          //         ) {
          //           this.dayObservationlist.push(allObs[i]);
          //         } else {
          //           dayy.push(allObs[i]);
          //         }
          //         if (
          //           !Object.keys(allObs[i].eveningObservation).length &&
          //           !Object.keys(allObs[i].morningObservation).length &&
          //           this.selectedNonAdherence
          //         ) {
          //           if (i !== 0) {
          //             this.dayObservationlist.push(allObs[i]);
          //           }
          //         }

          //         this.patientObservationDataSource = this.dayObservationlist;
          //         // }
          //       }
          //       this.loadRes = false;
          //     } else {
          //       this.dayObservationlist = allObs;
          //       this.patientObservationDataSource = this.dayObservationlist;
          //       this.loadRes = false;
          //     }

          //     if (!this.dayObservationlist.length) {
          //       this.loadRes = false;
          //     }
          //   }

          //   // this.adherenceCount=this.dayObservationlist.length;
          //   // this.nonAdherenceCount = dayy.length;
          //   // this.caregiverSharedService.changeAdherenceNonAdherence(this.nonAdherenceCount);
          //   // this.dayObservationlist.forEach((res) => {
          //   //   if (Object.keys(res.morningObservation).length) {
          //   //     let count = 1;
          //   //     this.adherenceCount += count;
          //   //   }
          //   //   if (Object.keys(res.eveningObservation).length) {
          //   //     let count = 1;
          //   //     this.adherenceCount += count;
          //   //   }
          //   // });
          // } else {
          //   this.snackbarService.error('No data available');
          // }
        },
        (err) => {
          // this.snackbarService.error(err.message);
        }
      );
  }
  getMorningIndicators(ele) {
    let indicators = [];
    if (ele) {
      indicators = JSON.parse(ele);
      return indicators;
    } else {
      return indicators;
    }
  }
  getEveningIndicators(ele) {
    let indicators = [];
    if (ele) {
      indicators = JSON.parse(ele);
      return indicators;
    } else {
      return indicators;
    }
  }
  addBPMorObs(mObs, element) {
    (mObs.presentBp = element.presentBp),
      (mObs.bpType = element.bpType),
      (mObs.symptomsBp = element.symptomsBp),
      (mObs.status = element.status),
      (mObs.zoneOfPat = element.zoneOfPatient),
      (mObs.lastUpdatedAt = element.lastUpdatedAt),
      (mObs.BPZoneofPatient = element.zoneOfPatient),
      (mObs.BPCreatedAt = element.lastUpdatedAt);
    mObs.indicators = element.indicators;
    return mObs;
  }
  addBPEvenObs(eObs, element) {
    (eObs.presentBp = element.presentBp),
      (eObs.bpType = element.bpType),
      (eObs.symptomsBp = element.symptomsBp),
      (eObs.status = element.status),
      (eObs.zoneOfPat = element.zoneOfPatient),
      (eObs.lastUpdatedAt = element.lastUpdatedAt),
      (eObs.BPZoneofPatient = element.zoneOfPatient),
      (eObs.BPCreatedAt = element.lastUpdatedAt);
    eObs.indicators = element.indicators;
    return eObs;
  }
  addWtMorObs(mObs, element) {
    (mObs.presentBSreading = element.presentBSreading),
      (mObs.bsResult = element.bsResult),
      (mObs.symptomsBS = element.symptomsBS),
      (mObs.BSzoneofpat = element.zoneOfPatient),
      (mObs.BScreatedAt = element.lastUpdatedAt);
    return mObs;
  }

  addWtEvenObs(eObs, element) {
    (eObs.presentBSreading = element.presentBSreading),
      (eObs.bsResult = element.bsResult),
      (eObs.symptomsBS = element.symptomsBS),
      (eObs.BSzoneofpat = element.zoneOfPatient),
      (eObs.BScreatedAt = element.lastUpdatedAt);
    return eObs;
  }
  getMonthCount(month, year) {
    return new Date(year, month, 0).getDate();
  }
  getWeightImage(image) {
    let wtImg = [];
    if (this.fileService.isValidJson(image)) {
      const str: string = '' + image;
      wtImg = typeof str === 'string' ? JSON.parse(str) : '';
      return wtImg;
    } else {
      return '';
    }
  }
  getBPImage(image) {
    let bpImg = [];
    if (this.fileService.isValidJson(image)) {
      const str: string = '' + image;
      bpImg = typeof str === 'string' ? JSON.parse(str) : '';
      return bpImg;
    } else {
      return '';
    }
  }

  getSymptomBS(filetredBGlist) {
    if (
      filetredBGlist &&
      filetredBGlist.symptomsBS !== null &&
      filetredBGlist.symptomsBS !== 'NA'
    ) {
      if (
        filetredBGlist.symptomsBS &&
        filetredBGlist.symptomsBS !== 'NULL' &&
        filetredBGlist.symptomsBS !== 'NA'
      ) {
        const symptomsBS = JSON.parse(filetredBGlist.symptomsBS);
        symptomsBS.forEach((symptom) => {
          if (symptom.symptomUrl || symptom?.b) {
            symptom.fileName =
              symptom?.symptomUrl?.substring(
                symptom.symptomUrl.lastIndexOf('/') + 1
              ) || symptom?.b?.substring(symptom.b.lastIndexOf('/') + 1);
          }
        });
        filetredBGlist.symptomsBS = symptomsBS;
      } else {
        filetredBGlist.symptomsBS = [];
      }
    } else {
      filetredBGlist.symptomsBS = {};
    }
  }
  getSymptomBP(filetredBPlist) {
    if (
      filetredBPlist &&
      filetredBPlist.symptomsBp !== null &&
      filetredBPlist.symptomsBp !== 'NA'
    ) {
      if (
        filetredBPlist.symptomsBp &&
        filetredBPlist.symptomsBp !== 'NULL' &&
        filetredBPlist.symptomsBp !== 'NA'
      ) {
        const symptomsBp = JSON.parse(filetredBPlist.symptomsBp);
        symptomsBp?.forEach((symptom) => {
          if (symptom?.symptomUrl || symptom?.b) {
            symptom.fileName =
              symptom?.symptomUrl?.substring(
                symptom.symptomUrl.lastIndexOf('/') + 1
              ) || symptom?.b?.substring(symptom.b.lastIndexOf('/') + 1);
          }
        });
        filetredBPlist.symptomsBp = symptomsBp;
      } else {
        filetredBPlist.symptomsBp = [];
      }
    } else {
      filetredBPlist.symptomsBp = {};
    }
  }
  filterByZone(zone) {
    this.clickedFilter = true;
    if (zone === '3') {
      this.selectedGreenZone = true;
      this.selectedRedZone = false;
      this.selectedOrangeZone = false;
      this.selectedAllZone = false;
      this.selectedNonAdherence = false;
    } else if (zone === '1') {
      this.selectedGreenZone = false;
      this.selectedRedZone = true;
      this.selectedOrangeZone = false;
      this.selectedAllZone = false;
      this.selectedNonAdherence = false;
    } else if (zone === '2') {
      this.selectedGreenZone = false;
      this.selectedRedZone = false;
      this.selectedOrangeZone = true;
      this.selectedAllZone = false;
      this.selectedNonAdherence = false;
    } else if (zone === '') {
      this.selectedGreenZone = false;
      this.selectedRedZone = false;
      this.selectedOrangeZone = false;
      this.selectedAllZone = true;
      this.selectedNonAdherence = false;
      this.clickedFilter = false;
    } else {
      this.selectedGreenZone = false;
      this.selectedRedZone = false;
      this.selectedOrangeZone = false;
      this.selectedAllZone = false;
      this.selectedNonAdherence = true;
      this.dayObservationlist = [];
    }
    const currentFromDate = localStorage.getItem('currentFromDate');
    const currentToDate = localStorage.getItem('currentToDate');

    this.observationStartDate = new Date(currentFromDate);
    this.observationEndDate = new Date(currentToDate);
    this.loadData(zone);
  }
  getSymptomsBP(e) {
    return JSON.parse(e);
  }
}
