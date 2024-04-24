import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { BPChartMorningObservation } from './../../../shared/models/bp-morningobs.model';
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
import { BPChartEveningObservation } from 'src/app/shared/models/bp-eveningObs.model';
import { BPChartObservation } from 'src/app/shared/models/BPChartObs.model';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { color } from 'echarts';
declare const CanvasJS: any;
@Component({
  selector: 'app-bp-line-range-chart',
  templateUrl: './bp-line-range-chart.component.html',
  styleUrls: ['./bp-line-range-chart.component.scss'],
})
export class BpLineRangeChartComponent implements OnInit, AfterViewInit {
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
  constructor(
    private caregiverservice: CaregiverDashboardService,
    private caregiverSharedService: CaregiverSharedService,
    private auth: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.patientId = localStorage.getItem('patientId');
    localStorage.removeItem('BPLineData');
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
  }
  ngOnInit() {
    setTimeout(() => {
      this.showData = true;
      this.noData = false;
    }, 0);
    this.caregiverSharedService.triggerdBPLine.subscribe((value) => {
      this.patientId = localStorage.getItem('patientId');
      if (value) {
        this.BPLineChartData = JSON.parse(value);
      }
    });
  }
  ngAfterViewInit() {
    this.caregiverSharedService.triggerdDates.subscribe((value) => {
      this.patientId = localStorage.getItem('patientId');

      if (
        Object.keys(value).length &&
        (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
      ) {
        this.BPLineChartData = [];
        const dynamicFromDate = this.caregiverSharedService.formatDate(
          value['from'] ? value['from'] : this.chartFromDate
        );
        const dynamicFromTime = new Date(
          value['from'] ? value['from'] : this.chartFromDate
        ).toTimeString();
        const dynamicToDate = this.caregiverSharedService.formatDate(
          value['to'] ? value['to'] : this.chartToDate
        );
        const dynamicToTime = new Date(
          value['to'] ? value['to'] : this.chartToDate
        ).toTimeString();
        (this.filterfromDate =
          dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8)),
          (this.filterToDate =
            dynamicToDate + 'T' + dynamicToTime.substring(0, 8)),
          this.getBPTime(
            this.patientId,
            this.filterfromDate,
            this.filterToDate
          );
      } else if (Object.keys(value).length && value.hasOwnProperty('id')) {
        this.BPLineChartData = [];
        this.getBPTime(value['id'], this.chartFromDate, this.chartToDate);
      } else {
        this.getBPTime(this.patientId, this.chartFromDate, this.chartToDate);
      }
    });
  }

  getBPTime(pId, fDate, tDate) {
    this.noData = false;
    const finalFromDate = fDate;
    const finalToDate = tDate;
    this.BPsysrange = [];
    this.BPdiasrange = [];
    this.BPsysresult = [];
    this.BPdiasresult = [];
    // let isoFromDateTime, isoToDateTime;
    if (typeof finalFromDate === 'object' && typeof finalToDate === 'object') {
      var isoFromDateTime = finalFromDate.toISOString().split('T');
      var isoToDateTime = finalToDate.toISOString().split('T');
    } else {
      var isoFromDateTime = finalFromDate.split('T');
      var isoToDateTime = finalToDate.split('T');
    }
    const body = {
      dateFrom: isoFromDateTime[0] + 'T' + '00:00:00',
      dateTo: isoToDateTime[0] + 'T' + '23:59:59',
    };
    this.getValidDate(body.dateFrom);
    if (this.BPLineChartData && this.BPLineChartData.length) {
      this.bpChartList = this.BPLineChartData.reverse();
      this.dataProcessing(this.bpChartList);
    } else {
      this.caregiverservice.getBPManagementDate(body, pId).subscribe(
        (data) => {
          this.showData = false;
          let response = data;
          let hyperHypoBPData = [
            ...(response?.patienHyperBptList !== null
              ? response?.patienHyperBptList
              : []),
            ...(response?.patienHypoBptList !== null
              ? response?.patienHypoBptList
              : []),
          ];
          localStorage.setItem('BPLineData', JSON.stringify(hyperHypoBPData));
          this.caregiverSharedService.changeBPLine(
            localStorage.getItem('BPLineData')
          );
          this.bpChartList = hyperHypoBPData?.reverse();

          this.dataProcessing(this.bpChartList);
        },
        (err) => {
          this.showData = false;
          this.noData = true;
          this.snackbarService.error(err.message);
        }
      );
    }
  }

