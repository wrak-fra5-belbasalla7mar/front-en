import { Component, Input } from '@angular/core';
import { ManagerServiceService } from '../../services/manager-service.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../models/user-response-model';
import { UserRequestModel } from '../../models/user.request.model';

@Component({
  selector: 'app-add-edit-user',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.css'
})
export class AddEditUserComponent {
userId: number|undefined;
  constructor(private managerService:ManagerServiceService,
    private route:ActivatedRoute,
  ) { } 

  ngOnInit() {
    this.userId=this.route.snapshot.params['id'];
  }
  onSubmit(form: NgForm): void {
    
  
    const value = form.value;
  
    const user: UserRequestModel = {
      name: value.name,
      title: value.title,
      role: value.role,
      mail: value.mail,
      password: value.password,
      phone: value.phone,
      salaryGross: parseFloat(value.salaryGross),
      level: value.level,
      salaryNet: 0, // Set this if you calculate it based on gross
      manager: {
        id: parseInt(value.managerId),
      },
      department: {
        id: parseInt(value.departmentId),
      }
    };
    console.log(user);
    if(this.userId==undefined){
      if (form.invalid) {
        alert('Please fill in all required fields correctly.');
        return;
      }
      this.managerService.addUser(user).subscribe((res) => {
        alert(res);
        form.resetForm(); // Reset the form after successful submission
      });
    }
    else{
      this.managerService.updateUser(this.userId,user).subscribe((res) => {
        alert(res);
      });
      form.resetForm();
    }

  
  }
  
}
