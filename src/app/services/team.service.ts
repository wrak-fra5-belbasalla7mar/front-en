import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ClientService } from './client.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamSubject = new BehaviorSubject<Team | null>(null);
  team$ = this.teamSubject.asObservable();

  constructor(private clientService: ClientService) {}

  loadTeam(userId: number): void {
    this.clientService.getTeamMembers(userId).subscribe(team => {
      if (!team) return;

      const updatedTeam = { ...team };

      const memberRequests = updatedTeam.members.map(member =>
        this.clientService.getUser(member.userId).pipe(
          tap(user => {
            member.name = user.name;
            member.title = user.title;
            member.role = user.role;
          })
        )
      );

      forkJoin(memberRequests).subscribe(() => {
        this.teamSubject.next(updatedTeam); // updated with member info
      });
    });
  }
}
