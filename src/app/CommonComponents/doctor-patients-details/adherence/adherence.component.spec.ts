import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdherenceComponent } from './adherence.component';

describe('AdherenceComponent', () => {
  let component: AdherenceComponent;
  let fixture: ComponentFixture<AdherenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdherenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdherenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
