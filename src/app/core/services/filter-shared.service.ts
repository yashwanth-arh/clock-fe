import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterSharedService {
  public globalHospital: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public globalContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public tabCountData: BehaviorSubject<any> = new BehaviorSubject<any>({data:JSON.parse(localStorage.getItem('tabCount'))});
  public globalFacilities: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public TicketSearch: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public configureSearch: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public LeadershipSearch: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public LeaderBoardDateSearch: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public logHistory: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public patientsSearch: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public defaultSearch: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public TicketStatus: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public statusHospital: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public statusContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public statusFacilities: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public statusPatient: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public statusSupport: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public globalDevice: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public deviceTypeFilter: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public settingTypeTabs: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public deviceStatusFilter: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public triggeredDeviceInfo: BehaviorSubject<any> =
    new BehaviorSubject<boolean>(false);
  public subModule: BehaviorSubject<any> = new BehaviorSubject<string>('');
  public globalDeviceModel: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public globalCareProvider: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public statusCareProvider: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public globalCareCoordinator: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public statusCareCoordinator: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public globalHospitalAdmins: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public statusHospitalAdmins: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public globalFacilityAdmins: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public statusFacilityAdmins: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public triggeredSupportTicket: BehaviorSubject<any> =
    new BehaviorSubject<boolean>(false);
  constructor() {

  }

  globalHospitalCall(data) {
    this.globalHospital.next(data);
  }
  globalContentCall(data) {
    this.globalContent.next(data);
  }
  tabCount(data) {
    this.tabCountData.next(data);
  }
  logHistorySearchCall(data) {
    this.logHistory.next(data);
  }
  globalFacilitiesCall(data) {
    this.globalFacilities.next(data);
  }
  supportTicketSearch(data) {
    this.TicketSearch.next(data);
  }
  patientSearch(data) {
    this.patientsSearch.next(data);
  }
  defaultTicketSearch(data) {
    this.defaultSearch.next(data);
  }
  supportTicketStatus(data) {
    this.TicketStatus.next(data);
  }
  statusHospitalCall(data) {
    this.statusHospital.next(data);
  }
  statusContentCall(data) {
    this.statusContent.next(data);
  }
  statusFacilitiesCall(data) {
    this.statusFacilities.next(data);
  }
  statusPatientCall(data) {
    this.statusPatient.next(data);
  }
  statusSupportCall(data) {
    this.statusSupport.next(data);
  }
  subModuleCall(data) {
    this.subModule.next(data);
  }
  globalDeviceCall(data) {
    this.globalDevice.next(data);
  }
  deviceTypeFilterCall(data) {
    this.deviceTypeFilter.next(data);
  }
  settingTypeTabsCall(data) {
    this.settingTypeTabs.next(data);
  }
  deviceStatusFilterCall(data) {
    this.deviceStatusFilter.next(data);
  }
  globalDeviceModelCall(data) {
    this.globalDeviceModel.next(data);
  }
  configureSearchCall(data) {
    this.configureSearch.next(data);
  }
  LeadershipSearchField(data) {
    this.LeadershipSearch.next(data);
  }
  leaderBoradDateFilter(data) {
    this.LeaderBoardDateSearch.next(data);
  }
  globalCareProviderCall(data) {
    this.globalCareProvider.next(data);
  }
  statusCareProviderCall(data) {
    this.statusCareProvider.next(data);
  }
  globalCareCoordinatorCall(data) {
    this.globalCareCoordinator.next(data);
  }
  statusCareCoordinatorCall(data) {
    this.statusCareCoordinator.next(data);
  }
  globalHospitalAdminsCall(data) {
    this.globalHospitalAdmins.next(data);
  }
  statusHospitalAdminsCall(data) {
    this.statusHospitalAdmins.next(data);
  }
  globalFacilityAdminsCall(data) {
    this.globalFacilityAdmins.next(data);
  }
  statusFacilityAdminsCall(data) {
    this.statusFacilityAdmins.next(data);
  }
  supportTicketCall(data) {
    this.triggeredSupportTicket.next(data);
  }
  changeDeviceInfo(data) {
    this.triggeredDeviceInfo.next(data);
  }
}
