import {
  AgmMap,
  AgmRectangle,
  MapsAPILoader,
  RectangleManager,
  AgmCircle,
} from '@agm/core';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-bp-readings-map-view',
  templateUrl: './bp-readings-map-view.component.html',
  styleUrls: ['./bp-readings-map-view.component.scss'],
})
export class BpReadingsMapViewComponent implements OnInit {
  daily: string;
  lastOneWeek: string;
  lastTwoWeek: string;
  lastOneMonth: string;
  lastThreeMonth: string;
  requestBody: any = {};
  patientLocations: any = [];
  type: string;
  zoneCounts = {};
  agmlat: number;
  agmlong: number;
  agmzoom = 15;
  circleLat: number;
  circleLong: number;
  distanceArr: any = [];
  centroidArr: any = [];
  showCircle = true;
  homeIcon = './assets/img/Morning.png';
  officeIcon = 'assets/img/Night.png';
  locationFilter = 'locations';
  // options: Options = new Options({
  //   bounds: undefined, fields: ["address_component"], strictBounds: false,
  //   types: ['geocode', 'route'],
  //   componentRestrictions: { this.zoneCountsry: 'gb' }
  // });
  options: Options = new Options({
    types: [],
    componentRestrictions: { country: 'UA' },
  });
  private mapsAPILoader: MapsAPILoader;
  filteredMarkers = [];
  minClusterSize = 50;
  map: any;
  markers = [];
  patientId: string;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild(AgmCircle)
  public agmMap: AgmCircle;
  currentLocationLatitude: any;
  currentLocationLongitude: any;
  formattedAddress = '';
  centroidArray: any[] = [
    { lat: '12.8908405', longi: '77.5821727' },
    { lat: '12.89086935', longi: '77.58217116' },
  ];
  latLongCenters: any[] = [];
  listOfGroups: any[] = [];
  groupedList: any[] = [];
  groupedArray: any[] = [];
  centroidLatLong: any[] = [];

  constructor(
    private dashboardService: CaregiverDashboardService,
    private snackbarService: SnackbarService,
    private numberPipe: DecimalPipe,
    private sharedService: CaregiverSharedService
  ) {}

