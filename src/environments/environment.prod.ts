// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'https://dev-api.clockhealth.ai', //dev
  // apiBaseUrl: 'https://qa-api.clockhealth.ai', //QA
  // apiBaseUrl: 'https://uat-api.clockhealth.com', //UAT
  // apiBaseUrl: 'https://api.clockhealth.ai', //Prod
  uniqueUrl: 'https://dev-api.clockhealth.ai/clock-data-mgmt', //dev
  // uniqueUrl: 'https://qa-api.clockhealth.ai/clock-data-mgmt', //QA
  // uniqueUrl: 'https://uat-api.clockhealth.com/clock-data-mgmt', //UAT
  // uniqueUrl: 'https://api.clockhealth.ai/clock-data-mgmt', //Prod
  profile_service: 'clock-user-management',
  data_service: 'clock-data-mgmt',
  data_collection_service: 'clock-data-collection',
  authentication_flag: false,
  i_health_service: 'rpm-ihealth-client',
  s3Baseurl: 'https://dev-guide.clockhealth.com/', //Dev
  // s3Baseurl: 'https://qa-guide.clockhealth.com/', //QA
  // s3Baseurl: 'https://uat-guide.clockhealth.com/', //UAT
  imagePathUrl: 'https://dev-api.clockhealth.ai/',
  // imagePathUrl: 'https://qa-api.clockhealth.ai/',
  // imagePathUrl: 'https://uat-api.clockhealth.com/',

  // imagePathUrl: 'https://api.clockhealth.ai',
  bulkUploadUrl: 'https://dev-console.clockhealth.ai/', //Dev
  // bulkUploadUrl: 'https://qa-console.clockhealth.ai/', //QA
  // bulkUploadUrl: 'https://uat-console.clockhealth.com/', //UAT
  // bulkUploadUrl:'https://console.clockhealth.ai/',//Prod
  deviceUrl: 'https://dev-guide.clockhealth.com/guidelines/Devices.xlsx', //Dev
  // deviceUrl:'https://qa-guide.clockhealth.com/guidelines/Devices.xlsx',//QA
  // deviceUrl: 'https://uat-guide.clockhealth.com/guidelines/Devices.xlsx', //UAT

  hospitalDeviceUrl:
    'https://dev-guide.clockhealth.com/guidelines/Devices_Assign_Hospital.xlsx', //Dev
  // hospitalDeviceUrl:'https://qa-guide.clockhealth.com/guidelines/Devices_Assign_Hospital.xlsx', //QA
  // hospitalDeviceUrl:'https://uat-guide.clockhealth.com/guidelines/Devices_Assign_Hospital.xlsx', //UAT

  // bulkUploadUrl: 'https://console.clockhealth.ai/', //Prod
  api_timeout: 20000,
  idle_time: 8000, // seconds
  appointment: false,
  firebase: {
    apiKey: 'AIzaSyAoqOZhsFlqzkoYvQ4R3ZFOrBSHZ0FdNgk',
    authDomain: 'clock-healthcare.firebaseapp.com',
    projectId: 'clock-healthcare',
    storageBucket: 'clock-healthcare.appspot.com',
    messagingSenderId: '48655718171',
    appId: '1:48655718171:web:7719b4f6b64a23430c25be',
    measurementId: 'G-WV2WHSVPKE',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
