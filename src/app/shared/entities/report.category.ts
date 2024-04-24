import { ReportCategory } from 'src/app/patient-management/entities/category';

export const reportTabs: ReportCategory[] = [{
  value: 'bp',
  title: 'Blood pressure',
  icon: 'bp',
  category: 'bp',
}, {
  value: 'glucose',
  title: 'Blood glucose',
  icon: 'glucose',
  category: 'glucose'
}, {
  value: 'weight',
  title: 'Body weight',
  icon: 'weight',
  category: 'weight'
},
{
  value: 'spo2',
  title: 'Pulse oxymeter',
  icon: 'pulse oxymeter',
  category: 'oxymeter'
}, {
  value: 'temperature',
  title: 'Temperature',
  icon: 'temperature',
  category: 'temperature'
}];


export const HighPressure: ChartData = {
  label: 'Systolic',
  backgroundColor: '#39B75A',
  borderColor: '#39B75A',
  pointBackgroundColor: '#39B75A',
  hoverBackgroundColor: '#39B75A',
  fill: false
};
export const LowPressure: ChartData = {
  label: 'Diastolic',
  backgroundColor: '#4285F4',
  hoverBackgroundColor: '#4285F4',
  pointBackgroundColor: '#4285F4',
  borderColor: '#4285F4',
  fill: false
};

export const boData: ChartData = {
  data: [],
  backgroundColor: '#5f0f40',
  hoverBackgroundColor: '#5f0f40',
  pointBackgroundColor: '#5f0f40',
  borderColor: '#5f0f40',
  fill: false,
  label: 'Body Oxygen',
  type: 'line',
};
export const hrData: ChartData = {
  data: [],
  backgroundColor: '#9a031e',
  hoverBackgroundColor: '#9a031e',
  pointBackgroundColor: '#9a031e',
  borderColor: '#9a031e',
  fill: false,
  label: 'Heart Rate',
  type: 'line',
};

export const HeartRate: ChartData = {
  label: 'Heart Rate',
  backgroundColor: '#E94235',
  hoverBackgroundColor: '#E94235',
  pointBackgroundColor: '#E94235',
  borderColor: '#E94235',
  fill: false
};

export interface ChartData {
  data?: any[];
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  fill?: boolean;
  label?: string;
  borderColor?: string;
  pointBackgroundColor?: string;
  hidden?: boolean;
  type?: string;
  steppedLine?: boolean;
}

export interface ReportChartDataOutput {
  bp: any[];
  glucose: any[];
  weight: any[];
  temperature: any[];
  spo2: any[];
}


export const bmiData: ChartData = {
  data: [],
  backgroundColor: '#f94144',
  hoverBackgroundColor: '#f94144',
  pointBackgroundColor: '#f94144',
  borderColor: '#f94144',
  fill: false,
  label: 'BMI'
};
export const boneData: ChartData = {
  data: [],
  backgroundColor: '#f3722c',
  hoverBackgroundColor: '#f3722c',
  pointBackgroundColor: '#f3722c',
  borderColor: '#f3722c',
  fill: false,
  label: 'Bone',
  hidden: true,
};
export const muscleData: ChartData = {
  data: [],
  backgroundColor: '#f8961e',
  hoverBackgroundColor: '#f8961e',
  pointBackgroundColor: '#f8961e',
  borderColor: '#f8961e',
  fill: false,
  label: 'Muscle',
  hidden: true
};
export const weightData: ChartData = {
  data: [],
  backgroundColor: '#4d908e',
  hoverBackgroundColor: '#4d908e',
  pointBackgroundColor: '#4d908e',
  borderColor: '#4d908e',
  fill: false,
  label: 'Body Weight',
};
export const FatData: ChartData = {
  data: [],
  backgroundColor: '#577590',
  hoverBackgroundColor: '#577590',
  pointBackgroundColor: '#577590',
  borderColor: '#577590',
  fill: false,
  label: 'Fat',
  hidden: true
};
export const waterData: ChartData = {
  data: [],
  backgroundColor: '#277da1',
  hoverBackgroundColor: '#277da1',
  pointBackgroundColor: '#277da1',
  borderColor: '#277da1',
  fill: false,
  label: 'Water Weight',
  hidden: true
};