  ngOnInit(): void {

    this.patientId = localStorage.getItem('patientId');
    this.sharedService.triggerdMaps.subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        this.patientId = data['id'];
        this.requestBody['patientId'] = this.patientId;
        this.requestBody['type'] = 'day';
        this.requestBody['value'] = '0';
        this.getReadings();
      } else {
        this.requestBody['patientId'] = this.patientId;
        this.requestBody['type'] = 'day';
        this.requestBody['value'] = '0';
        
        this.getReadings();
      }
    });
  }
  public handleAddressChange(address: any) {
    this.formattedAddress = address.formatted_address;
  }

  getReadings() {    
    this.centroidLatLong = [];
    this.groupedArray = [];
    this.markers = [];
    this.dashboardService.getBpAnalytics(this.requestBody).subscribe(
      (value) => {
        this.mapOperation(value);
        this.patientLocations = value.average;
      },
      (err) => {
        // this.snackbarService.error(err.message);
      }
    );
  }
  mapOperation(value) {
    if (!value?.bpVitalAnalytics?.patientVitalVo.length) {
      // this.snackbarService.error('No readings available for this location');
      return;
    }
    this.markers = [];
    this.groupedArray = [];
    // if (value.err === 403) {
    //   this.snackbarService.error(value.message);
    // }
    if (value) {
      this.centroidLatLong = [];
      const patientAnalyatics = value?.bpVitalAnalytics?.patientAnalyatics;
      const patientVitalVo = value?.bpVitalAnalytics?.patientVitalVo;

      if (patientAnalyatics?.morning?.type === 'morning') {
        const mornSys =
          patientAnalyatics.morning?.sys /
          patientAnalyatics.morning?.vitalreadingCount;
        const mornDia =
          patientAnalyatics.morning?.dia /
          patientAnalyatics.morning?.vitalreadingCount;

        this.type = patientAnalyatics.morning?.type;
      }
      if (patientAnalyatics?.afternoon?.type === 'afternoon') {
        const afterSys =
          patientAnalyatics.afternoon?.sys /
          patientAnalyatics.afternoon?.vitalreadingCount;
        const afterDia =
          patientAnalyatics.afternoon?.dia /
          patientAnalyatics.afternoon?.vitalreadingCount;

        this.type = value.bpVitalAnalytics?.patientAnalyatics.afternoon?.type;
      }
      if (patientAnalyatics?.evening?.type === 'evening') {
        const eveningSys =
          patientAnalyatics.evening?.sys /
          patientAnalyatics.evening?.vitalreadingCount;
        const eveningDia =
          patientAnalyatics.evening?.dia /
          patientAnalyatics.evening?.vitalreadingCount;
        this.type = patientAnalyatics.evening?.type;
      }
      if (patientAnalyatics?.night?.type === 'night') {
        const nightSys =
          patientAnalyatics.night?.sys /
          patientAnalyatics.night?.vitalreadingCount;
        const nightDia =
          patientAnalyatics.night?.dia /
          patientAnalyatics.night?.vitalreadingCount;
        this.type = patientAnalyatics.night?.type;
      }
      if (patientVitalVo?.length) {
        patientVitalVo.forEach((res) => {
          const mapValues = {
            lat: res.lat,
            lng: res.longi,
            label: res.locationType ? res.locationType : 'Unknown',
            group: res.group,
            // icon: res.type === 'morning' ? 'assets/img/Morning.png' : res.type === 'afternoon' ? 'assets/img/Afternoon.png' : res.type === 'evening' ? 'assets/img/Evening.png' : 'assets/img/Night.png'
          };
          this.markers.push(mapValues);
        });

        this.markers = this.markers.map((res) => {
          if (res?.label && res?.label === 'Office') {
            res.icon = './assets/img/Icons/Office.png';
          } else if (res?.label && res?.label === 'Home') {
            res.icon = './assets/img/Icons/Home.png';
          } else if (res?.label && res?.label === 'Park') {
            res.icon = './assets/img/Icons/Park.png';
          } else {
            res.icon = './assets/img/Icons/Location Pin.png';
          }
          res.icon = {
            labelOrigin: { x: 16, y: 48 },
            url: res.icon,
            scaledSize: {
              width: 32,
              height: 32,
            },
          };
          return res;
        });
     
        
        this.markers = this.markers.filter(
          (person, index) =>
            index ===
            this.markers.findIndex((other) => person.group === other.group)
        );
        this.markers = this.markers.map((loc) => {
          loc.label = {
            text: loc.label,
            color: 'red',
            fontWeight: 'bold',
            fontSize: '10px',
          };
          return loc;
        });
        this.agmlat = Number(
          this.markers.length > 1 ? this.markers[1]?.lat : this.markers[0]?.lat
        );
        this.agmlong = Number(
          this.markers.length > 1 ? this.markers[1]?.lng : this.markers[0]?.lng
        );
    

        patientVitalVo.forEach((element) => {
          this.listOfGroups.push(element.group);
        });
        const uniq = this.listOfGroups.reduce(function (a, b) {
          if (a.indexOf(b) < 0) {a.push(b);}
          return a;
        }, []);
        for (let i = 0; i < uniq.length; i++) {
          const array: any[] = [];
          for (let j = 0; j < patientVitalVo.length; j++) {
            if (uniq[i] == patientVitalVo[j].group) {
              array.push(patientVitalVo[j]);
            }
          }
          this.groupedArray.push(array);
        }
        // if (this.groupedArray.length > 1) {
        for (let i = 0; i < this.groupedArray.length; i++) {
          let sumLat = 0;
          let sumLong = 0;
          let sumSys = 0;
          let sumDia = 0;
          for (let j = 0; j < this.groupedArray[i].length; j++) {
            sumLat += Number(this.groupedArray[i][j].lat);
            sumLong += Number(this.groupedArray[i][j].longi);
            sumSys += Number(this.groupedArray[i][j].sys);
            sumDia += Number(this.groupedArray[i][j].dia);
          }
          // let valuelng;
          // let valSys;
          // let valDia;
          const valuelng =
            sumLat / this.groupedArray[i].length +
            ',' +
            sumLong / this.groupedArray[i].length;
          const valSys = this.numberPipe.transform(
            sumSys / this.groupedArray[i].length,
            '1.0-0'
          );
          const valDia = this.numberPipe.transform(
            sumDia / this.groupedArray[i].length,
            '1.0-0'
          );
          this.groupedArray[i] = this.groupedArray[i].map((res) => {
            res.icon = {
              labelOrigin: { x: 16, y: 48 },
              url: './assets/img/Icons/Dot.png',
              scaledSize: {
                width: 10,
                height: 10,
              },
            };
            return res;
          });
          this.centroidLatLong.push({
            latLng: valuelng,
            zone: this.getZoneColors(valSys, valDia),
          });
          4;
        }
      }
    } else {
      this.snackbarService.error('No data available');
    }
  }
  getlat(lat) {
    const splittedLatlng = lat.latLng.split(',');
    return Number(splittedLatlng[0]) > 0 ? Number(splittedLatlng[0]) : null;
  }

  getLong(lng) {
    const splittedLatlng = lng.latLng.split(',');
    return Number(splittedLatlng[1]) > 0 ? Number(splittedLatlng[1]) : null;
  }
  getLatLngCenter(latLongArry) {
    let sumLat = 0;
    latLongArry.forEach((res) => {
      sumLat += res[0];
    });
    const cntrLat = sumLat / latLongArry.length;
    let sumLong = 0;
    latLongArry.forEach((res) => {
      sumLong += res[1];
    });
    const cntrLong = sumLong / latLongArry.length;
    return [cntrLat, cntrLong];
    // let sum += Number(latLngInDegr[0]);
  }
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          this.currentLocationLatitude = resp.coords.latitude;
          this.currentLocationLongitude = resp.coords.longitude;
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getZoneColors(sys, dia) {
    this.systolicCal(sys);
    this.diastolicCal(dia);
    if (this.systolicCal(sys) < this.diastolicCal(dia)) {
      return this.systolicCal(sys);
    } else {
      return this.diastolicCal(dia);
    }
  }
  systolicCal(currentSytsolic) {
    // systolic range
    const hyperTensionSystolicOrangeValue = 129;
    const hyperTensionSystolicRedValue = 179;
    const hypoTensionSystolicOrangeValue = 100;
    const hypoTensionSystolicRedValue = 80;
    let systolicCalFlag;
    if (
      currentSytsolic >= hypoTensionSystolicOrangeValue &&
      currentSytsolic <= hyperTensionSystolicOrangeValue
    ) {
      systolicCalFlag = '3';
    } else if (
      currentSytsolic > hyperTensionSystolicOrangeValue &&
      currentSytsolic <= hyperTensionSystolicRedValue
    ) {
      systolicCalFlag = '2';
    } else if (
      currentSytsolic >= hypoTensionSystolicRedValue &&
      currentSytsolic < hypoTensionSystolicOrangeValue
    ) {
      systolicCalFlag = '2';
    } else if (currentSytsolic > hyperTensionSystolicRedValue) {
      systolicCalFlag = '1';
    } else if (currentSytsolic < hypoTensionSystolicRedValue) {
      systolicCalFlag = '1';
    }
    return systolicCalFlag;
  }

  diastolicCal(currentDiastolic) {
    // diastolic range
    const hyperTensionDiastolicOrangeValue = 89;
    const hyperTensionDiastolicRedValue = 110;
    const hypoTensionDiastolicOrangeValue = 71;
    const hypoTensionDiastolicRedValue = 50;
    let diaStolicCalFlag;
    if (
      currentDiastolic >= hypoTensionDiastolicOrangeValue &&
      currentDiastolic <= hyperTensionDiastolicOrangeValue
    ) {
      diaStolicCalFlag = '3';
    } else if (
      currentDiastolic > hyperTensionDiastolicOrangeValue &&
      currentDiastolic <= hyperTensionDiastolicRedValue
    ) {
      diaStolicCalFlag = '2';
    } else if (
      currentDiastolic >= hypoTensionDiastolicRedValue &&
      currentDiastolic < hypoTensionDiastolicOrangeValue
    ) {
      diaStolicCalFlag = '2';
    } else if (currentDiastolic > hyperTensionDiastolicRedValue) {
      diaStolicCalFlag = '1';
    } else if (currentDiastolic < hypoTensionDiastolicRedValue) {
      diaStolicCalFlag = '1';
    }
    return diaStolicCalFlag;
  }

  getParticularLocation(value) {
    if (value.location_type === 'locations') {
      this.getReadings();
    } else {
      const body = {
        patientId: this.patientId,
        locationId: value.location_id,
      };
      this.dashboardService.getBpAnalyticsByLocId(body).subscribe((res) => {
        this.mapOperation(res);
      });
    }
  }
  getZoneColor(zone) {
    if (zone) {
      return this.numberPipe.transform(zone, '1.0-0');
    } else {
      return '';
    }
  }
}
