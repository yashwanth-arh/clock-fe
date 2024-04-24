import { AuthService } from 'src/app/core/services/auth.service';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { Component, Input, OnInit,AfterViewInit,OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Subscription } from 'rxjs';
declare const CanvasJS: any;
@Component({
  selector: 'app-bp-adherence-chart',
  templateUrl: './bp-adherence-chart.component.html',
  styleUrls: ['./bp-adherence-chart.component.scss'],
})
export class BpAdherenceChartComponent implements AfterViewInit,OnDestroy {
  @Input() patientId: string;
  maxDate: Date = new Date();
  filterfromDate: string;
  filterToDate: string;
  chartToDate: Date = new Date();
  chartFromDate: Date = new Date();
  roleid: any;
  userRole: string;
  adherenceBPCount: any = [];
  BPAdherenceChartData: any;
  showGraph: boolean;
  showData = true;
  triggerDateSubscription: Subscription;

  constructor(
    private caregiverservice: CaregiverDashboardService,
    private caregiverSharedService: CaregiverSharedService,
    private snackBarService: SnackbarService,
    private auth: AuthService,
    private _decimalPipe: DecimalPipe
  ) {
    this.chartFromDate.setDate(this.chartFromDate.getDate() - 30);
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
  }
  // ngOnInit() {
  //   // this.caregiverSharedService.triggerdBGAdherence.subscribe((value) => {
  //   //   if (value) {this.BPAdherenceChartData = JSON.parse(value);}
  //   // });
  // }
  ngAfterViewInit(): void {
    this.triggerDateSubscription =
      this.caregiverSharedService.triggerdDates.subscribe((value) => {

        if (
          Object.keys(value).length &&
          (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
        ) {
          this.BPAdherenceChartData = {};
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
          this.getAdherenceBP(
            this.patientId,
            this.filterfromDate,
            this.filterToDate
          );
        } else {
          setTimeout(() => {
            const obsFrom = JSON.parse(
              localStorage.getItem('observationFromDate')
            );
            const obsTo = JSON.parse(localStorage.getItem('observationToDate'));

            if (obsFrom && obsTo) {
              this.getAdherenceBP(this.patientId, obsFrom, obsTo);
            } else {
              this.getAdherenceBP(
                this.patientId,
                this.chartFromDate,
                this.chartToDate
              );
            }
          }, 1000);
        }
      });
    this.caregiverSharedService.triggerdgraphs.subscribe((value) => {
      if (Object.keys(value).length !== 0) {
        this.getAdherenceBP(
          this.patientId,
          this.chartFromDate,
          this.chartToDate
        );
      }
    });
  }

  getAdherenceBP(pId, fDate, tDate) {
    const finalFromDate = fDate.split('T');
    const finalToDate = tDate.split('T');
    const body = {
      dateFrom: finalFromDate[0] + 'T' + '00:00:00',
      dateTo: finalToDate[0] + 'T' + '23:59:59',
    };
    if (
      this.BPAdherenceChartData &&
      Object.keys(this.BPAdherenceChartData).length
    ) {
      this.dataProcessing(this.BPAdherenceChartData);
    } else {
      // this.caregiverservice.adherenceBPBydate(body, pId).subscribe(
      //   (data) => {
      //     this.dataProcessing(data);
      //   },
      //   (err) => {
      //     // this.snackBarService.error(err.message);
      //   }
      // );
    }
  }
  dataProcessing(data) {
    if (!data.length) {
      this.showData = false;
    }
    this.adherenceBPCount = [];
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
    this.adherenceBPCount.push(
      { y: Number(adherenceCount), label: 'Adherence', color: 'green' },
      { y: Number(nonadherenceCount), label: 'Non Adherence', color: 'grey' }
    );
    this.showGraph =
      Number(nonadherenceCount) || Number(adherenceCount) > 0 ? true : false;
    this.showData = false;
    if (this.showGraph) {
      setTimeout(() => {
        this.loadAdherenceBP();
      }, 1000);
    }
  }
  loadAdherenceBP() {
    const chart = new CanvasJS.Chart('adherenceBP', {
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
          dataPoints: this.adherenceBPCount,
        },
      ],
    });
    chart?.render();
  }
  ngOnDestroy(): void {
    this.triggerDateSubscription.unsubscribe();
  }
}
