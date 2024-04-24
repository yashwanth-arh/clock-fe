import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
export interface BPDataList {
  BPL: string;
  DataID: string;
  HP: string;
  HR: string;
  LP: string;
  measurement_time: string;
  time_zone: string;
}
export interface WeightDataList {
  BMI: string;
  WeightValue: string;
  measurement_time: string;
  time_zone: string;
}

export interface BODataList {
  BO: string;
  HR: string;
  measurement_time: string;
  time_zone: string;
}

const BP_DATA: BPDataList[] = [];
const WEIGHT_DATA: WeightDataList[] = [];
@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html',
  styleUrls: ['./patient-data.component.scss'],
})
export class PatientDataComponent implements OnInit, AfterViewInit {
  bpHeaders: string[] = [
    'BPL',
    'HP',
    'HR',
    'LP',
    'measurement_time',
    'time_zone',
  ];

  weightHeaders: string[] = [
    'BMI',
    'WeightValue',
    'measurement_time',
    'time_zone',
  ];

  boHeaders: string[] = [
    'BO',
    'HR',
    'measurement_time',
    'time_zone',
  ];
  bp: string[] = [];
  weight: string[] = [];

  bpDataSource = new MatTableDataSource();
  weightDataSource = new MatTableDataSource();
  boDataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private dataService: ApiService,
    private _router: Router,
  ) {
    // Assign the data to the data source for the table to render
    this.bpDataSource = new MatTableDataSource(BP_DATA);
    this.weightDataSource = new MatTableDataSource(WEIGHT_DATA);
  }
  ngAfterViewInit() {
    this.bpDataSource.paginator = this.paginator;
    this.bpDataSource.sort = this.sort;

    this.weightDataSource.paginator = this.paginator;
    this.weightDataSource.sort = this.sort;


    this.boDataSource.paginator = this.paginator;
    this.boDataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataService.getPatientBPData().subscribe((data: any[]) => {
      this.bp = data;
      const BP_DATA: BPDataList[] = data['BPDataList'];
      this.bpDataSource = new MatTableDataSource(BP_DATA);
    });

    this.dataService.getPatientBOData().subscribe((data: any[]) => {
      const BO_DATA: BODataList[] = data['BODataList'];
      this.boDataSource = new MatTableDataSource(BO_DATA);
    });

    this.dataService.getPatientWeightData().subscribe((data: any[]) => {
      this.weight = data;
      const WEIGHT_DATA: WeightDataList[] = data['WeightDataList'];
      this.weightDataSource = new MatTableDataSource(WEIGHT_DATA);

    });
  }

  viewPatient(): void {
    this._router.navigate(['/patient']);
  }
}
