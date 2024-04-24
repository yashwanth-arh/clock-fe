import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { Observable } from 'rxjs';
import { Ticket, TicketResponse } from './entities/tickets';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  public apiBaseUrl: string;
  public baseResource: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authStateService: AuthStateService
  ) {
    this.authStateService.baseResource.subscribe((res) => {
      // this.apiBaseUrl = this.authService.generateBaseUrl('PROFILE');
      // this.apiBaseUrl += `/${res}`;
      this.baseResource = res;
    });
  }

  getAllRequest(
    pageNumber = 0,
    pageSize = 10,
    sortColumn = 'lastUpdatedAt',
    sortDirection = 'desc',
    searchQuery = null
  ): Observable<TicketResponse> {
    const sort = `${sortColumn},${sortDirection}`;
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sort);

    if (searchQuery != null) {
      params = params.set('searchQuery', searchQuery);
    }
    return this.http.get<any>(`${this.apiBaseUrl}/request`, { params }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addRequestChat(params): Observable<Ticket> {
    return this.http.post<any>(`${this.apiBaseUrl}/request`, params).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getRequestById(
    requestId,
    size = 50,
    sortColumn = 'chatDate',
    sortDirection = 'asc'
  ): Observable<Ticket> {
    const sort = `${sortColumn},${sortDirection}`;
    return this.http
      .get<any>(`${this.apiBaseUrl}/requestchats/${requestId}`, {
        params: new HttpParams().set('size', size.toString()).set('sort', sort),
      })
      .pipe(
        map((data) => {
          return data.content;
        })
      );
  }

  addRequest(params): Observable<Ticket> {
    return this.http.post<any>(`${this.apiBaseUrl}/requestchats`, params).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getRequestByPatientId(patientId): Observable<Ticket> {
    return this.http
      .get<any>(`${this.apiBaseUrl}/request/bypatient/${patientId}`)
      .pipe(
        map((data) => {
          return data.content;
        })
      );
  }
  getSupportTickets() {
    return this.http.get<any>(`${this.apiBaseUrl}/getSupportTickets`).pipe(
      map((data) => {
        return data.content;
      })
    );
  }
  deleteTicketAttachmentById(id) {
    return this.http
      .delete<any>(`${this.apiBaseUrl}/deleteSupportTicketAttachments/${id}`)
      .pipe(
        map((data) => {
          return data.content;
        })
      );
  }
  uploadTicketAttachmentById(value) {
    return this.http
      .post<any>(`${this.apiBaseUrl}/addTicketAttachment`, value)
      .pipe(
        map((data) => {
          return data.content;
        })
      );
  }
  getSupportTicketsFilter(searchData) {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/getSupportTickets?searchQuery=${searchData}`
      )
      .pipe(
        map((data) => {
          return data.content;
        })
      );
  }
  createTicket(body) {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/${environment.data_collection_service}/${this.baseResource}/createSupportTicketAttachments`,
        body
      )
      .pipe(
        map((data) => {
          return data.content;
        })
      );
  }
  getAllTitles() {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/${environment.data_service}/${this.baseResource}/getAllDefaultSupportIssues`
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateTicket(body, id) {
    return this.http
      .put<any>(`${this.apiBaseUrl}/updateSupportTicketAttachments/${id}`, body)
      .pipe(
        map((data) => {
          return data.content;
        })
      );
  }
}
