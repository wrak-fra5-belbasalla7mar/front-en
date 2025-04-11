import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cycle } from '../models/cycle.model';
import { Kpi, EvaluationKpi } from '../models/kpi.model';
import { TeamMember } from '../models/team-member.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly API_URL = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  // Cycles
  createCycle(cycle: Cycle): Observable<Cycle> {
    return this.http.post<Cycle>(`${this.API_URL}/cycles`, cycle).pipe(
      catchError(this.handleError('Failed to create cycle'))
    );
  }

  passCycle(cycleId: number): Observable<Cycle> {
    return this.http.put<Cycle>(`${this.API_URL}/cycles/pass/${cycleId}`, {}).pipe(
      catchError(this.handleError('Failed to pass cycle'))
    );
  }

  closeCycle(cycleId: number): Observable<Cycle> {
    return this.http.put<Cycle>(`${this.API_URL}/cycles/close/${cycleId}`, {}).pipe(
      catchError(this.handleError('Failed to close cycle'))
    );
  }

  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`${this.API_URL}/cycles/Desc`).pipe(
      catchError(this.handleError('Failed to fetch cycles'))
    );
  }

  // KPIs
  getKPIsByCycle(cycleId: number): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.API_URL}/cycles/${cycleId}/kpis`).pipe(
      catchError(this.handleError('Failed to fetch KPIs for cycle'))
    );
  }

  saveEvaluation(
    evaluatorId: number,
    member: TeamMember,
    evaluationKpis: EvaluationKpi[],
    cycleId: number
  ): Observable<void> {
    const evaluationData = {
      evaluatorId,
      teamMemberId: member.userId,
      cycleId,
      kpiEvaluations: evaluationKpis.map(kpi => ({
        kpiId: kpi.kpi.id,
        score: kpi.score,
        feedback: kpi.feedback
      }))
    };
    return this.http.post<void>(`${this.API_URL}/evaluations`, evaluationData).pipe(
      catchError(this.handleError('Failed to save evaluation'))
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

export type { Cycle };

