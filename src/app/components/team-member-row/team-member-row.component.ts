import { Component, Input } from '@angular/core';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-team-member-row',
  imports: [],
  templateUrl: './team-member-row.component.html',
  styleUrl: './team-member-row.component.css'
})
export class TeamMemberRowComponent {
  @Input() member!:UserModel
}
