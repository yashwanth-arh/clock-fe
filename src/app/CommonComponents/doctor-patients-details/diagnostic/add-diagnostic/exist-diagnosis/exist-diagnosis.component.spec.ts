import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistDiagnosisComponent } from './exist-diagnosis.component';

describe('ExistDiagnosisComponent', () => {
  let component: ExistDiagnosisComponent;
  let fixture: ComponentFixture<ExistDiagnosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistDiagnosisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
