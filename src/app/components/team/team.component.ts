import { Component } from '@angular/core';
import { TeamMemberRowComponent } from "../team-member-row/team-member-row.component";
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-team',
  standalone:true,
  imports: [TeamMemberRowComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
team!:Team
isAdmin=false;
 constructor(private teamService:TeamService,private userService:UserService) {
  this.teamService.team$.subscribe(team => {
    this.team = team!;
    this.isAdmin=this.userService.isAdmin;
  });
 }
  

}
