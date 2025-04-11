import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { BehaviorSubject } from 'rxjs';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
 private teamSubject=new BehaviorSubject<Team | null>(null);
 constructor(private clientService:ClientService) { }
  team$=this.teamSubject.asObservable();
  loadTeam(userId:number): void {
    this.clientService.getTeamMembers(userId).subscribe(team => {
      this.teamSubject.next(team); 
    });
  }
}
