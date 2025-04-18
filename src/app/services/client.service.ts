import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { UserResponse } from '../models/user-response-model';
import { UserModel } from '../models/user.model';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.get<UserResponse>('http://localhost:8080/login', {
      params: {
        email,
        password
      }
    }).pipe(
      switchMap((res: UserResponse) => {
        const user: UserModel = {
          id: res.id,
          name: res.name,
          email: res.mail,
          department: res.department.name,
          title: res.title,
          grossSalary: res.salaryGross,
          location: res.department.company.location,
          role: res.role,
        };

        return of(user);
      })
    );
  }
  getHistory(memberId: number) {
    return this.http.get<UserModel[]>('http://localhost:8080/manager/history', {
      params: { id: memberId.toString() }  
    });
  }
  getTeamMembers(memberId: number) {
    return this.http.get<Team>('http://localhost:8082/teams/team-members', {
      params: { memberId: memberId }
    });
  }
}