  // dataProcessing(data) {
  //   if (data === null || !data?.length) {
  //     this.showData = false;
  //     this.noData = true;
  //     return;
  //   }

  //   this.systolicBP = data?.systolicBaseline;
  //   this.diastolicBP = data?.diastolicBaseline;

  //   let ssymphighImg = [];
  //   let dsymphighImg = [];
  //   let ssympalertImg = [];
  //   let dsympalertImg = [];
  //   let zonecolor;
  //   const bplowersysrange = 100;
  //   const bpuppersysrange = 129;
  //   const bplowerdiasrange = 71;
  //   const bpupperdiasrange = 89;
  //   data.forEach((ele) => {
  //     zonecolor =
  //       ele.zoneofpat == '1'
  //         ? '#F44336'
  //         : ele.zoneofpat == '2'
  //         ? '#FCAB17'
  //         : ele.zoneofpat == '3'
  //         ? '#6FBE46'
  //         : '';
  //     const splittedBP = ele.presentBp.split('/');

  //     const patientSystolic = splittedBP[0];
  //     const patientDiastolic = splittedBP[1];
  //     const ssymphigh =
  //       ele.zoneofpat == '1' ? ele.symptoms : Number(patientSystolic);
  //     const dsymphigh =
  //       ele.zoneofpat == '1' ? ele.symptoms : Number(patientDiastolic);
  //     const ssympalert =
  //       ele.zoneofpat == '2' ? ele.symptoms : Number(patientSystolic);
  //     const dsympalert =
  //       ele.zoneofpat == '2' ? ele.symptoms : Number(patientDiastolic);

  //     if (ssymphigh && this.isJsonString(ssymphigh)) {
  //       const str: string = '' + ssymphigh;
  //       ssymphighImg = JSON.parse(str);
  //     }

  //     if (dsymphigh && this.isJsonString(dsymphigh)) {
  //       const str: string = '' + dsymphigh;
  //       dsymphighImg = JSON.parse(str);
  //     }

  //     if (ssympalert && this.isJsonString(ssympalert)) {
  //       const str: string = '' + ssympalert;
  //       ssympalertImg = JSON.parse(str);
  //     }

  //     if (dsympalert && this.isJsonString(dsympalert)) {
  //       const str: string = '' + dsympalert;
  //       dsympalertImg = JSON.parse(str);
  //     }

  //     if (ele && Object.keys(ele).length !== 0) {
  //       this.BPsysresult.push({
  //         x: new Date(this.getFormattedDate(ele.createdAt)),

  //         y: [Number(patientSystolic), Number(patientDiastolic)],
  //         color: zonecolor,
  //       });
  //     }
  //   });

  //   if (this.BPsysresult.length) {
  //     this.bpTimeLoad(this.BPsysresult);
  //   }
  //   this.showData = false;
  // }
  // dataProcessing(data) {
  //   if (data === null || !data.length) {
  //     this.showData = false;
  //     this.noData = true;
  //   }

  //   this.systolicBP = data.systolicBaseline;
  //   this.diastolicBP = data.diastolicBaseline;

