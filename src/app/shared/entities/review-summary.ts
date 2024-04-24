export interface ReviewSummary {
  'patientId': string;
  'bpReviewed'?: boolean;
  'boReviewed'?: boolean;
  'weightReviewed'?: boolean;
  'temperatureReviewed'?: boolean;
  'gulcoseReviewed'?: boolean;
}


export enum DeviceReviewed {
  bpReviewed,
  boReviewed,
  weightReviewed,
  temperatureReviewed,
  gulcoseReviewed
}


export const deviceMap = {
  bp: 'bpReviewed',
  spo2: 'boReviewed',
  weight: 'weightReviewed',
  temperature: 'temperatureReviewed',
  glucose: 'gulcoseReviewed'
};


export const defaultReviewSummary: ReviewSummary = {
  patientId: '',
  bpReviewed: true,
  boReviewed: true,
  weightReviewed: true,
  temperatureReviewed: true,
  gulcoseReviewed: true,
}
