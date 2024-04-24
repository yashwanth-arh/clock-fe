import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareCoordinatorComponent } from './care-coordinator.component';

describe('CareCoordinatorComponent', () => {
  let component: CareCoordinatorComponent;
  let fixture: ComponentFixture<CareCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareCoordinatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