  //   let ssymphighImg = [];
  //   let dsymphighImg = [];
  //   let ssympalertImg = [];
  //   let dsympalertImg = [];
  //   let color;
  //   var bplowersysrange = 100;
  //   var bpuppersysrange = 129;
  //   var bplowerdiasrange = 71;
  //   var bpupperdiasrange = 89;
  //   data.forEach((ele) => {
  //     color =
  //       ele.zoneofpat == '1'
  //         ? 'red'
  //         : ele.zoneofpat == '2'
  //         ? 'orange'
  //         : ele.zoneofpat == '3'
  //         ? 'green'
  //         : '';
  //     const splittedBP = ele.presentBp.split('/');

  //     const patientSystolic = splittedBP[0];
  //     const patientDiastolic = splittedBP[1];
  //     const ssymphigh =
  //       ele.zoneofpat == '1' ? ele.symptoms : Number(patientSystolic);
  //     const dsymphigh =
  //       ele.zoneofpat == '1' ? ele.symptoms : Number(patientDiastolic);
  //     const ssympalert =
  //       ele.zoneofpat == '2' ? ele.symptoms : Number(patientSystolic);
  //     const dsympalert =
  //       ele.zoneofpat == '2' ? ele.symptoms : Number(patientDiastolic);

  //     if (ssymphigh) {
  //       const str: string = '' + ssymphigh;
  //       ssymphighImg = JSON.parse(str);
  //     }

  //     if (dsymphigh) {
  //       const str: string = '' + dsymphigh;
  //       dsymphighImg = JSON.parse(str);
  //     }

  //     if (ssympalert) {
  //       const str: string = '' + ssympalert;
  //       ssympalertImg = JSON.parse(str);
  //     }

  //     if (dsympalert) {
  //       const str: string = '' + dsympalert;
  //       dsympalertImg = JSON.parse(str);
  //     }

  //     if (ele && Object.keys(ele).length !== 0) {
  //       this.BPsysrange.push({
  //         label: CanvasJS.formatDate(
  //           new Date(this.getFormattedDate(ele.createdAt)),
  //           'MM/DD'
  //         ),
  //         y: [bplowersysrange, bpuppersysrange],
  //         markerColor: '#FF000000',
  //       });

  //       this.BPdiasrange.push({
  //         label: CanvasJS.formatDate(
  //           new Date(this.getFormattedDate(ele.createdAt)),
  //           'MM/DD'
  //         ),
  //         y: [bplowerdiasrange, bpupperdiasrange],
  //         markerColor: '#FF000000',
  //       });
  //       this.BPdiasresult.push({
  //         label: CanvasJS.formatDate(
  //           new Date(this.getFormattedDate(ele.createdAt)),
  //           'MM/DD'
  //         ),
  //         y: Number(patientDiastolic),
  //         markerColor: color,
  //         toolTipContent:
  //           ele.zoneofpat == '1'
  //             ? this.getgraphBPImage(dsymphighImg) +
  //               '<br />' +
  //               `BP :${Number(patientSystolic)}/{y}` +
  //               '<br />' +
  //               `${CanvasJS.formatDate(
  //                 this.getFormattedDate(ele.createdAt),
  //                 'MM-DD-YYYY hh:mm tt'
  //               )}`
  //             : ele.zoneofpat == '2'
  //             ? this.getgraphBPImage(dsympalertImg) +
  //               '<br />' +
  //               `BP :${Number(patientSystolic)}/{y}` +
  //               '<br />' +
  //               `${CanvasJS.formatDate(
  //                 this.getFormattedDate(ele.createdAt),
  //                 'MM-DD-YYYY hh:mm tt'
  //               )}`
  //             : `BP :${Number(patientSystolic)}/{y}` +
  //               '<br />' +
  //               `${CanvasJS.formatDate(
  //                 this.getFormattedDate(ele.createdAt),
  //                 'MM-DD-YYYY hh:mm tt'
  //               )}`,
  //       });
  //       this.BPsysresult.push({
  //         label: CanvasJS.formatDate(
  //           new Date(this.getFormattedDate(ele.createdAt)),
  //           'MM/DD'
  //         ),
  //         y: Number(patientSystolic),
  //         markerColor: color,
  //         toolTipContent:
  //           ele.zoneofpat == '1'
  //             ? this.getgraphBPImage(ssymphighImg) +
  //               '<br />' +
  //               `BP : {y}/${Number(patientDiastolic)}` +
  //               '<br />' +
  //               `${CanvasJS.formatDate(
  //                 this.getFormattedDate(ele.createdAt),
  //                 'MM-DD-YYYY hh:mm tt'
  //               )}`
  //             : ele.zoneofpat == '2'
  //             ? this.getgraphBPImage(ssympalertImg) +
  //               '<br />' +
  //               `BP : {y}/${Number(patientDiastolic)}` +
  //               '<br />' +
  //               `${CanvasJS.formatDate(
  //                 this.getFormattedDate(ele.createdAt),
  //                 'MM-DD-YYYY hh:mm tt'
  //               )}`
  //             : `BP : {y}/${Number(patientDiastolic)}` +
  //               '<br />' +
  //               `${CanvasJS.formatDate(
  //                 this.getFormattedDate(ele.createdAt),
  //                 'MM-DD-YYYY hh:mm tt'
  //               )}`,
  //       });
  //     }
  //   });

