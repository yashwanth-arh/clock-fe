import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Ticket, TicketResponse } from '../ticket/entities/tickets';
import { TicketService } from './ticket.service';

export class ClaimDataSource implements DataSource<Ticket>{

    private claimSubject = new BehaviorSubject<Ticket[]>([]);
    private totalElements = new BehaviorSubject<number>(0);
    public totalElemObservable = this.totalElements.asObservable();

    constructor(private ticketService: TicketService) { }

    connect(collectionViewer: CollectionViewer): Observable<Ticket[] | readonly Ticket[]> {
        return this.claimSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.claimSubject.complete();
        this.totalElements.complete();
    }

    loadClaims(pageNumber: number, pageSize = 10,sortColumn = 'createdAt', sortDirection = 'desc'): void {
        const sort = `${sortColumn},${sortDirection}`;
        this.ticketService.getAllRequest(pageNumber, pageSize,sort, sortDirection).pipe(
          catchError(() => of([])),
        ).subscribe((data: TicketResponse) => {
          const claimData: Ticket[] = data.content;
          this.claimSubject.next(claimData);
          this.totalElements.next(data.totalElements);
        });

      }

  }

