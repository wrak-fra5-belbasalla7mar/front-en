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
import { ClientService } from '../../services/client.service';

@Component({
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  constructor(
    private router:Router,
    private  teamService:TeamService,
    private userService:UserService,
    private clientService:ClientService
  )
   { }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      alert('Please fill in all fields correctly.');
      return;
    }
  
    const email = form.value.email;
    const password = form.value.password;
    this.clientService.login(email, password).subscribe((res: UserModel) => {
      this.userService.setUser({
        id: res.id,
        name: res.name,
        email: res.email,
        department: res.department,
        title: res.title,
        grossSalary: res.grossSalary,
        location: res.location,
        role: res.role,
      });
      if (res.id !== undefined) {
        this.teamService.loadTeam(res.id);
      } else {
        console.error('User ID is undefined.');
      }
      this.router.navigate(['/user']);
    });
  }
  
   
}


      
      


