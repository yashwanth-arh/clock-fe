import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import {
	CallHistory,
	CallHistoryResponse,
} from 'src/app/shared/entities/call-history';
import { CallHistoryService } from './call-history.service';

export class CallHistoryDataSource implements DataSource<CallHistory> {
	private historySubject = new BehaviorSubject<CallHistory[]>([]);
	private totalElements = new BehaviorSubject<number>(-1);
	public totalElemObservable = this.totalElements.asObservable();

	constructor(private callHistoryService: CallHistoryService) {}

	connect(collectionViewer: CollectionViewer): Observable<CallHistory[]> {
		return this.historySubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.historySubject.complete();
		this.totalElements.complete();
	}

	// eslint-disable-next-line max-len
	loadData(
		pageNumber: number,
		pageSize = 10,
		sortColumn = 'scheduleDate',
		sortDirection = 'desc',
		status = null,
		fromDate = null,
		toDate = null,
		searchQuery = null
	): any {
		sortDirection = sortDirection === '' ? 'desc' : sortDirection;
		const sort = `${sortColumn},${sortDirection}`;
		this.callHistoryService
			.getCallRecords(
				pageNumber,
				pageSize,
				sortColumn,
				sortDirection,
				status,
				fromDate,
				toDate,
				searchQuery
			)
			.pipe(catchError(() => of([])))
			.subscribe((data: CallHistoryResponse) => {
				const callData: CallHistory[] = data.content.filter(
					(callHistory: CallHistory) => callHistory.roomName !== null
				);
				this.historySubject.next(callData);
				this.totalElements.next(data.totalElements);
			});
	}

	searchCallHistory(
		pageNumber: number,
		pageSize: number,
		sortColumn = 'scheduleDate',
		sortDirection = 'desc',
		fromtDate: string,
		toDate: string,
		searchData: string
	): void {
		sortDirection = sortDirection === '' ? 'desc' : sortDirection;
		const sort = `${sortColumn},${sortDirection}`;
		this.callHistoryService.searchCallRecords(
			pageNumber,
			pageSize,
			sortColumn,
			sortDirection,
			fromtDate,
			toDate,
			searchData
		);
	}
}
