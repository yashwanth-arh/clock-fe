import { AuthService } from 'src/app/core/services/auth.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import * as echarts from 'echarts';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
declare const CanvasJS: any;
@Component({
  selector: 'app-bp-trend-pie-chart',
  templateUrl: './bp-trend-pie-chart.component.html',
  styleUrls: ['./bp-trend-pie-chart.component.scss'],
})
export class BpTrendPieChartComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  patientId: string;
  showGraph: boolean;
  showData = true;
  filterfromDate: string;
  filterToDate: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  maxDate: Date = new Date();
  BPTrendData: any = [];
  totalCountBP = 0;
  roleid: any;
  leavingComponent: boolean = false;
  userRole: string;
  BPTrendChartData: any;
  osType: string;
  myChart: any;
  @ViewChild('bpTrend') bpTrendId: ElementRef;

  constructor(
    private caregiverservice: CaregiverDashboardService,
    private auth: AuthService,
    private snackbarService: SnackbarService,
    private caregiverSharedService: CaregiverSharedService
  ) {
    this.leavingComponent = false;
    localStorage.removeItem('BPTrendData');
    this.patientId = localStorage.getItem('patientId');
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  ngOnInit() {
    this.leavingComponent = false;
    this.osType = window.navigator.platform;

    this.caregiverSharedService.triggerdBPTrend.subscribe((value) => {
      if (value && !value.hasOwnProperty('id')) {
        this.BPTrendChartData = JSON.parse(value);
      }
    });
  }
  ngAfterViewInit() {
    this.leavingComponent = false;
    this.caregiverSharedService.triggerdDates.subscribe((value) => {
      if (this.leavingComponent) {
        return;
      }
      this.patientId = localStorage.getItem('patientId');

      if (
        Object.keys(value).length &&
        (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
      ) {
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
          (this.BPTrendChartData = []);
        this.getBPTrend(value.id, this.filterfromDate, this.filterToDate);
      } else if (Object.keys(value).length && value.hasOwnProperty('id')) {
        this.BPTrendChartData = [];
        this.getBPTrend(value.id, this.chartFromDate, this.chartToDate);
      } else {
        this.getBPTrend(this.patientId, this.chartFromDate, this.chartToDate);
      }
    });
    this.caregiverSharedService.triggerdgraphs.subscribe((value) => {
      if (this.leavingComponent) {
        return;
      }
      if (Object.keys(value).length !== 0) {
        this.getBPTrend(this.patientId, this.chartFromDate, this.chartToDate);
      }
    });
  }

  getBPTrend(pId, fDate, tDate) {
    const body = {};
    this.BPTrendData = [];
    this.totalCountBP = 0;
    let finalFromDate = fDate;
    let finalToDate = tDate;
    if (typeof fDate !== 'object') {
      const fromDate = finalFromDate.split('T');
      const toDate = finalToDate.split('T');
      (body['dateFrom'] = fromDate[0] + 'T' + '00:00:00'),
        (body['dateTo'] = toDate[0] + 'T' + '23:59:59');
    } else {
      finalFromDate = finalFromDate.toISOString().split('T');
      finalToDate = finalToDate.toISOString().split('T');
      (body['dateFrom'] = finalFromDate[0] + 'T' + '00:00:00'),
        (body['dateTo'] = finalToDate[0] + 'T' + '23:59:59');
    }

    // if (!body.dateFrom.toString().includes('Invalid') && !body.dateTo.toString().includes('Invalid')) {
    this.getValidDate(body['dateFrom']);
    if (this.BPTrendChartData && this.BPTrendChartData.length) {
      this.BPTrendData = this.BPTrendChartData;
      this.dataProcessing(this.BPTrendData);
    } else {
      this.caregiverservice.getBPTrendDate(body, pId).subscribe(
        (data) => {
          if (data.zones.length) {
            localStorage.setItem('BPTrendData', JSON.stringify(data.zones));
            this.caregiverSharedService.changeBPTrend(
              localStorage.getItem('BPTrendData')
            );
            this.dataProcessing(data.zones);
          } else {
            this.snackbarService.error('No data available');
          }
        },
        (err) => {
          this.showData = false;
          this.showGraph = false;
          // this.snackbarService.error(err.message);
        }
      );
    }
    // }
  }
  dataProcessing(data) {
    if (!data.length) {
      this.showData = false;
    }
    const bpData = [];
    this.totalCountBP = 0;

    data?.forEach((e) => {
      this.totalCountBP += Number(e.value);
      bpData.push({
        name: e.name == 'highAlert' ? 'HIGH ALERT' : e.name.toUpperCase(),
        value: e.value,
        position: 'inside',
      });
    });
    this.showGraph = this.totalCountBP > 0 ? true : false;
    this.showData = false;
    setTimeout(() => {
      if (this.showGraph) {
        this.BPTrendData = [...bpData].reverse();
        this.bpTrendLoad();
      }
    }, 1000);
  }
  bpTrendLoad() {
    // var bpChart = document?.getElementById('bpTrend');
    const divEl: HTMLDivElement = this.bpTrendId?.nativeElement;

    this.myChart = echarts?.init(divEl);
    // let choice;
    const colorPalette = ['#6FBE46', '#FCAB17', '#F44336'];
    const choice = {
      // tooltip: {
      //   trigger: 'item',
      //   formatter: function (params) {
      //     return `${params.name}: ${params.data.value} (${params.percent}%)`;
      //   },
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}<br /> ({d}%)',
        position: 'bottom',
      },
      legend: {
        formatter: (name) => {
          var series = this.myChart.getOption().series[0];
          var value = series.data.filter((row) => row.name === name)[0].value;
          return `${name}: ${value}`;
        },
        orient: 'horizontal',
        bottom: '-2%',
        // window.innerWidth === 1728 && window.innerHeight === 914
        //   ? '2%'
        //   : '2%',

        // x: '20vw',
        // y:'10vw', //The legend can be set to the left, right and center
        // top: 'bottom',
        // formatter: function (params) {
        //   return `${params.name}: ${params.data.value} (${params.percent}%)`;
        // },
        //You can set the legend to be on top, bottom, and center
        // margin: [20, 0, 0, 0],   //You can set the legend [distance from the top, distance from the right, distance from the bottom, distance from the left]
      },
      series: [
        {
          name: 'BP',
          type: 'pie',
          radius: '70%',
          color: colorPalette,
          data: this.BPTrendData,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          // width: "56%",
          // height: "23%",
        },
      ],
    };

    choice && this.myChart.setOption(choice);
    // var chart = new CanvasJS.Chart('bpTrend', {
    //   animationEnabled: true,
    //   title: {
    //     text: 'Desktop Search Engine Market Share - 2016',
    //   },
    //   data: [
    //     {
    //       type: 'pie',
    //       startAngle: 240,
    //       yValueFormatString: '##0.00"%"',
    //       indexLabel: '{label} {y}',
    //       dataPoints: [
    //         { y: 79.45, label: 'Google' },
    //         { y: 7.31, label: 'Bing' },
    //         { y: 7.06, label: 'Baidu' },
    //         { y: 4.91, label: 'Yahoo' },
    //         { y: 1.26, label: 'Others' },
    //       ],
    //     },
    //   ],
    // });
    // chart.render();
  }

  getValidDate(d) {
    if (
      Object.prototype.toString.call(d) === '[object Date]' ||
      d.includes('Invalid')
    ) {
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