  //   if (
  //     this.BPsysrange.length &&
  //     this.BPdiasrange.length &&
  //     this.BPsysresult.length &&
  //     this.BPdiasresult
  //   ) {
  //     this.bpTimeLoad(
  //       this.BPsysrange,
  //       this.BPdiasrange,
  //       this.BPsysresult,
  //       this.BPdiasresult
  //     );
  //   }
  //   this.showData = false;
  // }

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

    // Initialize the maximum value to null
    var maxYValue = null;

    // Iterate through your data to find the maximum value
    bpsysResult.forEach(function (dataPoint) {
      var sysValue = dataPoint.y[0]; // Assuming systolic values are in the first element of the y array
      if (sysValue > maxYValue) {
        maxYValue = sysValue;
      }
    });
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
        minimum: 30, // Set the minimum value of the y-axis to ensure 80 is visible
        maximum:
          parseInt(localStorage.getItem('baselinesystolic')) > maxYValue &&
          parseInt(localStorage.getItem('baselinesystolic')) >
            parseInt(localStorage.getItem('baselinediastolic'))
            ? parseInt(localStorage.getItem('baselinesystolic'))
            : parseInt(localStorage.getItem('baselinediastolic')) > maxYValue &&
              parseInt(localStorage.getItem('baselinediastolic')) >
                parseInt(localStorage.getItem('baselinesystolic'))
            ? parseInt(localStorage.getItem('baselinediastolic'))
            : maxYValue + 10,
        stripLines: [
          {
            value: localStorage.getItem('baselinesystolic'), // Value for the first vertical line
            label: `Baseline Systolic: ${localStorage.getItem(
              'baselinesystolic'
            )}`, // Label for the first line
            labelFontColor: '#444444', // Color for the first line label
            lineDashType: 'dash', // Type of line (dotted, dash, etc.) for the first line
            color: '#452B86', // Color for the first line
            lineThickness: 12,
            labelAlign: 'center',
          },
          {
            value: parseFloat(localStorage.getItem('baselinediastolic')),
            label: `Baseline Diastolic: ${localStorage.getItem(
              'baselinediastolic'
            )}`,
            labelFontColor: '#444444',
            lineDashType: 'dash',
            color: '#452B86',
            lineThickness: 20,
            // Add this line to move the label outside the plot area
          },
        ],
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

  // bpTimeLoad(bpsysResult) {
  //   const dataForY0 = bpsysResult.map((item) => ({
  //     x: item.x,
  //     y: item.y[0], // Keep "y" in an array with one value
  //     color: item.color,
  //   }));

  //   const dataForY1 = bpsysResult.map((item) => ({
  //     x: item.x,
  //     y: item.y[1], // Keep "y" in an array with one value
  //     color: item.color,
  //   }));
  //   CanvasJS.addColorSet('greenShades', [
  //     //colorSet Array
  //     '#53c7ff',
  //   ]);

