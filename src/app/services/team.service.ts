import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
 private teamSubject=new BehaviorSubject<Team | null>(null);
  team$=this.teamSubject.asObservable();
  setTeam(team:Team){
    this.teamSubject.next(team);
  }
  getTeam():Team | null {
    return this.teamSubject.getValue();
  }
  
  constructor() { }
}
