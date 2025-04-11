import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { TeamService } from './team.service';
import { Kpi, EvaluationKpi } from '../models/kpi.model';
import { TeamMember } from '../models/team-member.model';
import { Cycle } from '../models/cycle.model';
import { RatingRequest } from '../models/rating-request.model'; 
@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly API_URL = 'http://localhost:8083';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private teamService: TeamService
  ) {}

  // Get Cycles
  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`${this.API_URL}/cycles`).pipe(
      catchError(this.handleError('Failed to fetch evaluation cycles'))
    );
  }

  // Get KPIs For Cycle

  getKPIsByCycle(cycleId: number): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.API_URL}/kpis/cycle/${cycleId}`).pipe(
      catchError(this.handleError(`Failed to fetch KPIs for cycle ${cycleId}`))
    );
  }

  // Save Rating
  saveEvaluation(submitterId: number, member: TeamMember, evaluationKpis: EvaluationKpi[], cycleId: number): Observable<any> {
    const requests: Observable<any>[] = evaluationKpis.map(kpi => {
      const ratingRequest: RatingRequest = {
        submitterId: submitterId,
        ratedPersonId: member.userId,
        score: kpi.score,
        feedback: kpi.feedback || '',
        kpi: { id: kpi.kpi.id },
        cycle: { id: cycleId }
      };
      return this.http.post(`${this.API_URL}/ratings`, ratingRequest).pipe(
        catchError(this.handleError(`Failed to save evaluation for KPI ${kpi.kpi.id}`))
      );
    });

    return forkJoin(requests).pipe(
      catchError(err => {
        return throwError(() => new Error(err.message || 'Failed to save evaluations'));
      })
    );
  }

  private handleError(errorContext: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = errorContext;
      if (error.error instanceof ErrorEvent) {
        errorMessage += `: ${error.error.message}`;
      } else {
        errorMessage += `: Error Code ${error.status}, Message: ${error.message}`;
        if (error.status === 0) {
          errorMessage += ' (Possible network issue or server is down)';
        }
      }
      return throwError(() => new Error(errorMessage));
    };
  }
}