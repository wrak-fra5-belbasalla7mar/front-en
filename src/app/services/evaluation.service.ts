import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cycle } from '../models/cycle.model';
import { Kpi, EvaluationKpi } from '../models/kpi.model';
import { TeamMember } from '../models/team-member.model';
import { Role } from '../models/role.model';
import { Team } from '../models/team.model';
import { Objective } from '../models/objective.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly API_URL = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  // Cycles
  createCycle(cycle: Cycle): Observable<Cycle> {
    return this.http.post<Cycle>(`${this.API_URL}/cycles`, cycle)
      .pipe(catchError(this.handleError('Failed to create cycle')));
  }

  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`${this.API_URL}/cycles`)
      .pipe(catchError(this.handleError('Failed to fetch cycles')));
  }

  passCycle(cycleId: number): Observable<Cycle> {
    return this.http.put<Cycle>(`${this.API_URL}/cycles/pass/${cycleId}`, {})
      .pipe(catchError(this.handleError('Failed to pass cycle')));
  }

  closeCycle(cycleId: number): Observable<Cycle> {
    return this.http.put<Cycle>(`${this.API_URL}/cycles/close/${cycleId}`, {})
      .pipe(catchError(this.handleError('Failed to close cycle')));
  }

  // KPIs
  getAllKPIs(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.API_URL}/kpis`)
      .pipe(catchError(this.handleError('Failed to fetch all KPIs')));
  }

  getKPIsByCycle(cycleId: number): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.API_URL}/kpis/cycle/${cycleId}`)
      .pipe(catchError(this.handleError('Failed to fetch KPIs for cycle')));
  }

  createKPI(kpi: Kpi, userId: number): Observable<Kpi> {
    return this.http.post<Kpi>(`${this.API_URL}/kpis/${userId}`, kpi)
      .pipe(catchError(this.handleError('Failed to create KPI')));
  }

  assignKpiToCycle(kpiId: number, cycleId: number): Observable<Kpi> {
    return this.http.put<Kpi>(`${this.API_URL}/kpis/${kpiId}/cycle/${cycleId}`, {})
      .pipe(catchError(this.handleError('Failed to assign KPI to cycle')));
  }

  assignKpiToRole(kpiId: number, roleName: string, roleLevel: string, weight: number): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/kpis/${kpiId}/role/${roleName}/${roleLevel}`,
      {},
      { params: { weight: weight.toString() } }
    ).pipe(catchError(this.handleError('Failed to assign KPI to role')));
  }

  // Roles
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`)
      .pipe(catchError(this.handleError('Failed to fetch roles')));
  }

  getRoleByNameAndLevel(name: string, level: string): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/roles/${name}/${level}`)
      .pipe(catchError(this.handleError('Failed to fetch role')));
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.API_URL}/roles`, role)
      .pipe(catchError(this.handleError('Failed to create role')));
  }

  // Evaluation
  saveEvaluation(
    submitterId: number,
    member: TeamMember,
    evaluationKpis: EvaluationKpi[],
    cycleId: number
  ): Observable<void[]> {
    const ratingRequests = evaluationKpis.map(kpi => {
      const ratingData = {
        kpi: { id: kpi.kpi.id },
        submitterId: submitterId,
        ratedPersonId: member.userId,
        score: kpi.score,
        feedback: kpi.feedback
      };
      return this.http.post<void>(`${this.API_URL}/ratings`, ratingData);
    });

    return forkJoin(ratingRequests)
      .pipe(catchError(this.handleError('Failed to save evaluation')));
  }

  // Teams
  getTeamsByManager(managerId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.API_URL}/teams/manager/${managerId}`)
      .pipe(catchError(this.handleError('Failed to fetch teams')));
  }

  getTeamMembersByTeamAndCycle(teamId: number, cycleId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.API_URL}/team-members/team/${teamId}/cycle/${cycleId}`)
      .pipe(catchError(this.handleError('Failed to fetch team members')));
  }

  // Objectives
  assignObjective(objective: Objective): Observable<Objective> {
    return this.http.post<Objective>(`${this.API_URL}/objectives`, objective)
      .pipe(catchError(this.handleError('Failed to assign objective')));
  }

  getObjectivesByUserId(userId: number): Observable<Objective[]> {
    return this.http.get<Objective[]>(`${this.API_URL}/objectives/${userId}`)
      .pipe(catchError(this.handleError('Failed to fetch objectives')));
  }

  // Error Handler
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
