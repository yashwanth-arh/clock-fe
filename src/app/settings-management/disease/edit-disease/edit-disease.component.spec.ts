import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { of } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Disease } from '../../entities/disease';
import { DiseaseService } from '../../services/disease.service';
import { EditDiseaseComponent } from './edit-disease.component';

describe('EditDiseaseComponent', () => {
  let component: EditDiseaseComponent;
  let fixture: ComponentFixture<EditDiseaseComponent>;
  let diseaseService: jasmine.SpyObj<DiseaseService>;
  let snackBarService: jasmine.SpyObj<SnackbarService>;
  const mockDiseaseData = {
    disease: {
      name: 'test',
      description: 'test description',
      code: 'T01',
      status: 'ACTIVE',
    },
  };

  beforeEach(async () => {
    const diseaseSpy = jasmine.createSpyObj('DiseaseService', [
      'editDisease',
      'getICDCodes',
    ]);
    const snackBarSpy = jasmine.createSpyObj('SnackbarService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      declarations: [EditDiseaseComponent],
      imports: [ReactiveFormsModule, MatAutocompleteModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDiseaseData },
        { provide: MatDialogRef, useValue: {} },
        { provide: DiseaseService, useValue: diseaseSpy },
        { provide: SnackbarService, useValue: snackBarSpy },
        FormBuilder,
      ],
    }).compileComponents();

    diseaseService = TestBed.inject(
      DiseaseService
    ) as jasmine.SpyObj<DiseaseService>;
    snackBarService = TestBed.inject(
      SnackbarService
    ) as jasmine.SpyObj<SnackbarService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct values', () => {
    const expectedFormValue = {
      name: mockDiseaseData.disease.name,
      description: mockDiseaseData.disease.description,
      code: mockDiseaseData.disease.code,
    };
    expect(component.editDiseaseForm.value).toEqual(expectedFormValue);
  });

  it('should get ICD codes when user types more than 4 characters', () => {
    const inputValue = 'testValue';
    const mockIcdCodes = ['ICD1', 'ICD2'];

    diseaseService.getICDCodes.and.returnValue(of(mockIcdCodes));

    component.onKeyUp(inputValue);

    expect(diseaseService.getICDCodes).toHaveBeenCalledWith(inputValue);
    expect(component.icdCodes).toEqual(mockIcdCodes);
  });

  it('should update form fields when ICD code is selected', () => {
    const selectedICD = { option: { viewValue: 'Cholera', value: 'A00' } };
    const event = {
      source: { input: null },
      option: selectedICD.option,
    } as unknown as MatAutocompleteSelectedEvent;
    const expectedFormValue = {
      name: 'Cholera',
      description: 'A00-Cholera',
      code: mockDiseaseData.disease.code,
    };
    component.onSelectICD(event);

    expect(component.editDiseaseForm.value).toEqual(expectedFormValue);
  });

  it('should not submit form when it is invalid', () => {
    component.isSubmitted = false;
    component.onSubmit('');

    // expect(component.isSubmitted).toBeFalsy();
    expect(diseaseService.editDisease).not.toHaveBeenCalled();
  });

  it('should submit form when it is valid', () => {
    component.isSubmitted = false;
    component.editDiseaseForm.setValue({
      name: 'new name',
      description: 'new description',
      code: 'new code',
    });

    diseaseService.editDisease.and.returnValue(of(null));
    expect(component.editDiseaseForm.valid).toBeTruthy();

    component.onSubmit('123');

    expect(component.isSubmitted).toBeTruthy();
    expect(diseaseService.editDisease).toHaveBeenCalled();
    expect(snackBarService.success).toHaveBeenCalled();
  });

  it('should show error message when edit disease request fails', () => {
    component.isSubmitted = false;
    component.editDiseaseForm.setValue({
      name: 'new name',
      description: 'new description',
      code: 'new code',
    });
    // diseaseService.editDisease.and.returnValue(of({ error: 'Error occurred' }as Disease));
    // expect(component.editDiseaseForm.invalid).toBeTruthy();

    component.onSubmit('1234');

    // expect(component.isSubmitted).toBeFalsy();
    expect(diseaseService.editDisease).toHaveBeenCalled();
    expect(snackBarService.error).toHaveBeenCalled();
  });
});