  //   var chart = new CanvasJS.Chart('bpMgmt', {
  //     theme: 'light2', // "light1", "light2", "dark1", "dark2"
  //     colorSet: 'greenShades',
  //     animationEnabled: true,

  //     axisX: {
  //       valueFormatString: 'DD/MM/YYYY',
  //       interval: 1,
  //     },
  //     axisY: {
  //       title: 'Blood Pressure',
  //       // prefix: "$"
  //     },
  //     dataPointWidth: 10,

  //     // data: [
  //     //   {
  //     //     type: 'rangeColumn',
  //     //     yValueFormatString: '#,##0',
  //     //     xValueFormatString: 'DD MMM YYYY',
  //     //     toolTipContent: '{x}<br>Systolic: {y[0]}<br>Diastolic: {y[1]}',
  //     //     dataPoints: bpsysResult,
  //     //   },
  //     // ],
  //     data: [
  //       {
  //         type: 'column',
  //         yValueFormatString: '<br>Systolic: #,##0',
  //         xValueFormatString: 'DD MMM YYYY',
  //         // showInLegend: true,
  //         indexLabelFontColor: 'black',
  //         indexLabelOrientation: 'vertical',
  //         dataPoints: dataForY0,
  //       },
  //       {
  //         type: 'column',
  //         yValueFormatString: '<br>Diastolic: #,##0',
  //         xValueFormatString: 'DD MMM YYYY',
  //         indexLabelFontColor: 'black',
  //         indexLabelOrientation: 'vertical',
  //         // axisYType: 'secondary',
  //         // showInLegend: true,
  //         dataPoints: dataForY1,
  //       },
  //     ],
  //   });
  //   // Add a gap between bars by increasing the indexLabelFontSize
  //   chart.options.data.forEach(function (dataSeries) {
  //     dataSeries.indexLabelFontSize = 50; // Adjust this value to control the gap between bars
  //   });
  //   chart.render();
  // }
  // bpTimeLoad(bpsysRange, bpdiasRange, bpsysResult, bpdiasResult) {
  //   CanvasJS.addColorSet('skyOrange', [
  //     '#76AEF4',
  //     '#F9ED63',
  //     '#000000',
  //     '#000000',
  //   ]);
  //   var chart = new CanvasJS.Chart('bpMgmt', {
  //     animationEnabled: true,
  //     exportEnabled: false,
  //     colorSet: 'skyOrange',
  //     // title: {
  //     // text: "Baseline:" + this.systolicBP + '/' + this.diastolicBP
  //     // },
  //     axisY: {
  //       title: 'Blood Pressure',
  //       suffix: '',
  //     },
  //     axisX: {
  //       title: '',
  //       // interval: 1,
  //       valueFormatString: 'DD/MM hh:mm tt',
  //       labelAngle: -56,
  //     },

  //     data: [
  //       {
  //         type: 'rangeArea',
  //         // markerType: 'none',
  //         markerSize: 5,
  //         markerType: 'triangle',
  //         dataPoints: bpsysRange,
  //         toolTipContent:
  //           '<span style="color:#4F81BC"><b>{y[0]} / {y[1]}</b></span>',
  //       },
  //       {
  //         type: 'rangeArea',
  //         // markerType: 'none',
  //         markerType: 'triangle',
  //         markerSize: 5,
  //         dataPoints: bpdiasRange,
  //         toolTipContent:
  //           '<span style="color:#4F81BC"><b>{y[0]} / {y[1]}</b></span>',
  //       },
  //       {
  //         type: 'line',
  //         markerSize: 5,
  //         markerType: 'circle',
  //         dataPoints: bpsysResult,
  //       },
  //       {
  //         type: 'line',
  //         markerSize: 5,
  //         markerType: 'circle',
  //         dataPoints: bpdiasResult,
  //       },
  //     ],
  //   });
  //   chart.render();
  // }
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
