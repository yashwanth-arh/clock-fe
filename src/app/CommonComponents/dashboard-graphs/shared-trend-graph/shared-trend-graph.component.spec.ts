import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTrendGraphComponent } from './shared-trend-graph.component';

describe('SharedTrendGraphComponent', () => {
  let component: SharedTrendGraphComponent;
  let fixture: ComponentFixture<SharedTrendGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTrendGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTrendGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
