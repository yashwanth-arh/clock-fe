import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ObservationBody } from 'src/app/shared/entities/observation-duration';
import {
  SettingsStateService,
  UnitSettings,
} from 'src/app/core/services/settings-state.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateTransformationService } from 'src/app/core/services/date-transformation.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-vitals-history',
  templateUrl: './vitals-history.component.html',
  styleUrls: ['./vitals-history.component.scss'],
})
export class VitalsHistoryComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  patientId: string;
  userRole: string;
  defaultWeight: any;
  loadRes = true;
  matTabValues = ['Last 7 Days', 'Last 15 Days', 'Last 30 Days'];
  weightColumns: string[] = ['weight', 'bmi', 'recordedOn'];
  bsColumns: string[] = ['bs', 'recordedOn'];
  bpColumns: string[] = ['bp', 'recordedOn'];
  vitalHistoryWeightList: any = [];
  vitalHistoryBSList: any = [];
  vitalHistoryBPList: any = [];
  vitalHistoryList: any = [];
  distanceArr: any = [];
  centroidArr: any = [];
  bpList: any = [];
  daily: string;
  lastOneWeek: string;
  lastTwoWeek: string;
  lastOneMonth: string;
  lastThreeMonth: string;
  requestBody: any = {};
  groupedArray: any[] = [];
  centroidLatLong: any[] = [];
  type: string;
  vitalBSDataSource = new MatTableDataSource<any>([]);
  @ViewChild('BsPaginator', { static: true }) bsPaginator: MatPaginator;
  vitalBPDataSource = new MatTableDataSource<any>([]);
  @ViewChild('BpPaginator', { static: true }) bpPaginator: MatPaginator;
  vitalWeightDataSource = new MatTableDataSource<any>([]);
  @ViewChild('WtPaginator', { static: true }) wtPaginator: MatPaginator;
  @ViewChild('table', { read: ElementRef }) table: ElementRef;
  weight: any = [];
  bs: any = [];
  bp: any = [];
  roleid: any;
  bsp = 1;
  bssize = 45;
  bspageIndex = 0;
  size = 3;
  wtp = 1;
  bpp = 1;
  wtsize = 45;
  wtpageIndex = 0;
  bpsize = 45;
  bppageIndex = 0;
  observationStartTime = new Date().getTime();
  osType: string;
  morningAvg: string;
  morningCount: string;
  morningGood: string;
  morningAlert: string;
  morningHighAlert: string;
  afternoonAvg: string;
  afternoonCount: string;
  afternoonGood: string;
  afternoonAlert: string;
  afternoonHighAlert: string;
  eveningAvg: string;
  eveningCount: string;
  eveningGood: string;
  eveningAlert: string;
  eveningHighAlert: string;
  nightAvg: string;
  nightCount: string;
  nightGood: string;
  nightAlert: string;
  nightHighAlert: string;
  leavingComponent: boolean = false;
  markers = [];
  centroidArray: any[] = [
    { lat: '12.8908405', longi: '77.5821727' },
    { lat: '12.89086935', longi: '77.58217116' },
  ];
  patientLocations: any[] = [];
  bpAverageSummaryDetails: any;
  baselinediastolic: string;
  baselinesystolic: string;
  compail: any;
  RED_FLAG = 1;
  ORANGE_FLAG = 2;
  GREEN_FLAG = 3;

  HYPER = 'hyper';
  HYPO = 'hypo';
  NORMAL = 'normal';

  systolicBptype: string | undefined;
  diastolicBptype: string | undefined;
  hyperTensionSystolicOrangeValue = 132;
  hyperTensionDiastolicOrangeValue = 88;
  hyperTensionSystolicRedValue = 144;
  hyperTensionDiastolicRedValue = 96;
  hypoTensionSystolicOrangeValue = 108;
  hypoTensionDiastolicOrangeValue = 72;
  hypoTensionSystolicRedValue = 96;
  hypoTensionDiastolicRedValue = 64;
  constructor(
    private auth: AuthService,
    private service: CaregiverDashboardService,
    private caregiverSharedservice: CaregiverSharedService,
    private router: Router,
    private numberPipe: DecimalPipe,
    private snackbarService: SnackbarService,
    public settingsState: SettingsStateService,
    public dateService: DateTransformationService
  ) {
    // this.osType = window.navigator.platform;
    // alert(this.osType);
    this.leavingComponent = false;
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;

    this.patientId = localStorage.getItem('patientId');
    if (this.userRole == 'DOCTOR') {
      setInterval(() => {
        this.setObservationTime();
      }, 30000);
    }

    if (localStorage.getItem('wt') == 'kg') {
      this.settingsState.setWeightUnit('kg');
    } else {
      this.settingsState.setWeightUnit('lbs');
    }
    this.requestBody['patientId'] = this.patientId;
    this.requestBody['type'] = 'day';
    this.requestBody['value'] = '7';
    this.caregiverSharedservice.triggerdMaps.subscribe((val) => {
      if (this.leavingComponent) {
        return;
      }
      if (Object.keys(val)?.length) {
        this.requestBody['patientId'] = val['id'];
        this.getReadings();
      } else {
        this.getReadings();
      }
    });
    // this.caregiverSharedservice.triggerMap.subscribe((data) => {
    //   if (data) {
    //     this.getReadings();
    //   } else {
    //     this.getReadings();
    //   }
    // });
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  ngOnInit(): void {
    this.leavingComponent = false;
    this.baselinesystolic = localStorage.getItem('baselinesystolic');
    this.baselinediastolic = localStorage.getItem('baselinediastolic');
    this.compail = this.baselinesystolic + '/' + this.baselinediastolic;
  }

  ngAfterViewInit(): void {
    this.leavingComponent = false;
    this.vitalBSDataSource.paginator = this.bsPaginator;
    this.vitalBPDataSource.paginator = this.bpPaginator;
    this.vitalWeightDataSource.paginator = this.wtPaginator;
  }
  getServerData(event) {
    this.table.nativeElement.scrollIntoView();
  }
  setObservationTime(): void {
    const timeSpent = Math.floor(
      (new Date().getTime() - this.observationStartTime) / 1000
    );
    const updateBody: ObservationBody = {};
    // updateBody.clinincalNotes = timeSpent;
    localStorage.setItem('vitaltimeSpentDuration', JSON.stringify(timeSpent));
  }
  getReadings() {
    this.centroidLatLong = [];
    this.groupedArray = [];
    this.markers = [];
    this.service.getBpAnalytics(this.requestBody).subscribe(
      (value) => {
        this.mapOperation(value);
        this.patientLocations = value.averageBpByLocation;
        this.bpAverageSummaryDetails = value?.bpAverageSummary.length
          ? value?.bpAverageSummary[0]
          : '';
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }
  mapOperation(value) {
    if (!value?.bpVitalAnalytics?.patientVitalVo?.length) {
      this.morningAvg = '';
      this.afternoonAvg = '';
      this.eveningAvg = '';
      this.nightAvg = '';
      this.morningHighAlert = '';
      this.afternoonHighAlert = '';
      this.eveningHighAlert = '';
      this.nightHighAlert = '';
      this.morningGood = '';
      this.afternoonGood = '';
      this.eveningGood = '';
      this.nightGood = '';
      this.morningAlert = '';
      this.afternoonAlert = '';
      this.eveningAlert = '';
      this.nightAlert = '';
      // this.snackbarService.error('No readings available for this location');
      return;
    }
    this.markers = [];
    this.groupedArray = [];
    // if (value.err === 403) {
    //   this.snackbarService.error(value.message);
    // }
    if (value) {
      this.centroidLatLong = [];
      const patientAnalyatics = value?.bpVitalAnalytics?.patientAnalyatics;
      const patientVitalVo = value?.bpVitalAnalytics?.patientVitalVo;
      this.morningAvg = '';
      this.afternoonAvg = '';
      this.eveningAvg = '';
      this.nightAvg = '';
      this.morningHighAlert = '';
      this.afternoonHighAlert = '';
      this.eveningHighAlert = '';
      this.nightHighAlert = '';
      this.morningGood = '';
      this.afternoonGood = '';
      this.eveningGood = '';
      this.nightGood = '';
      this.morningAlert = '';
      this.afternoonAlert = '';
      this.eveningAlert = '';
      this.nightAlert = '';

      if (
        Object.keys(patientAnalyatics)?.length &&
        patientAnalyatics?.morning?.type === 'morning'
      ) {
        const mornSys =
          patientAnalyatics.morning?.sys /
          patientAnalyatics.morning?.vitalreadingCount;
        const mornDia =
          patientAnalyatics.morning?.dia /
          patientAnalyatics.morning?.vitalreadingCount;
        this.morningAvg =
          (this.numberPipe.transform(mornSys, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(mornSys, '1.0-0')) +
          '/' +
          (this.numberPipe.transform(mornDia, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(mornDia, '1.0-0'));

        this.morningGood = patientAnalyatics.morning?.good;
        this.morningAlert = patientAnalyatics.morning?.alert;
        this.morningHighAlert = patientAnalyatics.morning?.highAlert;
        this.type = patientAnalyatics.morning?.type;
      }
      if (patientAnalyatics?.afternoon?.type === 'afternoon') {
        const afterSys =
          patientAnalyatics.afternoon?.sys /
          patientAnalyatics.afternoon?.vitalreadingCount;
        const afterDia =
          patientAnalyatics.afternoon?.dia /
          patientAnalyatics.afternoon?.vitalreadingCount;
        this.afternoonAvg =
          (this.numberPipe.transform(afterSys, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(afterSys, '1.0-0')) +
          '/' +
          (this.numberPipe.transform(afterDia, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(afterDia, '1.0-0'));
        this.afternoonGood = patientAnalyatics.afternoon?.good;
        this.afternoonAlert = patientAnalyatics.afternoon?.alert;
        this.afternoonHighAlert = patientAnalyatics.afternoon?.highAlert;
        this.type = value.bpVitalAnalytics?.patientAnalyatics.afternoon?.type;
      }
      if (patientAnalyatics?.evening?.type === 'evening') {
        const eveningSys =
          patientAnalyatics.evening?.sys /
          patientAnalyatics.evening?.vitalreadingCount;
        const eveningDia =
          patientAnalyatics.evening?.dia /
          patientAnalyatics.evening?.vitalreadingCount;
        this.eveningAvg =
          (this.numberPipe.transform(eveningSys, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(eveningSys, '1.0-0')) +
          '/' +
          (this.numberPipe.transform(eveningDia, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(eveningDia, '1.0-0'));
        this.eveningGood = patientAnalyatics.evening?.good;
        this.eveningAlert = patientAnalyatics.evening?.alert;
        this.eveningHighAlert = patientAnalyatics.evening?.highAlert;
        this.type = patientAnalyatics.evening?.type;
      }
      if (patientAnalyatics?.night?.type === 'night') {
        const nightSys =
          patientAnalyatics.night?.sys /
          patientAnalyatics.night?.vitalreadingCount;
        const nightDia =
          patientAnalyatics.night?.dia /
          patientAnalyatics.night?.vitalreadingCount;
        this.nightAvg =
          (this.numberPipe.transform(nightSys, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(nightSys, '1.0-0')) +
          '/' +
          (this.numberPipe.transform(nightDia, '1.0-0') === '0'
            ? 'null'
            : this.numberPipe.transform(nightDia, '1.0-0'));
        this.nightGood = patientAnalyatics.night?.good;
        this.nightAlert = patientAnalyatics.night?.alert;
        this.nightHighAlert = patientAnalyatics.night?.highAlert;
        this.type = patientAnalyatics.night?.type;
      }
    } else {
      this.snackbarService.error('No data available');
    }
  }
  tabValues(evt: MatTabChangeEvent) {
    // this.agmMap.ngOnDestroy();
    // this.agmMap.ngOnInit();
    this.centroidArray = [];
    if (evt.index === 0) {
      this.requestBody['type'] = 'day';
      this.requestBody['value'] = '7';
      this.getReadings();
    } else if (evt.index === 1) {
      this.requestBody['type'] = 'day';
      this.requestBody['value'] = '15';
      this.getReadings();
    } else if (evt.index === 2) {
      this.requestBody['type'] = 'day';
      this.requestBody['value'] = '30';
      this.getReadings();
    }
  }
  getVitalHistoryList(id) {
    this.bp = [];
    this.weight = [];
    this.bs = [];
    this.service.getVitalHistory(id).subscribe(
      (res) => {
        if (res.bpHistory.length) {
          this.bp = res.bpHistory;
          // this.weight = res.weightHistory;
          // this.bs = res.bsHistory;
          this.loadRes = false;
          this.vitalBSDataSource.data = this.bs;
          this.vitalBPDataSource.data = this.bp;
          this.bpList = this.bp;
          this.vitalWeightDataSource.data = this.weight;
        }
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }
  getZoneColor(zone) {
    if (zone) {
      return this.numberPipe.transform(zone, '1.0-0');
    } else {
      return '';
    }
  }
  // getZoneColors(avgBP) {
  //   if (avgBP) {
  //     let BPvalues = avgBP.split('/');
  //     this.systolicCal(BPvalues[0]);
  //     this.diastolicCal(BPvalues[1]);

  //     if (this.systolicCal(BPvalues[0]) < this.diastolicCal(BPvalues[1])) {
  //       return this.systolicCal(BPvalues[0]);
  //     } else {
  //       return this.diastolicCal(BPvalues[1]);
  //     }
  //   } else return '-';
  // }
  getZoneColors(avgBP) {
    if (avgBP) {
      let BPvalues = avgBP.split('/');
      let currentDiastolic = parseInt(BPvalues[1]);
      let currentSystolic = parseInt(BPvalues[0]);

      const baseLineSystolic = localStorage.getItem('baselinesystolic')
        ? localStorage.getItem('baselinesystolic')
        : '120';
      const baseLineDiastolic = localStorage.getItem('baselinediastolic')
        ? localStorage.getItem('baselinediastolic')
        : '80';
      const lowerLimit = 0.1;
      const higherLimit = 0.2;

      const bpLowerLimit = lowerLimit;
      const bpHigherLimit = higherLimit;
      // for 10% calculation
      const tenPercentSystolicCal = Math.ceil(
        parseInt(baseLineSystolic, 10) * bpLowerLimit
      );
      const tenPercentDiastolicCal = Math.ceil(
        parseInt(baseLineDiastolic, 10) * bpLowerLimit
      );
      // for 20% calculation
      const twentyPercentSystolicCal = Math.ceil(
        parseInt(baseLineSystolic, 10) * bpHigherLimit
      );
      const twentyPercentDiastolicCal = Math.ceil(
        parseInt(baseLineDiastolic, 10) * bpHigherLimit
      );
      this.hyperTensionSystolicOrangeValue =
        parseInt(baseLineSystolic, 10) + tenPercentSystolicCal;
      this.hyperTensionDiastolicOrangeValue =
        parseInt(baseLineDiastolic, 10) + tenPercentDiastolicCal;
      this.hyperTensionSystolicRedValue =
        parseInt(baseLineSystolic, 10) + twentyPercentSystolicCal;
      this.hyperTensionDiastolicRedValue =
        parseInt(baseLineDiastolic, 10) + twentyPercentDiastolicCal;

      this.hypoTensionSystolicOrangeValue =
        parseInt(baseLineSystolic, 10) - tenPercentSystolicCal;
      this.hypoTensionDiastolicOrangeValue =
        parseInt(baseLineDiastolic, 10) - tenPercentDiastolicCal;
      this.hypoTensionSystolicRedValue =
        parseInt(baseLineSystolic, 10) - twentyPercentSystolicCal;
      this.hypoTensionDiastolicRedValue =
        parseInt(baseLineDiastolic, 10) - twentyPercentDiastolicCal;

      const systolicFlag = this.systolicCal(currentSystolic);
      const diastolicFlag = this.diastolicCal(currentDiastolic);

      let resultFlag;
      let resultBpType;

      if (
        this.systolicBptype === this.NORMAL &&
        this.diastolicBptype === this.NORMAL
      ) {
        resultFlag = this.GREEN_FLAG;
        resultBpType = this.NORMAL;
      } else if (
        this.systolicBptype === this.HYPO &&
        this.diastolicBptype === this.HYPO
      ) {
        resultBpType = this.HYPO;
        if (systolicFlag < diastolicFlag) {
          resultFlag = systolicFlag;
        } else resultFlag = Math.min(systolicFlag, diastolicFlag);
      } else if (
        this.systolicBptype === this.HYPER &&
        this.diastolicBptype === this.HYPER
      ) {
        resultBpType = this.HYPER;
        if (systolicFlag < diastolicFlag) {
          resultFlag = systolicFlag;
        } else resultFlag = Math.min(systolicFlag, diastolicFlag);
      } else if (
        this.systolicBptype === this.NORMAL &&
        this.diastolicBptype === this.HYPO
      ) {
        resultBpType = this.HYPO;
        resultFlag = diastolicFlag;
      } else if (
        this.systolicBptype === this.HYPO &&
        this.diastolicBptype === this.NORMAL
      ) {
        resultBpType = this.HYPO;
        resultFlag = systolicFlag;
      } else if (
        this.systolicBptype === this.NORMAL &&
        this.diastolicBptype === this.HYPER
      ) {
        resultBpType = this.HYPER;
        resultFlag = diastolicFlag;
      } else if (
        this.systolicBptype === this.HYPER &&
        this.diastolicBptype === this.NORMAL
      ) {
        resultFlag = systolicFlag;
        resultBpType = this.HYPER;
      } else if (
        this.systolicBptype === this.HYPER &&
        this.diastolicBptype === this.HYPO
      ) {
        if (systolicFlag < diastolicFlag) {
          resultFlag = systolicFlag;
          resultBpType = this.HYPER;
        } else if (systolicFlag > diastolicFlag) {
          resultFlag = diastolicFlag;
          resultBpType = this.HYPO;
        } else {
          const differenceinSystolic =
            currentSystolic - parseInt(baseLineSystolic, 10);
          const differenceinDiastolic =
            parseInt(baseLineDiastolic, 10) - currentDiastolic;
          if (differenceinSystolic >= differenceinDiastolic) {
            resultFlag = systolicFlag;
            resultBpType = this.HYPER;
          } else {
            resultFlag = diastolicFlag;
            resultBpType = this.HYPO;
          }
        }
      } else if (
        this.systolicBptype === this.HYPO &&
        this.diastolicBptype === this.HYPER
      ) {
        if (systolicFlag < diastolicFlag) {
          resultFlag = systolicFlag;
          resultBpType = this.HYPO;
        } else if (systolicFlag > diastolicFlag) {
          resultFlag = diastolicFlag;
          resultBpType = this.HYPER;
        } else {
          const differenceinSystolic =
            parseInt(baseLineSystolic, 10) - currentSystolic;
          const differenceinDiastolic =
            currentDiastolic - parseInt(baseLineDiastolic, 10);
          if (differenceinSystolic >= differenceinDiastolic) {
            resultFlag = systolicFlag;
            resultBpType = this.HYPO;
          } else {
            resultFlag = diastolicFlag;
            resultBpType = this.HYPER;
          }
        }
      } else {
        resultBpType = this.HYPER;
        if (systolicFlag < diastolicFlag) {
          resultFlag = systolicFlag;
        } else resultFlag = Math.min(systolicFlag, diastolicFlag);
      }
      return resultFlag;
    } else return '-';
  }
  // systolicCal(currentSytsolic) {
  //   // systolic range
  //   const hyperTensionSystolicOrangeValue = 132;
  //   const hyperTensionSystolicRedValue = 144;
  //   const hypoTensionSystolicOrangeValue = 108;
  //   const hypoTensionSystolicRedValue = 96;
  //   let systolicCalFlag;
  //   if (
  //     currentSytsolic >= hypoTensionSystolicOrangeValue &&
  //     currentSytsolic <= hyperTensionSystolicOrangeValue
  //   ) {
  //     systolicCalFlag = '3';
  //   } else if (
  //     currentSytsolic > hyperTensionSystolicOrangeValue &&
  //     currentSytsolic <= hyperTensionSystolicRedValue
  //   ) {
  //     systolicCalFlag = '2';
  //   } else if (
  //     currentSytsolic >= hypoTensionSystolicRedValue &&
  //     currentSytsolic < hypoTensionSystolicOrangeValue
  //   ) {
  //     systolicCalFlag = '2';
  //   } else if (currentSytsolic > hyperTensionSystolicRedValue) {
  //     systolicCalFlag = '1';
  //   } else if (currentSytsolic < hypoTensionSystolicRedValue) {
  //     systolicCalFlag = '1';
  //   }
  //   return systolicCalFlag;
  // }
  systolicCal(currentSystolic) {
    let systolicCalFlag: number;

    if (
      currentSystolic >= this.hypoTensionSystolicOrangeValue &&
      currentSystolic <= this.hyperTensionSystolicOrangeValue
    ) {
      systolicCalFlag = this.GREEN_FLAG;
      this.systolicBptype = this.NORMAL;
    } else if (
      currentSystolic > this.hyperTensionSystolicOrangeValue &&
      currentSystolic <= this.hyperTensionSystolicRedValue
    ) {
      systolicCalFlag = this.ORANGE_FLAG;
      this.systolicBptype = this.HYPER;
    } else if (
      currentSystolic >= this.hypoTensionSystolicRedValue &&
      currentSystolic < this.hypoTensionSystolicOrangeValue
    ) {
      systolicCalFlag = this.ORANGE_FLAG;
      this.systolicBptype = this.HYPO;
    } else if (currentSystolic > this.hyperTensionSystolicRedValue) {
      systolicCalFlag = this.RED_FLAG;
      this.systolicBptype = this.HYPER;
    } else {
      systolicCalFlag = this.RED_FLAG;
      this.systolicBptype = this.HYPO;
    }

    return systolicCalFlag;
  }

  // diastolicCal(currentDiastolic) {
  //   // diastolic range
  //   const hyperTensionDiastolicOrangeValue = 88;
  //   const hyperTensionDiastolicRedValue = 96;
  //   const hypoTensionDiastolicOrangeValue = 72;
  //   const hypoTensionDiastolicRedValue = 64;
  //   let diaStolicCalFlag;
  //   if (
  //     currentDiastolic >= hypoTensionDiastolicOrangeValue &&
  //     currentDiastolic <= hyperTensionDiastolicOrangeValue
  //   ) {
  //     diaStolicCalFlag = '3';
  //   } else if (
  //     currentDiastolic > hyperTensionDiastolicOrangeValue &&
  //     currentDiastolic <= hyperTensionDiastolicRedValue
  //   ) {
  //     diaStolicCalFlag = '2';
  //   } else if (
  //     currentDiastolic >= hypoTensionDiastolicRedValue &&
  //     currentDiastolic < hypoTensionDiastolicOrangeValue
  //   ) {
  //     diaStolicCalFlag = '2';
  //   } else if (currentDiastolic > hyperTensionDiastolicRedValue) {
  //     diaStolicCalFlag = '1';
  //   } else if (currentDiastolic < hypoTensionDiastolicRedValue) {
  //     diaStolicCalFlag = '1';
  //   }
  //   return diaStolicCalFlag;
  // }
  diastolicCal(currentDiastolic) {
    let diastolicCalFlag: number;

    if (
      currentDiastolic >= this.hypoTensionDiastolicOrangeValue &&
      currentDiastolic <= this.hyperTensionDiastolicOrangeValue
    ) {
      diastolicCalFlag = this.GREEN_FLAG;
      this.diastolicBptype = this.NORMAL;
    } else if (
      currentDiastolic > this.hyperTensionDiastolicOrangeValue &&
      currentDiastolic <= this.hyperTensionDiastolicRedValue
    ) {
      diastolicCalFlag = this.ORANGE_FLAG;
      this.diastolicBptype = this.HYPER;
    } else if (
      currentDiastolic >= this.hypoTensionDiastolicRedValue &&
      currentDiastolic < this.hypoTensionDiastolicOrangeValue
    ) {
      diastolicCalFlag = this.ORANGE_FLAG;
      this.diastolicBptype = this.HYPO;
    } else if (currentDiastolic > this.hyperTensionDiastolicRedValue) {
      diastolicCalFlag = this.RED_FLAG;
      this.diastolicBptype = this.HYPER;
    } else {
      diastolicCalFlag = this.RED_FLAG;
      this.diastolicBptype = this.HYPO;
    }

    return diastolicCalFlag;
  }
  getParticularLocation(value) {
    if (value.location_type === 'locations') {
      this.getReadings();
    } else {
      const body = {
        patientId: this.patientId,
        locationId: value.location_id,
      };
      this.service.getBpAnalyticsByLocId(body).subscribe((res) => {
        this.mapOperation(res);
      });
    }
  }
}
