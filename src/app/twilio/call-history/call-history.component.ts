import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { SnackbarService } from '../services/snackbar.service';
import { CallHistoryDataSource } from './service/call-history-data-source';
import { CallHistoryService } from './service/call-history.service';

@Component({
	selector: 'app-call-history',
	templateUrl: './call-history.component.html',
	styleUrls: ['./call-history.component.scss'],
})
export class CallHistoryComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	displayedColumns: string[] = [
		'roomName',
		'sender',
		'reciever',
		'senderCallDuration',
		'recieverCallDuration',
		'typeOfCall',
		'patientName',
		'scheduleDate',
		'status',
	];
	pageSizeOptions = [10, 25, 100];
	pageIndex = 0;
	public dataSource: CallHistoryDataSource;
	public messageSuccess: boolean;

	constructor(
		private router: Router,
		public entityModalPopup: MatDialog,
		private callHistoryService: CallHistoryService,
		// private snackBarService: SnackbarService,
		private route: ActivatedRoute
	) {
		this.dataSource = new CallHistoryDataSource(this.callHistoryService);
	}
	ngOnInit(): void {
		this.dataSource.loadData(0);

		this.dataSource.totalElemObservable.subscribe((data) => {
			if (data > 0) {
				this.messageSuccess = true;
			} else if (data === 0) {
				this.messageSuccess = false;
			}
		});
	}

	public loadCallRecords(): void {
		this.dataSource.loadData(
			this.paginator.pageIndex,
			this.paginator.pageSize,
			this.sort.active,
			this.sort.direction
		);
	}

	ngAfterViewInit(): void {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(tap(() => this.loadCallRecords()))
			.subscribe();
	}
}
