import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogHistoryTabsComponent } from './log-history-tabs.component';

describe('LogHistoryTabsComponent', () => {
  let component: LogHistoryTabsComponent;
  let fixture: ComponentFixture<LogHistoryTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogHistoryTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogHistoryTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
