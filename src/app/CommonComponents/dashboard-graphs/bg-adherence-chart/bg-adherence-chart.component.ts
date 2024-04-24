import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { Component, Input, OnDestroy, OnInit,AfterViewInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Subscription } from 'rxjs';
declare const CanvasJS: any;

@Component({
  selector: 'app-bg-adherence-chart',
  templateUrl: './bg-adherence-chart.component.html',
  styleUrls: ['./bg-adherence-chart.component.scss'],
})
export class BGAdherenceChartComponent implements OnInit , OnDestroy,AfterViewInit {
  @Input() patientId: string;
  maxDate: Date = new Date();
  filterfromDate: string;
  filterToDate: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  roleid: any;
  userRole: string;
  adherenceWtCount: any = [];
  BGAdherenceChartData: any;
  showGraph: boolean;
  showData = true;
  triggerDateSubscription: Subscription;
  constructor(
    private caregiverservice: CaregiverDashboardService,
    private auth: AuthService,
    private _decimalPipe: DecimalPipe,
    private caregiverSharedService: CaregiverSharedService,
    private snackbarService: SnackbarService
  ) {
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 33);
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
  }
  ngOnInit() {
    this.caregiverSharedService.triggerdBGAdherence.subscribe((value) => {
      if (value) {this.BGAdherenceChartData = JSON.parse(value);}
    });
  }
  ngAfterViewInit(): void {
    this.triggerDateSubscription = this.caregiverSharedService.triggerdDates.subscribe((value) => {
      if (
        Object.keys(value).length &&
        (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
      ) {
        this.BGAdherenceChartData = {};
        const dynamicFromDate = this.caregiverSharedService.formatDate(
          value['from']
        );
        const dynamicFromTime = new Date(value['from']).toTimeString();
        const dynamicToDate = this.caregiverSharedService.formatDate(value['to']);
        const dynamicToTime = new Date(value['to']).toTimeString();
        (this.filterfromDate =
          dynamicFromDate + 'T' + dynamicFromTime.substring(0, 8)),
          (this.filterToDate =
            dynamicToDate + 'T' + dynamicToTime.substring(0, 8));
            // 
        this.getAdherenceWeight(
          this.patientId,
          this.filterfromDate,
          this.filterToDate
        );
      } else {
        // 

        this.getAdherenceWeight(
          this.patientId,
          this.chartFromDate,
          this.chartToDate
        );
        // }
      }
    });
    this.caregiverSharedService.triggerdgraphs.subscribe((value) => {
      if (Object.keys(value).length !== 0) {
        // 

        this.getAdherenceWeight(
          this.patientId,
          this.chartFromDate,
          this.chartToDate
        );
      }
    });
  }

  getAdherenceWeight(pId, fDate, tDate) {
    this.BGAdherenceChartData = [];
    const finalFromDate = fDate;
    const finalToDate = tDate;
    const body = {
      dateFrom: finalFromDate,
      dateTo: finalToDate,
    };
    if (
      this.BGAdherenceChartData &&
      Object.keys(this.BGAdherenceChartData).length
    ) {
      this.dataProcessing(this.BGAdherenceChartData);
    } else {
      this.caregiverservice.adherenceWtBydate(body, pId).subscribe(
        (data) => {
          localStorage.setItem('BGAdherenceData', JSON.stringify(data));
          // 
          this.dataProcessing(data);
          // this.caregiverSharedService.changeBGAdherence(localStorage.getItem('BGAdherenceData'));
        },
        (err) => {
          // this.snackbarService.error(err.message);
        }
      );
    }
  }
  dataProcessing(data) {
    if (!data.length) {
      this.showData = false;
    }
    this.adherenceWtCount = [];

    const adherence = data['adharence'];
    const nonadherence = data['nonAdharence'];
    const totalCount = Number(adherence) + Number(nonadherence);

    const adherenceCount = this._decimalPipe.transform(
      (Number(adherence) / totalCount) * 100,
      '1.2-2'
    );
    const nonadherenceCount = this._decimalPipe.transform(
      (Number(nonadherence) / totalCount) * 100,
      '1.2-2'
    );
    this.adherenceWtCount.push(
      { y: Number(adherenceCount), label: 'Adherence', color: 'green' },
      {
        y: Number(nonadherenceCount),
        label: 'Non Adherence',
        color: 'grey',
      }
    );

    this.showGraph =
      Number(nonadherenceCount) > 0 || Number(adherenceCount) > 0
        ? true
        : false;
    this.showData = false;
    if (this.showGraph) {
      setTimeout(() => {
        this.loadAdherenceBG();
      }, 2000);
    }
  }
  loadAdherenceBG() {
    const chart = new CanvasJS.Chart('adherenceBG', {
      animationEnabled: true,
      exportEnabled: false,
      axisY: {
        valueFormatString: "0'%'",
        includeZero: true,
        interval: 20,
        maximum: 100,
      },
      data: [
        {
          toolTipContent: '{y}%',
          type: 'column',
          dataPoints: this.adherenceWtCount,
        },
      ],
    });
    chart.render();
  }

  ngOnDestroy(): void {
      this.triggerDateSubscription.unsubscribe();
  }

}
