import { Injectable } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BPData, OxygenData, ReportData, WeightData } from '../patient-management/entities/reports';
import {
  bmiData,
  boData,
  boneData,
  FatData,
  HeartRate,
  HighPressure,
  hrData,
  LowPressure,
  muscleData,
  waterData,
  weightData
} from '../shared/entities/report.category';

import { forEach, groupBy } from 'lodash';
import { DatePipe } from '@angular/common';

export interface DataTableViz {
  row: any[];
  def: any[];
  rules?: any;
}

@Injectable({
  providedIn: 'root'
})

export class DataVizService {

  constructor(
    public datePipe: DatePipe
  ) { }

  public parseChartData(data: any[], category: string): any[] {
    let output = [];
    switch (category.toUpperCase()) {
      case 'BP':
        output = this.parseChartDataBp(data);
        break;
      case 'OXYMETER':
        output = this.parseChartDataOxymeter(data);
        break;
      case 'WEIGHT':
        output = this.parseChartDataWeight(data);
        break;

      default:
        output = [];
        break;
    }

    return output;

  }

  public parseTableData(data: any[], category: string): DataTableViz {
    let output: DataTableViz;
    switch (category.toUpperCase()) {
      case 'BP':
        output = this.parseTableDataBP(data);
        break;
      case 'OXYMETER':
        output = this.parseTableDataOxymeter(data);
        break;
      case 'WEIGHT':
        output = this.parseTableDataWeight(data);
        break;

      default:
        output = undefined;
        break;
    }

    return output;

  }


  private parseChartDataBp(data: any[]): [any, ChartDataSets[], string] {
    /**
     * blood pressure params
     */
    const chartData: ChartDataSets[] = [];
    const labels = [];
    const HP = [];
    const LP = [];
    const HR = [];
    const HPressure = HighPressure;
    const LPressure = LowPressure;
    const heartRate = HeartRate;
    /**
     * consturcting the chart data source format
     */
    data.forEach((report: BPData) => {
      labels.push(this.datePipe.transform(report.measurementDate, 'short'));
      HP.push(report.hp);
      LP.push(report.lp);
      HR.push(report.hr);
    });
    HPressure.data = HP;
    LPressure.data = LP;
    heartRate.data = HR;
    chartData.push(HPressure, LPressure, heartRate);
    return [labels, chartData, 'line'];
  }

  private parseChartDataOxymeter(data: any[]): [any, ChartDataSets[], string] {
    /**
     * Oxymeter params
     */
    const chartData: ChartDataSets[] = [];
    const labels = [];
    const BO = [];
    const HR = [];
    const bodyOxygen = boData;
    const heartRate = hrData;

    /**
     * Constructing the chart data source format
     */
    data.forEach((report: OxygenData) => {
      labels.push(this.datePipe.transform(report.measurementDate, 'short'));
      BO.push(report.bo);
      HR.push(report.hr);
    });

    bodyOxygen.data = BO;
    heartRate.data = HR;
    chartData.push(boData, hrData);
    return [labels, chartData, 'line'];
  }

  private parseChartDataWeight(data: any[]): [any, ChartDataSets[], string] {
    /**
     * weight params
     */
    const chartData: ChartDataSets[] = [];
    const labels = [];
    const weight = [];
    const bone = [];
    const muscle = [];
    const bmi = [];
    const fat = [];
    const water = [];
    const bmiSeries = bmiData;
    const boneSeries = boneData;
    const muscleSeries = muscleData;
    const weightSeries = weightData;
    const fatSeries = FatData;
    const waterSeries = waterData;

    data.forEach((report: WeightData) => {
      labels.push(this.datePipe.transform(report.measurementDate, 'short'));
      weight.push(Math.round(report.weightValue));
      bone.push(Math.round(report.boneValue));
      muscle.push(Math.round(report.muscleValue));
      bmi.push(Math.round(report.bmi));
      fat.push(Math.round(report.fatValue));
      water.push(Math.round(report.waterValue));
    });

    bmiSeries.data = bmi;
    boneSeries.data = bone;
    muscleSeries.data = muscle;
    weightSeries.data = weight;
    fatSeries.data = fat;
    waterSeries.data = water;

    chartData.push(weightData, muscleData, boneData, bmiData, waterData, FatData);
    return [labels, chartData, 'line'];
  }


