import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarePlansListComponent } from './care-plans-list.component';

describe('CarePlansListComponent', () => {
  let component: CarePlansListComponent;
  let fixture: ComponentFixture<CarePlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarePlansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarePlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
