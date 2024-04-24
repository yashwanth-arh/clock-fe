import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditCptComponent } from './edit-cpt.component';
import { CptCodeService } from '../../services/cpt-code.service';
// import { SnackbarService } from '../../services/snackbar.service';
import { of } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

describe('EditCptComponent', () => {
  let component: EditCptComponent;
  let fixture: ComponentFixture<EditCptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCptComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: CptCodeService,
          useValue: {},
        },
        {
          provide: SnackbarService,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct values', () => {
    component.data = {
      code: {
        name: 'Test Name',
        description: 'Test Description',
        code: '1234',
        amount: 99.99,
      },
    };
    component.ngOnInit();
    expect(component.editCPTForm.value).toEqual({
      name: 'Test Name',
      description: 'Test Description',
      code: '1234',
      amount: 99.99,
    });
  });

  it('should close the dialog', () => {
    spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should not submit the form if it is invalid', () => {
    spyOn(component.cptService, 'editCPTCode');
    component.onSubmit('codeId');
    expect(component.cptService.editCPTCode).not.toHaveBeenCalled();
  });

  it('should submit the form if it is valid', () => {
    component.editCPTForm.setValue({
      name: 'Test Name',
      description: 'Test Description',
      code: '1234',
      amount: 99.99,
    });
    spyOn(component.cptService, 'editCPTCode').and.returnValue(
      of(component.editCPTForm?.value)
    );
    spyOn(component.snackBar, 'success');
    component.onSubmit('codeId');
    expect(component.cptService.editCPTCode).toHaveBeenCalledWith(
      {
        name: 'Test Name',
        description: 'Test Description',
        code: '1234',
        amount: 99.99,
      },
      'codeId'
    );
    expect(component.snackBar.success).toHaveBeenCalledWith(
      'Cpt Code edited successfully!',
      2000
    );
  });

  it('should handle errors when submitting the form', () => {
    component.editCPTForm.setValue({
      name: 'Test Name',
      description: 'Test Description',
      code: '1234',
      amount: 99.99,
    });
    spyOn(component.cptService, 'editCPTCode').and.returnValue(
      of(component.editCPTForm?.value)
    );
    spyOn(component.snackBar, 'error');
    component.onSubmit('codeId');
    expect(component.cptService.editCPTCode).toHaveBeenCalledWith(
      {
        name: 'Test Name',
        description: 'Test Description',
        code: '1234',
        amount: 99.99,
      },
      'codeId'
    );
    expect(component.snackBar.error).toHaveBeenCalledWith(
      'Update CPT Code failed !',
      2000
    );
  });
});
