import { AuthService } from 'src/app/core/services/auth.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardSharedService } from 'src/app/dashboard/dashboard.shared.service';

declare const CanvasJS: any;

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit, AfterViewInit {
  @Input() chartData: any;
  @Input() selectedFilter: any;
  chartValues: any = [];
  userRole: string;
  chartType: string;
  selectedTab: string;
  showNoRecords: boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private dashboardSharedService: DashboardSharedService
  ) {
    const user = this.auth.authData;
    this.userRole = user?.userDetails?.userRole;
    this.chartType = 'bar';
  }

  ngOnInit(): void {
 
  }
  ngAfterViewInit() {
    this.dashboardSharedService.filterDataTriggered.subscribe((res) => {
      // console.log(res);
      
      if (res) {
        this.selectedFilter = res;
        this.getModifiedGraphData(this.selectedFilter);
      } else {
        if (this.selectedFilter === 'Monthly') {
          this.getModifiedGraphData(this.selectedFilter);
        }
      }
    });
    this.dashboardSharedService.tabDataTriggered.subscribe((res) => {
      if (res) {
        this.chartData = res;

        const allEqual = this.chartData.monthly.every((x) => x.count === 0);
        if (allEqual) {
          this.showNoRecords = true;
        } else {
          this.showNoRecords = false;
        }
        this.selectedTab = this.chartData.selectedTab;
        this.getModifiedGraphData(this.selectedFilter);
      }
    });
    if (this.chartData) {
      CanvasJS.addColorSet('greenShades', [
        //colorSet Array
        '#53c7ff',
      ]);
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        colorSet: 'greenShades',
        // theme: 'light2', // "light1", "light2", "dark1", "dark2"
        title: {
          text: '',
          fontFamily: 'Helvetica Neue',
        },
        dataPointWidth: 20,
        axisY: {
          title: this.selectedTab,
          interval: 20,
        },
        data: [
          {
            type: 'column',
            showInLegend: false,
            // legendMarkerColor: 'grey',
            // legendText: 'Types',
            toolTip: {
              enabled: true, //disable here
              animationEnabled: true, //disable here
            },
            dataPoints: this.chartValues,
          },
        ],
      });
      // console.log("Before rendering chart:", chart);
      chart?.render();
      // console.log("After rendering chart:", chart);
    }
  }
  allEqual() {

    return this.chartData.every((v, i) => v.count === this.chartData[i].count);
  }
  getModifiedGraphData(selectedFilter) {
    if (selectedFilter === 'Monthly') {
      if (this.chartData && Object?.keys(this.chartData)) {
        this.chartValues = this.chartData.monthly.map((ele) => {
          (ele.label =
            ele.month === 1
              ? 'Jan'
              : ele.month === 2
              ? 'Feb'
              : ele.month === 3
              ? 'Mar'
              : ele.month === 4
              ? 'Apr'
              : ele.month === 5
              ? 'May'
              : ele.month === 6
              ? 'June'
              : ele.month === 7
              ? 'July'
              : ele.month === 8
              ? 'Aug'
              : ele.month === 9
              ? 'Sep'
              : ele.month === 10
              ? 'Oct'
              : ele.month === 11
              ? 'Nov'
              : ele.month === 12
              ? 'Dec'
              : ''),
            (ele.y = ele.count);
          return ele;
        });
      }
    } else if (selectedFilter === 'Quarterly') {
      if (Object.keys(this.chartData)) {
        this.chartValues = this.chartData?.quarterly.map((ele) => {
          (ele.label =
            ele.quarter === 1
              ? 'Jan-Mar'
              : ele.quarter === 2
              ? 'Apr-June'
              : ele.quarter === 3
              ? 'Jul-Sep'
              : ele.quarter === 4
              ? 'Oct-Dec'
              : ''),
            (ele.y = ele.count);
          return ele;
        });
      }
    } else if (selectedFilter === 'Yearly') {
      if (Object.keys(this.chartData)) {
        this.chartValues = this.chartData?.yearly.map((ele) => {

          (ele.label = ele.year), (ele.y = ele.count);
          return ele;
        });
      }
    }

    // this.checkArray(this.chartValues);
    // if (this.checkArray(this.chartValues)) {
    //   this.showNoRecords = true;
    //   return;
    // } else {
    //   this.showNoRecords = false;
    // }
    this?.loadChart();
  }
  loadChart() {
    if (this.chartData) {
      CanvasJS.addColorSet('greenShades', [
        //colorSet Array
        '#53c7ff',
      ]);
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        colorSet: 'greenShades',

        theme: 'light2', // "light1", "light2", "dark1", "dark2"
        title: {
          text: '',
          fontFamily: 'Helvetica Neue',
        },
        dataPointWidth: 20,
        axisY: {
          title: this.selectedTab,
          interval: 20,
        },
        data: [
          {
            type: 'column',
            showInLegend: false,
            // legendMarkerColor: 'grey',
            // legendText: 'Types',
            toolTip: {
              enabled: true, //disable here
              animationEnabled: true, //disable here
            },
            dataPoints: this.chartValues,
          },
        ],
      });
      // console.log("Before rendering chart:", chart);
      chart.render();
      // console.log("After rendering chart:", chart);
    }
  }

  areEquals(a, b) {
    if (a.count === b.count) {
      return true;
    } else {
      return false;
    }
  }
  checkArray(arr) {
    for (var i = 1; i < arr.length; i++) {
      if (!this.areEquals(arr[0], arr[i])) return false;
    }
    return true;
  }
}
