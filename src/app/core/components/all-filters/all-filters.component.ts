import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceTypeService } from 'src/app/settings-management/services/device-type.service';
import { FilterSharedService } from '../../services/filter-shared.service';
import { UserRoles } from 'src/app/shared/entities/user-roles.enum';
import { ActivatedRoute } from '@angular/router';
import { DeviceManagementSharedService } from 'src/app/device-management/device.management.shared-service';

@Component({
  selector: 'app-all-filters',
  templateUrl: './all-filters.component.html',
  styleUrls: ['./all-filters.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class AllFiltersComponent implements OnInit {
  @Input() moduleName: string;
  hospitalList: FormGroup;
  contentList: FormGroup;
  FacilitiesList: FormGroup;
  deviceFilterForm: FormGroup;
  supportGroup: FormGroup;
  leaderGroup: FormGroup;
  logHistoryGroup: FormGroup;
  patientGroup: FormGroup;
  defaultGroup: FormGroup;
  careProviderList: FormGroup;
  careCoordinatorList: FormGroup;
  hospitalAdminsList: FormGroup;
  facilityAdminsList: FormGroup;
  deviceModelfilter: FormGroup;
  isEnableDeviceModelGlobalSearch: boolean = false;
  isEnableHospitalGlobalSearch: boolean = false;
  isEnableContentGlobalSearch: boolean = false;
  isEnableFacilitiesConfiguGlobalSearch: boolean = false;
  isEnableFacilitiesListGlobalSearch: boolean;
  isEnableHospitalStatus: boolean;
  isEnableDeviceGlobalSearch: boolean;
  isEnableDeviceStatus: boolean;
  isEnableCareProviderGlobalSearch: boolean;
  isEnableSpecialities: boolean;
  isEnableClinic: boolean;
  isEnableCareProviderCity: boolean;
  messageSuccess: boolean;
  selectedRole: string;
  today = new Date();
  specialityList: any[] = [];
  showValidTextMessage = false;
  status: any[] = [
    { value: 'ALL', display: 'All' },
    { value: 'ACTIVE', display: 'Active' },
    { value: 'INACTIVE', display: 'Inactive' },
  ];
  statusSupport: string[] = ['Open', 'Closed'];
  isEnableDeviceType: boolean;
  public userRoles = UserRoles;
  minDate: Date;
  maxDate: Date;
  fromDate: Date = new Date();
  toDate: Date;
  deviceType: any[] = [];
  statuslist = [
    { value: 'All', viewValue: 'ALL' },
    { value: 'Assigned', viewValue: 'ASSIGNED_HOS' },
    { value: 'Available', viewValue: 'AVAILABLE_CH' },
    { value: 'Damaged', viewValue: 'DAMAGED' },
    { value: 'Returned', viewValue: 'RETURNED' },
  ];
  statuslistHospital = [
    { value: 'All', viewValue: 'ALL' },
    { value: 'Assigned', viewValue: 'ASSIGNED_PAT' },
    { value: 'Available', viewValue: 'ASSIGNED_HOS' },
  ];
  subModuleName: any = 'Devices';
  role: string;
  configureGroup: FormGroup;
  isEnableConfiguGlobalSearch: boolean = false;
  isEnableUserGlobalSearch: boolean;
  isEnablepatientGlobalSearch: boolean;
  isEnableLeaderBoardGlobalSearch: boolean;
  isEnableSupportTicketGlobalSearch: boolean;
  isEnableDefaultIssuesGlobalSearch: boolean;
  routeDetails: any;
  startDate: string;
  endDate: string;
  constructor(
    private fb: FormBuilder,
    private filterService: FilterSharedService,
    private deviceTypeService: DeviceTypeService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.today.setDate(this.today.getDate());
    this.role = localStorage.getItem('role');
    this.routeDetails = this.activeRoute.snapshot.data;
    this.filterService.subModule.subscribe((res) => {
      if (res) {
        this.subModuleName = res;
      }
    });
    // this.deviceFilterForm.get('deviceName').setValue('ALL')
    this.filterService.statusSupport.subscribe((res) => {
      if (res.status === 'Open') {
        this.supportGroup.get('statusSupport').setValue(res.status || 'Open');
      }
    });
    this.filterService.statusPatient.subscribe((res) => {
      if (res.status === 'ALL') {
        this.patientGroup.get('statusPatient').setValue(res.status || 'ALL');
      }
    });

    this.filterService.statusFacilities.subscribe((res) => {
      if (res.status === 'ALL') {
        this.FacilitiesList.get('status').setValue(res.status || 'ALL');
      }
    });
    this.filterService.statusFacilityAdmins.subscribe((res) => {
      if (res.status === 'ALL') {
        this.facilityAdminsList
          .get('statusFilter')
          .setValue(res.status ? res.status : 'ALL');
      }
    });

    this.filterService.statusCareCoordinator.subscribe((res) => {
      if (res.status === 'ALL') {
        this.careCoordinatorList
          .get('statusFilter')
          .setValue(res.status || 'ALL');
      }
    });
    this.filterService.statusCareProvider.subscribe((res) => {
      if (res.status === 'ALL') {
        this.careProviderList.get('statusFilter').setValue(res.status || 'ALL');
      }
    });
    this.filterService.statusHospitalAdmins.subscribe((res) => {
      if (res.status === 'ALL') {
        this.hospitalAdminsList
          .get('statusFilter')
          .setValue(res.status || 'ALL');
      }
    });
    this.filterService.deviceTypeFilter.subscribe((res) => {
      if (res.deviceName === 'ALL') {
        this.deviceFilterForm
          .get('deviceName')
          .setValue(res.deviceName || 'ALL');
      }
    });
    this.filterService.deviceStatusFilter.subscribe((res) => {
      if (res.status === 'ALL') {
        this.deviceFilterForm.get('status').setValue(res.status || 'ALL');
      }
    });
    this.filterService.statusContent.subscribe((res) => {
      if (res.status === 'ALL') {
        this.contentList.get('contentStatus').setValue(res.status || 'ALL');
      }
    });

    this.validatehospitalFilterForm();
    this.validatecontentFilterForm();
    this.validateCareproviderFilterForm();
    this.validateCareCoordinatorFilterForm();
    this.deviceFilterForm = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      deviceName: [''],
      status: ['ALL'],
    });
    this.supportGroup = this.fb.group({
      supportSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      statusSupport: ['Open'],
    });
    this.configureGroup = this.fb.group({
      configureSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    });
    this.leaderGroup = this.fb.group({
      LeadershipSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      startDate: [''],
      endDate: [''],
    });

    this.FacilitiesList = this.fb.group({
      facilitiesSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      status: ['ALL'],
    });
    this.defaultGroup = this.fb.group({
      defaultSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    });
    this.logHistoryGroup = this.fb.group({
      logHistorySearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      startDate: [''],
      endDate: [''],
    });
    // this.defaultGroup = this.fb.group({
    //   defaultSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    // });
    // this.defaultGroup = this.fb.group({
    //   defaultSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    // });
    this.patientGroup = this.fb.group({
      patientSearch: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      statusPatient: ['ALL'],
    });
    this.deviceModelfilter = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    });
    if (this.role === 'RPM_ADMIN' || this.moduleName === 'Device Info') {
      this.deviceTypeService
        .getAllDeviceTypeWithoutPagination()
        .subscribe((res) => {
          // if (res.content.length) {
          this.deviceType = res.deviceTypes;
          // }
        });
    }
    let fDateVal = new Date();
    fDateVal.setDate(fDateVal.getDate() - 7);
    this.leaderGroup.get('startDate').setValue(fDateVal);
    this.leaderGroup.get('endDate').setValue(new Date());
    // this.startDate = this.fromDate;
    // this.endDate = this.toDate;
    const sDate = this.leaderGroup
      .get('startDate')
      .value.toISOString()
      .split('T');
    this.leaderGroup.get('startDate').setValue(sDate[0]);
    const eDate = this.leaderGroup
      .get('endDate')
      .value.toISOString()
      .split('T');
    this.leaderGroup.get('endDate').setValue(eDate[0]);

    this.filterService.leaderBoradDateFilter({
      fromDate: this.leaderGroup.get('startDate').value,
      toDate: this.leaderGroup.get('endDate').value,
    });
    this.filterService.TicketSearch.subscribe((res) => {
      //  this.paginator.pageIndex = 0;
      if (!Object.keys(res).length) {
        this.supportGroup.get('supportSearch').reset();
        this.isEnableSupportTicketGlobalSearch = false;
        // this.supportGroup.reset();
        // this.searchValue = res.searchQuery;
        // this.statusSearch();
      }
    });
  }

  //Hospital Filters
  private validatehospitalFilterForm(): void {
    this.hospitalList = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      status: ['ALL'],
    });
  }
  private validatecontentFilterForm(): void {
    this.contentList = this.fb.group({
      searchContent: [''],
      contentStatus: ['ALL'],
    });
  }
  // unselectHospitalGlobalSearch(): void {
  //   this.hospitalList.get('searchQuery').reset();
  //   this.filterService.globalHospitalCall({});
  //   this.isEnableHospitalGlobalSearch = false;
  // }
  Facilitiesstatus(): any {
    this.isEnableHospitalStatus = true;
    this.filterService.statusFacilitiesCall({
      status: this.FacilitiesList.get('status').value,
    });
  }
  unselectGlobalSearchFacilities() {
    this.messageSuccess = true;
    this.filterService.globalFacilitiesCall({});
    // this.FacilitiesList.get('status').setValue('ALL');
    this.isEnableFacilitiesConfiguGlobalSearch = false;
    this.showValidTextMessage = false;
    this.FacilitiesList.get('facilitiesSearch').reset();
  }
  isEnableFacilitiesGlobalSearch(): any {
    this.isEnableFacilitiesConfiguGlobalSearch = true;
    if (
      this.FacilitiesList.get('facilitiesSearch').valid &&
      this.FacilitiesList.get('facilitiesSearch').value.length > 1
    ) {
      // this.search();
      this.filterService.globalFacilitiesCall({
        searchQuery: this.FacilitiesList.get('facilitiesSearch').value,
      });
    } else if (!this.FacilitiesList.get('facilitiesSearch').value.length) {
      this.messageSuccess = true;
      this.filterService.globalFacilitiesCall({});
      this.isEnableFacilitiesConfiguGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }

  unselectGlobalSearchHospital() {
    this.messageSuccess = true;
    this.filterService.globalHospitalCall({});
    this.isEnableHospitalGlobalSearch = false;
    this.showValidTextMessage = false;
    this.hospitalList.get('searchQuery').reset();
  }
  unselectGlobalSearchContent() {
    this.messageSuccess = true;
    this.filterService.globalContentCall({});
    this.isEnableContentGlobalSearch = false;
    this.showValidTextMessage = false;
    this.contentList.get('searchContent').reset();
  }
  isEnableHospitalGlobalSearchFunc(): any {
    this.isEnableHospitalGlobalSearch = true;
    if (
      this.hospitalList.get('searchQuery').valid &&
      this.hospitalList.get('searchQuery').value.length > 1
    ) {
      // this.search();
      this.filterService.globalHospitalCall({
        searchQuery: this.hospitalList.get('searchQuery').value,
      });
    } else if (!this.hospitalList.get('searchQuery').value.length) {
      this.messageSuccess = true;
      this.filterService.globalHospitalCall({});
      this.isEnableHospitalGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  isEnableContentGlobalSearchFunc(): any {
    this.isEnableContentGlobalSearch = true;
    if (
      this.contentList.get('searchContent').valid &&
      this.contentList.get('searchContent').value.length > 1
    ) {
      // this.search();
      this.filterService.globalContentCall({
        searchContent: this.contentList.get('searchContent').value,
      });
    } else if (!this.contentList.get('searchContent').value.length) {
      this.messageSuccess = true;
      this.filterService.globalContentCall({});
      this.isEnableContentGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  unselectGlobalSearchPatient() {
    this.messageSuccess = true;
    this.filterService.patientSearch({});
    this.isEnablepatientGlobalSearch = false;
    this.patientGroup.get('patientSearch').reset();
  }
  isEnablePatient() {
    this.isEnablepatientGlobalSearch = true;
    if (
      this.patientGroup.get('patientSearch').valid &&
      this.patientGroup.get('patientSearch').value.length > 1
    ) {
      this.filterService.patientSearch({
        searchQuery: this.patientGroup.get('patientSearch').value,
      });
    } else if (!this.patientGroup.get('patientSearch').value.length) {
      this.isEnablepatientGlobalSearch = false;
      this.messageSuccess = true;
      this.filterService.patientSearch({});
    }
  }
  unselectGlobalSearchConfigur() {
    this.messageSuccess = true;
    this.filterService.configureSearchCall({});
    this.isEnableConfiguGlobalSearch = false;
    this.configureGroup.get('configureSearch').reset();
  }
  isEnableConfigure() {
    this.isEnableConfiguGlobalSearch = true;
    if (
      this.configureGroup.get('configureSearch').valid &&
      this.configureGroup.get('configureSearch').value.length > 1
    ) {
      this.filterService.configureSearchCall({
        searchQuery: this.configureGroup.get('configureSearch').value,
      });
    } else if (!this.configureGroup.get('configureSearch').value.length) {
      this.messageSuccess = true;
      this.isEnableConfiguGlobalSearch = false;
      this.filterService.configureSearchCall({});
    }
  }
  unselectGlobalSearchLeaderBoard() {
    this.messageSuccess = true;
    this.filterService.LeadershipSearchField({});
    this.isEnableLeaderBoardGlobalSearch = false;
    this.leaderGroup.get('LeadershipSearch').reset();
  }

  unselectGlobalSearchSupportTicket() {
    this.messageSuccess = true;
    this.filterService.supportTicketSearch({});
    this.isEnableSupportTicketGlobalSearch = false;
    this.supportGroup.get('supportSearch').reset();
  }
  isEnableGlobalSearchFunc1() {
    this.isEnableSupportTicketGlobalSearch = true;
    if (
      this.supportGroup.get('supportSearch').valid &&
      this.supportGroup.get('supportSearch').value.length > 1
    ) {
      this.filterService.supportTicketSearch({
        searchQuery: this.supportGroup.get('supportSearch').value,
      });
    } else if (!this.supportGroup.get('supportSearch').value.length) {
      this.messageSuccess = true;
      this.isEnableSupportTicketGlobalSearch = false;
      this.filterService.supportTicketSearch({});
    }
  }
  isEnableGlobalSearchLogHistory() {
    this.filterService.logHistorySearchCall({
      searchQuery: this.logHistoryGroup.get('logHistorySearch').value,
    });
  }
  unselectGlobalSearchDefaultIssues() {
    this.messageSuccess = true;
    this.filterService.defaultTicketSearch({});
    this.isEnableDefaultIssuesGlobalSearch = false;
    this.defaultGroup.get('defaultSearch').reset();
  }
  isEnableGlobalSearchFunc2() {
    this.isEnableDefaultIssuesGlobalSearch = true;
    if (
      this.defaultGroup.get('defaultSearch').valid &&
      this.defaultGroup.get('defaultSearch').value.length > 1
    ) {
      // this.isEnableDefaultIssuesGlobalSearch = true;
      this.filterService.defaultTicketSearch({
        searchQuery: this.defaultGroup.get('defaultSearch').value,
      });
    } else if (!this.defaultGroup.get('defaultSearch').value.length) {
      this.messageSuccess = true;
      this.isEnableDefaultIssuesGlobalSearch = false;
      this.filterService.defaultTicketSearch({});
    }
  }
  unSelectDeviceStatus() {
    this.deviceFilterForm.get('status').setValue('ALL');
  }
  unselectHospitalStatus(): void {
    this.hospitalList.get('status').setValue('ALL');
    this.hospitalAdminsList.get('statusFilter').setValue('ALL');
    this.filterService.statusHospitalCall({
      status: 'ALL',
    });
    this.filterService.globalHospitalCall({
      searchQuery: '',
    });
    this.filterService.statusHospitalAdminsCall({
      status: 'ALL',
    });
    this.filterService.globalHospitalAdminsCall({
      searchQuery: '',
    });
    this.isEnableHospitalStatus = false;
  }

  isEnableHospitalStatusFunc(): any {
    this.isEnableHospitalStatus = true;

    this.filterService.statusHospitalCall({
      status: this.hospitalList.get('status').value,
    });
  }
  isEnableContentStatusFunc(): any {
    // this.isEnableHospitalStatus = true;

    this.filterService.statusContentCall({
      status: this.contentList.get('contentStatus').value,
    });
  }
  isEnablePatientStatusFunc(): any {
    this.filterService.statusPatientCall({
      status: this.patientGroup.get('statusPatient').value,
    });
  }
  isEnableSupportStatusFunc(): any {
    this.filterService.statusSupportCall({
      status: this.supportGroup.get('statusSupport')?.value,
    });
  }

  //Device Filters
  unselectDeviceStatus(): void {
    this.deviceFilterForm.get('status').setValue('ALL');
    this.filterService.deviceStatusFilterCall({
      status: 'ALL',
    });
    this.isEnableDeviceStatus = false;
  }

  isEnableDeviceStatusFunc(evt): any {
    this.deviceFilterForm.get('status').setValue(evt);
    this.isEnableDeviceStatus = true;
    this.filterService.deviceStatusFilterCall({
      status: this.deviceFilterForm.get('status').value,
    });
  }

  unselectDeviceType(): void {
    this.deviceFilterForm.get('deviceName').setValue('ALL');
    this.filterService.deviceTypeFilterCall({
      deviceName: 'ALL',
    });
    this.isEnableDeviceType = false;
  }

  isEnableDeviceTypeFunc(evt): any {
    this.isEnableDeviceType = true;
    this.deviceFilterForm.get('deviceName').setValue(evt);
    this.filterService.deviceTypeFilterCall({
      deviceName: this.deviceFilterForm.get('deviceName').value,
    });
  }
  unselectGlobalSearchDeviceInfo() {
    this.messageSuccess = true;
    this.filterService.globalDeviceCall({ searchQuery: '' });
    this.isEnableDeviceGlobalSearch = false;
    this.showValidTextMessage = false;
    this.deviceFilterForm.get('searchQuery').setValue('');
  }
  isEnableGlobalDeviceSearchFunc() {
    this.isEnableDeviceGlobalSearch = true;
    if (
      this.deviceFilterForm.get('searchQuery').valid &&
      this.deviceFilterForm.get('searchQuery').value.length > 1
    ) {
      // this.search();
      this.filterService.globalDeviceCall({
        searchQuery: this.deviceFilterForm.get('searchQuery').value,
      });
    } else if (!this.deviceFilterForm.get('searchQuery').value.length) {
      this.filterService.globalDeviceCall({ searchQuery: '' });
      this.messageSuccess = true;
      this.isEnableDeviceGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  isEnableGlobalDeviceModelSearchFunc() {
    if (
      this.deviceModelfilter.get('searchQuery').valid &&
      this.deviceModelfilter.get('searchQuery').value.length > 1
    ) {
      this.filterService.globalDeviceModelCall({
        searchQuery: this.deviceModelfilter.get('searchQuery').value,
      });
      this.isEnableDeviceModelGlobalSearch = true;
    } else if (!this.deviceModelfilter.get('searchQuery').value.length) {
      this.messageSuccess = true;
      this.filterService.globalDeviceModelCall({});
      this.isEnableDeviceModelGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  unselectDeviceModelGlobalSearch() {
    this.isEnableDeviceModelGlobalSearch = true;
    this.deviceModelfilter.reset();
  }

  // Reports date filter

  startChange(evt) {}
  endChange(event) {}

  //Care Provider Filters
  public validateCareproviderFilterForm(): any {
    this.careProviderList = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      statusFilter: ['ALL'],
    });
    this.careCoordinatorList = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      statusFilter: ['ALL'],
    });
    this.hospitalAdminsList = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      statusFilter: ['ALL'],
    });
    this.facilityAdminsList = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      statusFilter: ['ALL'],
    });
  }
  public validateCareCoordinatorFilterForm(): any {
    this.careCoordinatorList = this.fb.group({
      searchQuery: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      // clinic: [''],
      // // stateFilter: [''],
      // city: [''],
      // specialization: [''],
      statusFilter: ['ALL'],
    });
  }
  unselectGlobalSearchCareProvider() {
    // this.careCoordinatorList.get('statusFilter').setValue('ALL');
    this.messageSuccess = true;
    this.filterService.globalCareProviderCall({});
    this.isEnableUserGlobalSearch = false;
    this.showValidTextMessage = false;
    this.careProviderList.get('searchQuery').reset();
    // this.filterService.statusCareProviderCall({ status: 'ALL' });
  }
  isEnableCareProviderGlobalSearchFunc() {
    this.isEnableUserGlobalSearch = true;
    if (
      this.careProviderList.get('searchQuery').valid &&
      this.careProviderList.get('searchQuery').value.length > 1
    ) {
      this.filterService.globalCareProviderCall({
        searchQuery: this.careProviderList.get('searchQuery').value,
      });
      // this.isEnableDeviceModelGlobalSearch = true;
    } else if (!this.careProviderList.get('searchQuery').value.length) {
      this.messageSuccess = true;
      this.filterService.globalCareProviderCall({});
      this.isEnableUserGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  careProviderstatus() {
    this.filterService.statusCareProviderCall({
      status: this.careProviderList.get('statusFilter').value,
    });
  }
  unselectGlobalSearchUser() {
    // this.careCoordinatorList.get('statusFilter').setValue('ALL');
    // this.filterService.statusCareCoordinatorCall({  });
    this.messageSuccess = true;
    this.filterService.globalCareCoordinatorCall({});
    this.isEnableUserGlobalSearch = false;
    this.showValidTextMessage = false;
    this.careCoordinatorList.get('searchQuery').reset();
  }
  isEnableCareCoordinatorGlobalSearchFunc() {
    this.isEnableUserGlobalSearch = true;
    if (
      this.careCoordinatorList.get('searchQuery').valid &&
      this.careCoordinatorList.get('searchQuery').value.length > 1
    ) {
      this.filterService.globalCareCoordinatorCall({
        searchQuery: this.careCoordinatorList.get('searchQuery').value,
      });
      // this.isEnableDeviceModelGlobalSearch = true;
    } else if (!this.careCoordinatorList.get('searchQuery').value.length) {
      this.messageSuccess = true;
      this.filterService.globalCareCoordinatorCall({});
      this.isEnableUserGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  careCoordinatorstatus() {
    this.filterService.statusCareCoordinatorCall({
      status: this.careCoordinatorList.get('statusFilter').value,
    });
  }
  unselectGlobalSearchHospitalAdmins() {
    this.messageSuccess = true;
    this.filterService.globalHospitalAdminsCall({});
    this.isEnableUserGlobalSearch = false;
    this.showValidTextMessage = false;
    this.hospitalAdminsList.get('searchQuery').reset();
  }
  isEnableHospitalAdminsGlobalSearchFunc() {
    this.isEnableUserGlobalSearch = true;
    if (
      this.hospitalAdminsList.get('searchQuery').valid &&
      this.hospitalAdminsList.get('searchQuery').value.length > 1
    ) {
      this.filterService.globalHospitalAdminsCall({
        searchQuery: this.hospitalAdminsList.get('searchQuery').value,
      });
      // this.isEnableDeviceModelGlobalSearch = true;
    } else if (!this.hospitalAdminsList.get('searchQuery').value.length) {
      this.messageSuccess = true;
      this.filterService.globalHospitalAdminsCall({});
      this.isEnableUserGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  hospitalAdminsstatus() {
    this.filterService.statusHospitalAdminsCall({
      status: this.hospitalAdminsList.get('statusFilter').value,
    });
  }
  unSelecthospitalAdminsstatus() {
    this.hospitalAdminsList.reset();
    this.hospitalAdminsList.get('statusFilter').setValue('ALL');
    this.filterService.statusHospitalAdminsCall({
      status: 'ALL',
    });
    this.filterService.globalHospitalAdminsCall({
      searchQuery: '',
    });
  }
  unselectGlobalSearchFacilityAdmin() {
    // this.facilityAdminsList.get('statusFilter').setValue('ALL');
    // this.filterService.statusFacilityAdminsCall({
    //   status: 'ALL',
    // });
    this.facilityAdminsList.get('searchQuery').setValue('');
    this.facilityAdminsList.get('searchQuery').reset();
    this.messageSuccess = true;
    this.filterService.globalFacilityAdminsCall({});
    this.isEnableUserGlobalSearch = false;
    this.showValidTextMessage = false;
  }
  isEnableFacilityAdminsGlobalSearchFunc() {
    this.isEnableUserGlobalSearch = true;

    if (
      this.facilityAdminsList.get('searchQuery').valid &&
      this.facilityAdminsList.get('searchQuery').value.length > 1
    ) {
      this.filterService.globalFacilityAdminsCall({
        searchQuery: this.facilityAdminsList.get('searchQuery').value,
      });
      // this.isEnableDeviceModelGlobalSearch = true;
      // this.facilityAdminsList.get('searchQuery').setValue('searchQuery')
    } else if (!this.facilityAdminsList.get('searchQuery').value.length) {
      this.messageSuccess = true;
      this.filterService.globalFacilityAdminsCall({});
      this.isEnableUserGlobalSearch = false;
      this.showValidTextMessage = false;
    }
  }
  facilityAdminsstatus() {
    this.filterService.statusFacilityAdminsCall({
      status: this.facilityAdminsList.get('statusFilter').value,
    });
  }
  // Leader Board Filters

  getDate(event) {
    const sDate = event.value[0];
    const eDate = event.value[1];

    this.leaderGroup.get('startDate').setValue(sDate);
    this.leaderGroup.get('endDate').setValue(eDate);
    if (sDate !== null && eDate !== null) {
      const dateFormat = sDate.setDate(sDate.getDate());
      const dateVal = new Date(dateFormat)?.toISOString().split('T');
      this.leaderGroup.get('startDate').setValue(dateVal[0]);
      const dateFormat2 = eDate.setDate(eDate.getDate());
      const dateVal2 = new Date(dateFormat2)?.toISOString().split('T');
      this.leaderGroup.get('endDate').setValue(dateVal2[0]);
      this.filterService.leaderBoradDateFilter({
        fromDate: this.leaderGroup.get('startDate').value,
        toDate: this.leaderGroup.get('endDate').value,
      });
    }
  }

  isEnableGlobalSearchLeadership() {
    this.isEnableLeaderBoardGlobalSearch = true;
    if (
      this.leaderGroup.get('LeadershipSearch').valid &&
      this.leaderGroup.get('LeadershipSearch').value.length > 1
    ) {
      this.filterService.LeadershipSearchField({
        searchQuery: this.leaderGroup.get('LeadershipSearch').value,
      });
    } else if (!this.leaderGroup.get('LeadershipSearch').value.length) {
      this.messageSuccess = true;
      this.isEnableLeaderBoardGlobalSearch = false;
      this.filterService.LeadershipSearchField({});
    }
  }
}
