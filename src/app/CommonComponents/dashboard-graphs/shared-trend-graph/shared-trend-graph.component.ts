import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { ForgotPasswordService } from 'src/app/forgot-password/service/forgot-password.service';
declare const CanvasJS: any;

@Component({
  selector: 'app-shared-trend-graph',
  templateUrl: './shared-trend-graph.component.html',
  styleUrls: ['./shared-trend-graph.component.scss'],
})
export class SharedTrendGraphComponent implements OnInit, AfterViewInit {
  patientId: string;
  showData: boolean;
  filterfromDate: string;
  filterToDate: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  @Output() BPTime = new EventEmitter();
  bpChartList: any = [];
  BPsysrange: any = [];
  BPdiasrange: any = [];
  BPsysresult: any = [];
  BPdiasresult: any = [];
  bpObservationlist = [];
  noData: boolean;
  systolicBP: string;
  diastolicBP: string;
  maxDate: Date = new Date();
  caregiverToDate: Date = new Date();
  caregiverFromDate: Date = new Date();
  roleid: any;
  userRole: string;
  patientSystolic: string;
  patientDiastolic: string;
  BPLineChartData: any;
  sessionId: any;
  toDate: any;
  fromDate: any;
  constructor(
    private caregiverservice: CaregiverDashboardService,
    private caregiverSharedService: CaregiverSharedService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private forgotService: ForgotPasswordService,
    private snackbarService: SnackbarService
  ) {
    // this.patientId = localStorage.getItem('patientId');
    localStorage.removeItem('BPLineData');
    // this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.fromDate = this.route.snapshot.queryParams.dateFrom;
    this.toDate = this.route.snapshot.queryParams.dateTo;
    this.patientId = this.route.snapshot.queryParams.patientId;
    this.sessionId = this.route.snapshot.queryParams.sessionId;
  }
  ngOnInit() {
    this.getBPTime(this.patientId, this.sessionId, this.fromDate, this.toDate);

    // this.dataProcessing([
    //   {
    //     symptoms: null,
    //     zoneofpat: '1',
    //     presentBp: '130/60',
    //     baseLineBP: '120/80',
    //     createdAt: '2023-08-02T20:08:45.000+00:00',
    //   },
    //   {
    //     createdAt: '2023-07-27T17:25:51.000+00:00',
    //     zoneofpat: '1',
    //     symptoms:
    //       '[{"symptomName":"Cardio Vascular Stroke","symptomUrl":"CardioVascular.png"}]',
    //     baseLineBP: '120/80',
    //     presentBp: '190/80',
    //   },
    // ]);

    // setTimeout(() => {
    //   this.showData = true;
    //   this.noData = false;
    // }, 0);
    // this.caregiverSharedService.triggerdBPLine.subscribe((value) => {
    //   this.patientId = localStorage.getItem('patientId');
    //   if (value) {
    //     this.BPLineChartData = JSON.parse(value);
    //   }
    // });
  }
  ngAfterViewInit() {
    // this.caregiverSharedService.triggerdDates.subscribe((value) => {
    //   this.patientId = localStorage.getItem('patientId');
    //   if (
    //     Object.keys(value).length &&
    //     (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
    //   ) {
    //     this.BPLineChartData = [];
    //     const dynamicFromDate = this.caregiverSharedService.formatDate(
    //       value['from'] ? value['from'] : this.chartFromDate
    //     );
    //     const dynamicFromTime = new Date(
    //       value['from'] ? value['from'] : this.chartFromDate
    //     ).toTimeString();
    //     const dynamicToDate = this.caregiverSharedService.formatDate(
    //       value['to'] ? value['to'] : this.chartToDate
    //     );
    //     const dynamicToTime = new Date(
    //       value['to'] ? value['to'] : this.chartToDate
    //     ).toTimeString();
    //     (this.filterfromDate =
    //       dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8)),
    //       (this.filterToDate =
    //         dynamicToDate + 'T' + dynamicToTime.substring(0, 8)),
    //       this.getBPTime(
    //         this.patientId,
    //         this.filterfromDate,
    //         this.filterToDate
    //       );
    //   } else if (Object.keys(value).length && value.hasOwnProperty('id')) {
    //     this.BPLineChartData = [];
    //     this.getBPTime(value['id'], this.chartFromDate, this.chartToDate);
    //   } else {
    //     this.getBPTime(this.patientId, this.chartFromDate, this.chartToDate);
    //   }
    // });
    this.getBPTime(this.patientId, this.sessionId, this.fromDate, this.toDate);
  }

  getBPTime(pId, sId, fDate, tDate) {
    this.noData = false;
    const body = {
      dateFrom: fDate,
      dateTo: tDate,
    };

    this.forgotService.bpGainPatternGraph(body, pId, sId).subscribe(
      (data) => {
        let response = data;
        let hyperHypoBPData = [
          ...response.patienHyperBptList,
          ...response.patienHypoBptList,
          ...response.patienNormalBpList,
        ];
        // localStorage.setItem('BPLineData', JSON.stringify(hyperHypoBPData));
        // this.caregiverSharedService.changeBPLine(
        //   localStorage.getItem('BPLineData')
        // );
        this.bpChartList = hyperHypoBPData?.reverse();

        this.dataProcessing(this.bpChartList);
      },
      (err) => {
        this.showData = false;
        this.noData = true;
        this.snackbarService.error(err.message);
      }
    );
    // }
  }

