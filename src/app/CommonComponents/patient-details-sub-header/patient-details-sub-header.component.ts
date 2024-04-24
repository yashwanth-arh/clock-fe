import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as echarts from 'echarts';
import { DashbaordStateService } from '../doctor-patients-details/dashbaord-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-details-sub-header',
  templateUrl: './patient-details-sub-header.component.html',
  styleUrls: ['./patient-details-sub-header.component.scss'],
})
export class PatientDetailsSubHeaderComponent implements OnInit {
  BPAdherenceChartData: any;
  onBoard: any;
  fromDate: Date = new Date();
  toDate: Date;
  dpid: string;
  meanfromDate: Date;
  meantoDate: Date;
  showGraph: boolean;
  showData = true;
  userRole: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  @ViewChild('bpTrend') bpTrendId: ElementRef;
  roleid: any;
  myChart: any;
  totalCountBP: number;
  BPTrendData: any = [];
  hideDatepicker = false;
  patientOnBoardingDate: string;
  nonAdherenceCount: any;
  minDate: Date;
  maxDate: Date = new Date();
  currentTab: number;
  observationData: any;
  subHeaderDates: any;
  filterfromDate: string;
  filterToDate: string;
  constructor(
    public service: CaregiverDashboardService,
    public caregiversharedService: CaregiverSharedService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder,
    private auth: AuthService,
    public stateService: DashbaordStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dpid = localStorage.getItem('patientId');
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.toDate = new Date();

    this.caregiversharedService.triggerdDates.subscribe((value) => {
      this.fromDate = new Date();
      this.fromDate.setDate(this.fromDate.getDate() - 30);
      this.toDate = new Date();
      if (
        Object.keys(value).length &&
        (value.hasOwnProperty('from') ||
          (value.hasOwnProperty('to') &&
            (value['from'] !== undefined || value['to'] !== undefined)))
      ) {
        const dynamicFromDate = this.caregiversharedService.formatDate(
          value['from'] ? value['from'] : this.fromDate
        );
        const dynamicToDate = this.caregiversharedService.formatDate(
          value['to'] ? value['to'] : this.toDate
        );
        this.dpid = value['id'];

        // this.getObsById(
        //   value['id'] ? value['id'] : this.dpid,
        //   dynamicFromDate,
        //   dynamicToDate
        // );

        this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
      } else if (Object.keys(value).length && value.hasOwnProperty('id')) {
        this.dpid = value['id'];
        // this.getObsById(
        //   value['id'] ? value['id'] : this.dpid,
        //   this.fromDate,
        //   this.toDate
        // );
      } else {
        // this.getObsById(this.dpid, this.fromDate, this.toDate);
        // this.getAdherenceBP(this.dpid, this.fromDate, this.toDate);
      }
    });
    this.subHeaderDates = this.fb.group({
      fromDate: [this.fromDate],
      toDate: [this.toDate],
    });
    // this.getMedicationAdherenceBP(this.dpid, this.fromDate, this.toDate);
    this.getAdherenceBP(this.dpid, this.fromDate, this.toDate);
  }
  getObsById(pId, fDate, tDate) {
    this.fromDate = new Date(fDate);
    this.toDate = new Date(tDate);

    const pageIndex = JSON.parse(localStorage.getItem('page-index'));
    this.service.getObservationByPId(pId).subscribe(
      (data) => {
        this.observationData = data;
        this.patientOnBoardingDate = localStorage.getItem('patientCreatedOn');
        this.minDate = new Date(this.patientOnBoardingDate);
        this.maxDate = new Date();

        this.caregiversharedService.changeOnBoardPatientDate(
          this.patientOnBoardingDate
        );
        localStorage.setItem(
          'patientOnBoardingDate',
          this.patientOnBoardingDate
        );
        if (new Date(this.patientOnBoardingDate) > this.fromDate) {
          this.fromDate = new Date(this.patientOnBoardingDate);
        }
        // if (this.userRole === 'DOCTOR' && this.currentTab !== 3) {
        //   this.getAdherenceBP(this.dpid, this.fromDate, this.toDate);
        // } else if (this.userRole === 'CAREGIVER' && this.currentTab !== 2) {
        //   this.getAdherenceBP(this.dpid, this.fromDate, this.toDate);
        //   // this.caregiversharedService.changeDates({
        //   //   from: this.fromDate,
        //   //   to: this.toDate,
        //   // });
        // } else {
        //   this.getMedicationAdherenceBP(this.dpid, this.fromDate, this.toDate);
        // }

        localStorage.setItem(
          'observationFromDate',
          JSON.stringify(this.fromDate)
        );
        localStorage.setItem('observationToDate', JSON.stringify(this.toDate));
        this.getAdherenceBP(this.dpid, this.fromDate, this.toDate);
        // if (this.patientOnBoardingDate) {
        //   this.onBoard = this.patientOnBoardingDate.split('T');
        // }
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.snackbarService.error(err.error.message);
        }
      }
    );
  }
  getMedicationAdherenceBP(pId, fDate, tDate) {
    // const finalFromDate = fDate;
    // const finalToDate = tDate;
    // const body = {
    //   dateFrom: finalFromDate,
    //   dateTo: finalToDate,
    // };
    // this.service.medicationadherenceBPBydate(pId, body).subscribe(
    //   (data) => {
    //     this.BPAdherenceChartData = data;
    //     localStorage.setItem('medicationAdherenceData', JSON.stringify(data));
    //     this.caregiversharedService.changeBPAdherence(
    //       localStorage.getItem('medicationAdherenceData')
    //     );
    //     this.dataProcessing(data);
    //   },
    //   (err) => {
    //     // this.snackBarService.error(err.message);
    //   }
    // );
    // // }
  }
  getAdherenceBP(pId, fDate, tDate) {
    const startDate = new Date(fDate);
    const endDate = new Date(tDate);

    // Format the start date to "YYYY-MM-DDT00:00:00"
    const formattedStartDate =
      startDate.toISOString().split('T')[0] + 'T00:00:00';

    // Format the end date to "YYYY-MM-DDT23:59:59"
    const formattedEndDate = endDate.toISOString().split('T')[0] + 'T23:59:59';

    const body = {
      dateFrom: formattedStartDate,
      dateTo: formattedEndDate,
    };
    // if (
    //   finalFromDate &&
    //   finalToDate &&
    //   finalFromDate.toString().includes('T') &&
    //   finalToDate.toString().includes('T')
    // ) {
    //   const dateFrom = finalFromDate.toISOString().split('T');
    //   const dateTo = finalToDate.toISOString().split('T');
    //   body = {
    //     dateFrom: dateFrom[0] + 'T' + '00:00:00',
    //     dateTo: dateTo[0] + 'T' + '23:59:59',
    //   };
    // } else {
    //   body = {
    //     dateFrom: finalFromDate,
    //     dateTo: finalToDate,
    //   };
    this.service.adherenceBPBydate(body, pId).subscribe(
      (data) => {
        this.BPAdherenceChartData = data?.adhereNonadherecount;
        this.dataProcessing(data?.adhereNonadherecount);
      },
      (err) => {
        this.dataProcessing(err);
        // this.snackbarService.error(err.message);
      }
    );
  }
  startChange(evt) {
    this.meanfromDate = evt.value;
  }
  endChange(evt) {
    this.meantoDate = evt.value;

    const dynamicFromDate = this.caregiversharedService.formatDate(
      this.meanfromDate ? this.meanfromDate : this.chartFromDate
    );
    const dynamicFromTime = new Date(
      this.meanfromDate ? this.meanfromDate : this.chartFromDate
    ).toTimeString();
    const dynamicToDate = this.caregiversharedService.formatDate(
      this.meantoDate ? this.meantoDate : this.chartToDate
    );
    const dynamicToTime = new Date(
      this.meantoDate ? this.meantoDate : this.chartToDate
    ).toTimeString();
    this.filterfromDate =
      dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8);
    this.filterToDate = dynamicToDate + 'T' + dynamicToTime.substring(0, 8);

    const body = {
      dateFrom: this.caregiversharedService.formatDate(this.meanfromDate),
      dateTo: this.caregiversharedService.formatDate(this.meantoDate),
    };

    if (this.meanfromDate && this.meantoDate) {
      this.fromDate = this.meanfromDate;
      this.toDate = this.meantoDate;
      // alert(this.meanfromDate,this.meantoDate)
      const formattedStartDate =
        this.filterfromDate.split('T')[0] + 'T00:00:00';

      // Format the end date to "YYYY-MM-DDT23:59:59"
      const formattedEndDate = this.filterToDate.split('T')[0] + 'T23:59:59';
      const dateBody = {
        dateFrom: formattedStartDate,
        dateTo: formattedEndDate,
      };
      this.service.adherenceBPBydate(dateBody, this.dpid).subscribe(
        (data) => {
          this.BPAdherenceChartData = data?.adhereNonadherecount;
          this.dataProcessing(data?.adhereNonadherecount);
        },
        (err) => {
          this.dataProcessing(err);
          // this.snackbarService.error(err.message);
        }
      );
      // this.getAdherenceBP(this.dpid, this.filterfromDate, this.filterToDate);
      this.caregiversharedService.changeDates({
        from: this.filterfromDate,
        to: this.filterToDate,
        id: this.dpid,
      });
    } else if (!this.meanfromDate && this.meantoDate) {
      this.meanfromDate = this.meantoDate;
      this.filterfromDate = this.filterToDate;
      this.getAdherenceBP(this.dpid, this.filterfromDate, this.filterToDate);
      this.caregiversharedService.changeDates({
        from: this.filterfromDate,
        to: this.filterToDate,
        id: this.dpid,
      });
    }
  }
  dataProcessing(data) {
    const bpData = [];
    this.totalCountBP = 0;
    this.totalCountBP = Number(data.adharence) + Number(data.nonAdharence);
    bpData.push(
      {
        name: 'Adherence',
        value: data.adharence,
      },
      {
        name: 'Non Adherence',
        value: data.nonAdharence,
      }
    );

    this.showData = false;
    setTimeout(() => {
      // if (this.showGraph) {
      this.BPTrendData = [...bpData].reverse();
      this.bpTrendLoad();
      // }
    }, 1000);
  }
  bpTrendLoad() {
    // var bpChart = document?.getElementById('bpTrend');
    const divEl: HTMLDivElement = this.bpTrendId?.nativeElement;

    this.myChart = echarts?.init(divEl);
    let choice;
    const colorPalette = ['#F44336', '#6FBE46'];
    choice = {
      // tooltip: {
      //   trigger: 'item',
      //   formatter: function (params) {
      //     return `${params.name}: ${params.data.value} (${params.percent}%)`;
      //   },
      //   textAlign:'right'
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}<br /> ({d}%)',
        position: 'right',
      },
      legend: {
        orient: 'vertical',
        x: '20vw', //The legend can be set to the left, right and center
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
          data: this.BPTrendData,
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
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

    choice && this.myChart.setOption(choice);
  }
}
