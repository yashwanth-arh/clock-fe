import { MatTableDataSource } from '@angular/material/table';
import { ColumnConfig } from 'material-dynamic-table';

export interface ReportData {
  'BPDataList'?: BPData[];
  'BPUnit'?: number;
  'BGDataList'?: [];
  'BGUnit'?: number;
  'FoodDataList'?: [];
  'FoodUnit'?: number;
  'HeartRateDataList'?: [];
  'WeightDataList'?: WeightData[];
  'WeightUnit'?: number;
  'BODataList': OxygenData[];
  'SRDataList': [];
  'ARDataList': [];
  'DistanceUnit': number;
  'CurrentRecordCount'?: number;
  'NextPageUrl'?: string;
  'PageLength'?: number;
  'PageNumber'?: number;
  'PrevPageUrl'?: string;
  'RecordCount'?: number;
  'Error'?: string;
  'ErrorCode'?: string;
  'ErrorDescription'?: string;
}

export interface BPData {
  'bpl': number;
  'dataId'?: string;
  'dataSource'?: string;
  'hp': number;
  'hr': number;
  'isArr'?: number;
  'lp': number;
  'lastChangedTime'?: number | null;
  'lat'?: string;
  'lon'?: string;
  'MDate'?: number;
  'note'?: string;
  'timeZone'?: string;
  'measurementTime'?: string;
  'time_zone'?: string;
  'iHealthUserId'?: string | null;
  'measurementDate'?: string;
  'rpmPatientId'?: string;
}

export interface WeightData {
  'bmi': number;
  'boneValue': number;
  'dci': number;
  'dataId': string;
  'dataSource': string;
  'fatValue': number;
  'lastChangedTime': number;
  'MDate': number;
  'muscleValue': number;
  'note': string;
  'timeZone': string;
  'vfr': number;
  'waterValue': number;
  'weightValue': number;
  'measurementTime': string;
  'measurementDate': string;
  'time_zone': string;
  'iHealthUserId': string | null;
  'lat'?: string;
  'lon'?: string;
  'rpmPatientId'?: string;
}

export interface OxygenData {
  'bo': number;
  'dataId': string;
  'dataSource': string;
  'hr': number;
  'iHealthUserId'?: string | null;
  'lastChangedTime': number;
  'lat': number;
  'lon': number;
  'MDate': number;
  'note': string;
  'timeZone': string;
  'measurementTime'?: number;
  'measurementDate'?: string;
  'time_zone': string;
  'rpmPatientId': string;
}

export interface ClaimsRaisedReports {
  'dateOfService': Date;
  'cptCode': {
    'id': string;
    'name': string;
    'description': string;
    'code': string;
    'amount': number;
  };
  'pricingAmount': number;
}

export interface TableOutput {
  bp: {
    data: MatTableDataSource<BPData>;
    column: ColumnConfig;
  };
  glucose: {
    data: MatTableDataSource<any>;
    column: ColumnConfig;
  };
  weight: {
    data: MatTableDataSource<WeightData>;
    column: ColumnConfig;
  };
  temperature: {
    data: MatTableDataSource<any>;
    column: ColumnConfig;
  };
  spo2: {
    data: MatTableDataSource<OxygenData>;
    column: ColumnConfig;
  };
}

export interface ClaimTimes {
  'possibleCliamTimes': string[];
  'remainingRpmTime': number;
  'currentRpmTime': number;
}

export interface PatientDeviceCategory {
  'deviceCategory': string[];
}

export interface PatientReport {
  'blob': string;
  'fileName': string;
  'type': string;
}