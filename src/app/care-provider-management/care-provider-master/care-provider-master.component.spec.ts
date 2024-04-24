import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareProviderMasterComponent } from './care-provider-master.component';

describe('CareProviderMasterComponent', () => {
  let component: CareProviderMasterComponent;
  let fixture: ComponentFixture<CareProviderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareProviderMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareProviderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
