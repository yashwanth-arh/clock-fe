import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Comment } from 'src/app/shared/entities/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  public baseApiUrl: string;
  public providersCommentFlag: BehaviorSubject<number>;
  public commentCategory: BehaviorSubject<string | null>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private authStateService: AuthStateService
  ) {
    this.commentCategory = new BehaviorSubject(null);

    this.authStateService.baseResource.subscribe((res) => {
      this.baseApiUrl = this.authService.generateBaseUrl('PROFILE');
      this.baseApiUrl += `/${res}`;
    });
    // this.baseApiUrl = this.authService.generateBaseUrl('PROFILE');
    this.providersCommentFlag = new BehaviorSubject(0);
  }

  get commentFlag(): Observable<number> {
    return this.providersCommentFlag.asObservable();
  }

  setCommentFlag(value: number): void {
    this.providersCommentFlag.next(value);
  }

  get CommentCategory(): Observable<string | null> {
    return this.commentCategory.asObservable();
  }

  setCommentCategory(value: string): void {
    this.commentCategory.next(value);
  }

  /**
   * get comments by Patient Id
   */
  getCommentsByPatient(patientId: string): Observable<Comment[]> {
    return this.http
      .get<Observable<Comment[]>>(`${this.baseApiUrl}/comments/${patientId}`)
      .pipe(
        map((res) => res),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  /**
   * get comment by patient id & device type (category)
   */

  getCommentsByPatientAndCategory(
    patientId: string,
    category: string
  ): Observable<Comment[]> {
    return this.http
      .get<Observable<Comment[]>>(
        `${this.baseApiUrl}/comments/${patientId}/${category}`
      )
      .pipe(
        map((res) => res),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  /**
   *  get default comments by category (device type)
   */
  getDefaultCommentsByCategory(category: string): Observable<Comment[]> {
    return this.http
      .get<Observable<Comment[]>>(
        `${this.baseApiUrl}/commenttemplates/${category}`
      )
      .pipe(
        map((res) => res),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  /**
   * Add comments (authorized for doctors)
   */

  addComments(comments: Comment): Observable<Comment> {
    return this.http
      .post<Observable<Comment>>(
        `${this.baseApiUrl}/commenttemplates`,
        comments
      )
      .pipe(
        map((res) => res),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }

  deleteDefaultComment(id: string): Observable<Comment[]> {
    return this.http
      .delete<Observable<Comment[]>>(
        `${this.baseApiUrl}/commenttemplates/${id}`
      )
      .pipe(
        map((res) => res),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
  editDefaultComment(id: string, body): Observable<Comment[]> {
    return this.http
      .put<Observable<Comment[]>>(
        `${this.baseApiUrl}/commenttemplates/${id}`,
        body
      )
      .pipe(
        map((res) => res),
        catchError((errorResponse) => {
          return of(errorResponse);
        })
      );
  }
}