  private parseTableDataBP(data: any[]): DataTableViz {

    const columnDef = [
      {
        headerName: 'Systolic BP',
        field: 'hp',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Diastolic BP',
        field: 'lp',
        sortable: true,
        filter: true,
        resizable: true
      }, {
        headerName: 'Heart Rate',
        field: 'hr',
        sortable: true,
        filter: true,
        resizable: true
      }, {
        headerName: 'Recored on',
        field: 'measurementDate',
      }
    ];
    const rowClassRules = {
      'bp-normal': (params) => {
        const systolic = params.data.HP;
        const diastolic = params.data.LP;
        return systolic < 120 && diastolic < 90;
      },
      'bp-elevated': (params) => {
        const systolic = params.data.HP;
        const diastolic = params.data.LP;
        return (systolic > 120 && systolic <= 129) && diastolic < 80;
      },
      'bp-hypertension-1': (params) => {
        const systolic = params.data.HP;
        const diastolic = params.data.LP;
        return (systolic > 130 && systolic <= 139) && diastolic >= 90;
      },
      'bp-hypertension-2': (params) => {
        const systolic = params.data.HP;
        const diastolic = params.data.LP;
        return (systolic >= 140) && diastolic >= 90;
      },
      'bp-crisis': (params) => {
        const systolic = params.data.HP;
        const diastolic = params.data.LP;
        return ((systolic >= 180) && diastolic >= 120) || ((systolic >= 180) || diastolic >= 120);
      }
    };
    return {
      row: data,
      def: columnDef,
      rules: rowClassRules
    };

  }

  private parseTableDataOxymeter(data: any[]): DataTableViz {
    const columnDef = [
      {
        headerName: 'Oxygen',
        field: 'bo',
        valueFormatter: params => params.data.bo.toFixed(2),
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Heart Rate',
        field: 'hr',
        valueFormatter: params => params.data.hr.toFixed(2),
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Recored on',
        field: 'measurementDate',
      }
    ];
    return {
      row: data,
      def: columnDef
    };
  }

  private parseTableDataWeight(data: any[]): DataTableViz {
    const columnDef = [
      {
        headerName: 'Weight',
        field: 'weightValue',
        valueFormatter: params => params.data.weightValue.toFixed(2),
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Body Mass Index',
        field: 'bmi',
        valueFormatter: params => params.data.bmi.toFixed(2),
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Bone',
        field: 'boneValue',
        valueFormatter: params => params.data.boneValue.toFixed(2),
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Muscale',
        field: 'muscleValue',
        valueFormatter: params => params.data.muscleValue.toFixed(2),
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Fat',
        field: 'fatValue',
        valueFormatter: params => params.data.fatValue.toFixed(2),
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Recored on',
        field: 'measurementDate',
      }
    ];
    return {
      row: data,
      def: columnDef
    };
  }

  public pieChartForClaims(data: any[]): [any, any[], string, boolean] {

    const labels = [];
    const chartData: any[] = [];
    const dataSetValues = {
      data: [],
      backgroundColor: [
        'rgb(14, 12, 49)',
        'rgb(255, 193, 7)',
        'rgb(5, 151, 255)',
        'rgb(255, 26, 5)',

      ],
      hoverOffset: 4
    };
    if (data.length) {
      const groupedData = groupBy(data, 'claimStatus');

      forEach(groupedData, (value, key) => {
        labels.push(key);
        dataSetValues.data.push(value.length);
      });
      chartData.push(dataSetValues);
    }
    return [labels, chartData, 'pie', false];
  }
}
