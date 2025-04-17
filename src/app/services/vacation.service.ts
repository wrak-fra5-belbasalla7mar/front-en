import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { VacationRequest } from '../models/vacation-request';

@Injectable({
  providedIn: 'root'
})
export class VacationService {

  private baseUrl = 'http://localhost:8081/vacation';

  constructor(private http: HttpClient) {}

  requestVacation(userId: number, startDate: string, endDate: string): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.post(this.baseUrl + '/request', null, { params, responseType: 'text' });
  }

  approveVacation(requestId: number): Observable<string> {
    const params = new HttpParams().set('requestId', requestId.toString());
    return this.http.post(this.baseUrl + '/approve-vacation', null, { params, responseType: 'text' })
      .pipe(
        tap(response => console.log('Response from API:', response)),
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  rejectVacation(requestId: number): Observable<string> {
    const params = new HttpParams().set('requestId', requestId);
    return this.http.post(this.baseUrl + '/reject-vacation', null, { params, responseType: 'text' });
  }
  getAllVacationRequests(): Observable<VacationRequest[]> {
    return this.http.get<VacationRequest[]>(`${this.baseUrl}/"all"`);  
  }

  getAllVacationRequestsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?id=${userId}`);
  }

}
