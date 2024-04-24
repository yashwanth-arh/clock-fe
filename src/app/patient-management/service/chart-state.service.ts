import { Injectable } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataTableViz } from 'src/app/services/data-viz.service';

export interface ChartOuptutDef {
  bp?: [string[], ChartDataSets[], string] | [];
  glucose?: [string[], ChartDataSets[], string] | [];
  weight?: [string[], ChartDataSets[], string] | [];
  temperature?: [string[], ChartDataSets[], string] | [];
  spo2?: [string[], ChartDataSets[], string] | [];
}
export interface TableOutputDef {
  bp?: DataTableViz;
  glucose?: DataTableViz;
  weight?: DataTableViz;
  temperature?: DataTableViz;
  spo2?: DataTableViz;
}

@Injectable({
  providedIn: 'root'
})
export class ChartStateService {
  public chartData: BehaviorSubject<ChartOuptutDef | []>;
  public tableData: BehaviorSubject<TableOutputDef | []>;
  constructor() {
    this.chartData = new BehaviorSubject([]);
    this.tableData = new BehaviorSubject([]);
  }

  get chartDataObs(): Observable<ChartOuptutDef | []> {
    return this.chartData.asObservable();
  }
  get tableDataObs(): Observable<TableOutputDef | []> {
    return this.tableData.asObservable();
  }

  setChartDataObs(data: any): void {
    this.chartData.next(data);
  }

  setTableDataObs(data: any): void {
    this.tableData.next(data);
  }


}
