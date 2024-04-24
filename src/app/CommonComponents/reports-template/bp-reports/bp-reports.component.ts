import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation,OnChanges } from '@angular/core';
import * as echarts from 'echarts';
declare const CanvasJS: any;

@Component({
  selector: 'app-bp-reports',
  templateUrl: './bp-reports.component.html',
  styleUrls: ['./bp-reports.component.scss'],
})
export class BpReportsComponent implements OnChanges {
  bpTrendDataArr: any = [];
  BPsysrange: any = [];
  BPdiasrange: any = [];
  BPsysresult: any = [];
  BPdiasresult: any = [];
  @Input() bpReport: any;

  constructor(private dateFormat: DatePipe) {}

  // ngOnInit(): void {
  //   // this.bpTrendData = this.bpReport?.bpPieCharReport;
  // }
  ngOnChanges() {
    this.dataProcessing();
    this.linedataProcessing();
  }
  dataProcessing() {
    this.bpTrendDataArr.push(
      {
        name: 'Alert (Hypertension)',
        value: this.bpReport?.bpPieCharReport.alertHyperCount,
      },
      {
        name: 'Alert (Hypotension)',
        value: this.bpReport?.bpPieCharReport.alertHypoCount,
      },
      {
        name: 'Good (Normal)',
        value: this.bpReport?.bpPieCharReport.goodNormalCount,
      },
      {
        name: 'High Alert (Hypertension)',
        value: this.bpReport?.bpPieCharReport.highAlertHyperCount,
      },
      {
        name: 'High Alert (Hypotension)',
        value: this.bpReport?.bpPieCharReport.highAlertHypoCount,
      }
    );
    this.bpTrendLoad();
  }
  linedataProcessing() {
    const bplowersysrange = 100;
    const bpuppersysrange = 129;
    const bplowerdiasrange = 71;
    const bpupperdiasrange = 89;
    let color;
    this.bpReport?.vitalData?.bloodPressure?.reverse().forEach((ele) => {
      const bpValue = ele.BP.split('/');
      const sysVal = bpValue[0];
      const diaVal = bpValue[1];
      color =
        ele.zone == '1'
          ? 'red'
          : ele.zone == '2'
          ? 'orange'
          : ele.zone == '3'
          ? 'green'
          : '';

      if (ele && Object.keys(ele).length !== 0) {
        this.BPsysrange.push({
          label: CanvasJS.formatDate(new Date(ele['Recorded On']), 'MM/DD'),
          y: [bplowersysrange, bpuppersysrange],
          markerColor: '#FF000000',
        });

        this.BPdiasrange.push({
          label: CanvasJS.formatDate(new Date(ele['Recorded On']), 'MM/DD'),
          y: [bplowerdiasrange, bpupperdiasrange],
          markerColor: '#FF000000',
        });
        this.BPdiasresult.push({
          label: CanvasJS.formatDate(new Date(ele['Recorded On']), 'MM/DD'),
          y: Number(sysVal),
          markerColor: color,
        });
        this.BPsysresult.push({
          label: CanvasJS.formatDate(new Date(ele['Recorded On']), 'MM/DD'),
          y: Number(diaVal),
          markerColor: color,
        });
      }
    });
    if (
      this.BPsysrange.length &&
      this.BPdiasrange.length &&
      this.BPsysresult.length &&
      this.BPdiasresult
    ) {
      this.bpTimeLoad(
        this.BPsysrange,
        this.BPdiasrange,
        this.BPsysresult,
        this.BPdiasresult
      );
    }
  }
  bpTimeLoad(bpsysRange, bpdiasRange, bpsysResult, bpdiasResult) {
    CanvasJS.addColorSet('skyOrange', [
      '#76AEF4',
      '#F9ED63',
      '#000000',
      '#000000',
    ]);
    const chart = new CanvasJS.Chart('bpMgmt', {
      animationEnabled: true,
      exportEnabled: false,
      colorSet: 'skyOrange',
      // title: {
      // text: "Baseline:" + this.systolicBP + '/' + this.diastolicBP
      // },
      axisY: {
        title: 'Blood Pressure',
        suffix: '',
      },
      axisX: {
        title: '',
        // interval: 1,
        valueFormatString: 'DD/MM HH:mm',
        labelAngle: -56,
      },

      data: [
        {
          type: 'rangeArea',
          // markerType: 'none',
          markerSize: 5,
          markerType: 'triangle',
          dataPoints: bpsysRange,
          toolTipContent:
            '<span style="color:#4F81BC"><b>{y[0]} / {y[1]}</b></span>',
        },
        {
          type: 'rangeArea',
          // markerType: 'none',
          markerType: 'triangle',
          markerSize: 5,
          dataPoints: bpdiasRange,
          toolTipContent:
            '<span style="color:#4F81BC"><b>{y[0]} / {y[1]}</b></span>',
        },
        {
          type: 'line',
          markerSize: 5,
          markerType: 'circle',
          dataPoints: bpsysResult,
        },
        {
          type: 'line',
          markerSize: 5,
          markerType: 'circle',
          dataPoints: bpdiasResult,
        },
      ],
    });
    chart.render();
  }
  bpTrendLoad() {
    const bpChart = document.getElementById('bpTrend');
    const myChart = echarts.init(bpChart);
    // const choice;
    //AlertHypo,AlertHype,GoodNormal,HighAlertHyper,HighAlertHypo
    const colorPalette = ['#ffc762', '#FCAB17', '#6FBE46', '#df0f00', '#F44336'];
    const choice = {
      // title: {
      //   text: 'Total Count' + ':' + ' ' + this.totalCountBP,
      //   left: 'center'
      // },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `${params.name}: ${params.data.value} (${Math.ceil(
            params.percent
          )}%)`;
        },
      },
      label: {
        formatter: '{b}: {@2012} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: '-180vh', //The legend can be set to the left, right and center
        top: '220vh',
        //You can set the legend to be on top, bottom, and center
        // margin: [20, 0, 0, 0],   //You can set the legend [distance from the top, distance from the right, distance from the bottom, distance from the left]
      },
      
      series: [
        {
          name: 'BP',
          type: 'pie',
          radius: '50%',
          color: colorPalette,
          data: this.bpTrendDataArr,
          showInLegend: false,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    choice && myChart.setOption(choice);
  }
  bpDataSys(data) {
    const val = data.split('/');
    return val[0];
  }
  bpDataDia(data) {
    const val = data.split('/');
    return val[1];
  }
  getgraphBPImage(symptoms) {
    let img = '';
    for (let i = 0; i < symptoms.length; i++) {
      if (!symptoms[i].symptomUrl.includes('yes')) {
        img +=
          '<img src=' + symptoms[i].symptomUrl + ' height="40" width="40" />';
      }
    }
    return img;
  }
  subtractHours(date, hours, minutes) {
    date.setHours(date.getHours() - hours);
    date.setMinutes(date.getMinutes() - minutes);
    return date;
  }

  getRecorded(value) {
    // 8 AM on June 20, 2022
    const date = new Date(value);
    // const newDate = this.subtractHours(date, 5, 30);
    return date;
    // 6 AM on June 20, 2022
    // let sValue = value.split(' ');
    // let date = sValue[0];
    // let time = new Date(value);
    // let updatedVal = this.dateFormat.transform(
    //   new Date(value),
    //   'yyyy-MM-dd hh:mm'
    // );
    // return updatedVal;
  }
  // getFormattedDate(date) {
  //   let splittedDate = date.split('T');
  //   let splittedTime = splittedDate[1].split(':');
  //   let splittedFormattedDate = splittedDate[0].split('-');
  //   return (
  //     splittedFormattedDate[1] +
  //     '-' +
  //     splittedFormattedDate[2] +
  //     '-' +
  //     splittedFormattedDate[0] +
  //     ',' +
  //     splittedTime[0] +
  //     ':' +
  //     splittedTime[1]
  //   );
  // }
}