  dataProcessing(data) {
    if (data === null || !data?.length) {
      this.showData = false;
      this.noData = true;
      return;
    }

    this.systolicBP = data?.systolicBaseline;
    this.diastolicBP = data?.diastolicBaseline;

    let ssymphighImg = [];
    let dsymphighImg = [];
    let ssympalertImg = [];
    let dsympalertImg = [];
    let zonecolor;
    const bplowersysrange = 100;
    const bpuppersysrange = 129;
    const bplowerdiasrange = 71;
    const bpupperdiasrange = 89;
    data.forEach((ele) => {
      zonecolor =
        ele.zoneofpat == '1'
          ? '#F44336'
          : ele.zoneofpat == '2'
          ? '#FCAB17'
          : ele.zoneofpat == '3'
          ? '#6FBE46'
          : '';
      const splittedBP = ele.presentBp.split('/');

      const patientSystolic = splittedBP[0];
      const patientDiastolic = splittedBP[1];
      const ssymphigh =
        ele.zoneofpat == '1' ? ele.symptoms : Number(patientSystolic);
      const dsymphigh =
        ele.zoneofpat == '1' ? ele.symptoms : Number(patientDiastolic);
      const ssympalert =
        ele.zoneofpat == '2' ? ele.symptoms : Number(patientSystolic);
      const dsympalert =
        ele.zoneofpat == '2' ? ele.symptoms : Number(patientDiastolic);

      if (ssymphigh && this.isJsonString(ssymphigh)) {
        const str: string = '' + ssymphigh;
        ssymphighImg = JSON.parse(str);
      }

      if (dsymphigh && this.isJsonString(dsymphigh)) {
        const str: string = '' + dsymphigh;
        dsymphighImg = JSON.parse(str);
      }

      if (ssympalert && this.isJsonString(ssympalert)) {
        const str: string = '' + ssympalert;
        ssympalertImg = JSON.parse(str);
      }

      if (dsympalert && this.isJsonString(dsympalert)) {
        const str: string = '' + dsympalert;
        dsympalertImg = JSON.parse(str);
      }

      if (ele && Object.keys(ele).length !== 0) {
        this.BPsysresult.push({
          x: new Date(this.getFormattedDate(ele.createdAt)),

          y: [Number(patientSystolic), Number(patientDiastolic)],
          color: zonecolor,
        });
      }
    });

    if (this.BPsysresult.length) {
      this.bpTimeLoad(this.BPsysresult);
    }
    this.showData = false;
  }
  getgraphBPImage(symptoms) {
    let img = '';
    for (let i = 0; i < symptoms.length; i++) {
      if (!symptoms[i].symptomUrl?.includes('yes')) {
        img += `<img src='assets/img/symptoms/${symptoms[i].symptomUrl}' height="40" width="40" />`;
      }
    }
    return img;
  }
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  bpTimeLoad(bpsysResult) {
    CanvasJS.addColorSet('greenShades', [
      //colorSet Array
      '#53c7ff',
    ]);

    var chart = new CanvasJS.Chart('bpMgmt', {
      theme: 'light2', // "light1", "light2", "dark1", "dark2"
      colorSet: 'greenShades',
      animationEnabled: true,
      axisX: {
        valueFormatString: 'DD/MM/YYYY',
      },
      axisY: {
        title: 'Blood Pressure',
        // prefix: "$"
      },
      dataPointWidth: 10,

      data: [
        {
          type: 'rangeColumn',
          yValueFormatString: '#,##0',
          xValueFormatString: 'DD MMM YYYY',
          toolTipContent: '{x}<br>Systolic: {y[0]}<br>Diastolic: {y[1]}',
          dataPoints: bpsysResult,
        },
      ],
    });
    chart.render();
  }
  addBPMorObs(mObs, element) {
    (mObs.baseLineBP = element.baseLineBP),
      (mObs.bpResult = element.bpResult),
      (mObs.createdAt = element.createdAt),
      (mObs.patientDiastolic = this.patientDiastolic),
      (mObs.patientSystolic = this.patientSystolic),
      (mObs.symptoms = element.symptoms),
      (mObs.timePostDialysis = element.timePostDialysis),
      (mObs.zoneofpat = element.zoneofpat);
    return mObs;
  }
  addBPEvenObs(eObs, element) {
    (eObs.baseLineBP = element.baseLineBP),
      (eObs.bpResult = element.bpResult),
      (eObs.createdAt = element.createdAt),
      (eObs.patientDiastolic = this.patientDiastolic),
      (eObs.patientSystolic = this.patientSystolic),
      (eObs.symptoms = element.symptoms),
      (eObs.timePostDialysis = element.timePostDialysis),
      (eObs.zoneofpat = element.zoneofpat);
    return eObs;
  }
  getFormattedDate(date) {
    const splittedDate = date.split('T');
    const splittedTime = splittedDate[1].split(':');
    const splittedFormattedDate = splittedDate[0].split('-');
    return (
      splittedFormattedDate[1] +
      '/' +
      splittedFormattedDate[2] +
      '/' +
      splittedFormattedDate[0] +
      ',' +
      splittedTime[0] +
      ':' +
      splittedTime[1]
    );
    // return new Date(date);
  }
  getValidDate(d) {
    if (Object.prototype.toString.call(d) === '[object Date]') {
      // it is a date
      if (isNaN(d)) {
        // d.getTime() or d.valueOf() will also work
        // date object is not valid
        this.snackbarService.error(
          'Something went wrong, kindly refresh and check'
        );
      } else {
        // date object is valid
      }
    } else {
      // not a date object
    }
  }
}
