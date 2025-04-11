import { Component } from '@angular/core';
import { TeamMemberRowComponent } from "../team-member-row/team-member-row.component";
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-team',
  imports: [TeamMemberRowComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
team!:Team
 constructor(private teamService:TeamService){
  this.team=this.teamService.getTeam()!;
 }
  

}
