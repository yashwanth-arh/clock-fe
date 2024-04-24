import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DiseaseDataSource } from '../services/disease-data-source';
import { DiseaseService } from '../services/disease.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DieseaseComponent } from './diesease.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('DieseaseComponent', () => {
  let component: DieseaseComponent;
  let fixture: ComponentFixture<DieseaseComponent>;
  let diseaseService: DiseaseService;
  let snackbarService: SnackbarService;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatPaginatorModule,
        MatSortModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [DieseaseComponent],
      providers: [
        FormBuilder,
        {
          provide: DiseaseService,
          useValue: {},
        },
        {
          provide: SnackbarService,
          useValue: {},
        },
        {
          provide: MatDialog,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieseaseComponent);
    component = fixture.componentInstance;
    diseaseService = TestBed.inject(DiseaseService);
    snackbarService = TestBed.inject(SnackbarService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and data source', () => {
    expect(component.diseasefilter).toBeDefined();
    expect(component.dataSource).toBeDefined();
  });

  it('should load disease on init', () => {
    spyOn(component.dataSource, 'loadDisease');
    component.ngOnInit();
    expect(component.dataSource.loadDisease).toHaveBeenCalledWith(0, 0);
  });

  it('should load disease on paginator and sort change', () => {
    spyOn(component, 'loadDiseaseList');
    component.ngAfterViewInit();
    component.paginator.page.emit();
    component.sort.sortChange.emit();
    expect(component.loadDiseaseList).toHaveBeenCalledTimes(2);
  });

  it('should refresh table on add and edit dialog close', () => {
    spyOn(component, 'refreshTable');
    component.openAddDiseaseDialog();
    expect(component.refreshTable).toHaveBeenCalled();
    component.openEditDiseaseDialog({
      id: '1',
      name: 'test',
      description: '',
      code: '',
    });
    expect(component.refreshTable).toHaveBeenCalledTimes(2);
  });

  it('should navigate to login if token is not present', () => {
    spyOn(router, 'navigate');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not navigate to login if token is present', () => {
    spyOn(router, 'navigate');
    localStorage.setItem('auth', 'token');
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalledWith(['/login']);
  });

  it('should reset search on unselect global search', () => {
    spyOn(component, 'onDiseaseFilter');
    component.unselectGlobalSearch();
    expect(component.diseasefilter.get('searchQuery').value).toBe('');
    expect(component.onDiseaseFilter).toHaveBeenCalled();
    expect(component.isEnableGlobalSearch).toBe(false);
  });

  it('should enable global search and call onDiseaseFilter on search query change', () => {
    spyOn(component, 'onDiseaseFilter');
    component.isEnableGlobalSearchFunc();
    expect(component.onDiseaseFilter).not.toHaveBeenCalled();

    component.diseasefilter.get('searchQuery').setValue('ab');
    component.isEnableGlobalSearchFunc();
    expect(component.onDiseaseFilter).not.toHaveBeenCalled();

    component.diseasefilter.get('searchQuery').setValue('abc');
    component.isEnableGlobalSearchFunc();
    expect(component.onDiseaseFilter).toHaveBeenCalled();
    expect(component.isEnableGlobalSearch).toBe(true);
  });

  it('should show valid text message if search query has invalid characters', () => {
    component.diseasefilter.get('searchQuery').setValue('!@#$%^&*()');
    component.onDiseaseFilter();
    expect(component.searchErrorMessage).toBe(
      'Search query contains invalid characters'
    );
  });

  it('should call loadDiseaseList with correct parameters on onDiseaseFilter', () => {
    spyOn(component.dataSource, 'loadDisease');
    component.diseasefilter.patchValue({
      searchQuery: 'test',
      category: 'All',
    });
    component.onDiseaseFilter();
    expect(component.dataSource.loadDisease).toHaveBeenCalledWith(
      0,
      0,
      'test',
      'All'
    );
  });

  it('should open add disease dialog on openAddDiseaseDialog', () => {
    spyOn(dialog, 'open');
    component.openAddDiseaseDialog();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open edit disease dialog on openEditDiseaseDialog', () => {
    spyOn(dialog, 'open');
    component.openEditDiseaseDialog({
      id: '1',
      name: 'test',
      description: '',
      code: '',
    });
    expect(dialog.open).toHaveBeenCalled();
  });
});
