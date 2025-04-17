import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AttendanceResponseDTO, LocationStatus } from '../models/attendance-response-dto';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://localhost:8081/attendance';

  constructor(private http: HttpClient) {}

  setAttendanceStatus(userId: number, status: LocationStatus): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('locationStatus', status);
    return this.http.post(this.baseUrl + '/set-status', null, { params, responseType: 'text' });
  }

  getDailyStatus(userId: number): Observable<AttendanceResponseDTO> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<AttendanceResponseDTO>(this.baseUrl + '/daily-status', { params });
  }

  getAttendanceHistory(userId: number): Observable<AttendanceResponseDTO> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<AttendanceResponseDTO>(this.baseUrl + '/history', { params });
  }
}
