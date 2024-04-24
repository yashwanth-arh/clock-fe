import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareProviderDialogComponent } from './care-provider-dialog.component';

describe('CareProviderDialogComponent', () => {
  let component: CareProviderDialogComponent;
  let fixture: ComponentFixture<CareProviderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareProviderDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareProviderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
