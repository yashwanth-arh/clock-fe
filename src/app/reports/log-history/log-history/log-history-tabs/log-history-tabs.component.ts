import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { LogHistoryService } from 'src/app/reports/service/log-history.service';
import { LogHistoryDataSource } from '../log-history-data-source';

@Component({
  selector: 'app-log-history-tabs',
  templateUrl: './log-history-tabs.component.html',
  styleUrls: ['./log-history-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LogHistoryTabsComponent implements OnInit {
  logForm: FormGroup;
  logCount: any;
  public dataSource: LogHistoryDataSource;
  messageSuccess: boolean;
  isEnableGlobalSearch: boolean;
  showValidTextMessage = false;

  constructor(
    private service: LogHistoryService,
    public fb: FormBuilder,
    private snackBarService: SnackbarService
  ) {
    this.dataSource = new LogHistoryDataSource(
      this.service,
      this.snackBarService
    );
  }

  ngOnInit(): void {
    this.logForm = this.fb.group({
      searchQuery: [''],
    });
  }
  public doSomething(date: any): void {
    this.logCount = date;
  }

  getTabDetails(e) {}
}
