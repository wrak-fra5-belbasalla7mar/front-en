import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../../models/user-response-model';
import { UserModel } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Team } from '../../models/team.model';
import { switchMap } from 'rxjs';
import { TeamService } from '../../services/team.service';
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  constructor(private http:HttpClient,
    private router:Router,
    private TeamService:TeamService,
    private userService:UserService) { }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      alert('Please fill in all fields correctly.');
      return;
    }
  
    const email = form.value.email;
    const password = form.value.password;
  
    this.http.get<UserResponse>('http://localhost:8080/login', {
      params: { email, password }
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
  
        this.userService.setUser(user);
  
        // Now call the second API
        return this.http.get<Team>('http://localhost:8082/teams/team-members', {
          params: { memberId: res.id }
        });
      })
    ).subscribe({
      next: (team: Team) => {
        console.log('Team data:', team);
        this.TeamService.setUser(team);
        this.router.navigate(['/user']);
      },
      error: (err) => {
        alert('Error: ' + (err.message || 'Unknown error'));
      }
    });
  }
      
}


