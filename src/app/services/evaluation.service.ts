import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service'; 
import { TeamService } from '../services/team.service';


@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly API_URL ='http://localhost:8083/ratings' ;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private teamService: TeamService
  ) {}

}
