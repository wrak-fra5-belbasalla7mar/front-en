import { Component, Input } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-team-member-row',
  imports: [RouterModule],
  templateUrl: './team-member-row.component.html',
  styleUrl: './team-member-row.component.css'
})
export class TeamMemberRowComponent {
  constructor(private router: Router) { }

updateUser(id: number) {
  this.router.navigate(['/edit', id]);
}
  @Input() member!:UserModel
}
