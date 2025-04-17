import { Component } from '@angular/core';
import { VacationService } from '../../services/vacation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-vacation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.css'] 
})
export class VacationComponent {
  startDate: string = '';
  endDate: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  userId!: number;
  userRole!: string;  
  vacationRequests: { requestId: number, userId: number, startDate: string, endDate: string, vacationStatus: string }[] = [];


  constructor(private vacationService: VacationService, private client: ClientService) {}

  ngOnInit() {
    this.loadVacationRequests();
    const user = this.client.getStoredUser();
    console.log(user);
    if (user?.id != null) {
      this.userId = user.id;
     
      this.userRole = user.role!;
       
    } else {
      this.isError = true;
      this.message = 'User not logged in';
    }
  }

 
  submitVacation() {
    this.isLoading = true;
    this.isError = false;
    this.message = '';

    this.vacationService.requestVacation(this.userId, this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.message = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.message = err.error || 'Failed to submit vacation request';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  approveVacation(vacationId: number) {
    console.log(vacationId);
    this.vacationService.approveVacation(vacationId).subscribe({
      next: () => {
        this.message = 'Vacation request approved!';
        this.isError = false;
        this.loadVacationRequests(); 
      },
      error: (err) => {
        this.message = 'Failed to approve vacation request.';
        this.isError = true;
      }
    });
  }


  rejectVacation(vacationId: number) {
    this.vacationService.rejectVacation(vacationId).subscribe({
      next: () => {
        this.message = 'Vacation request rejected!';
        this.isError = false;
        this.loadVacationRequests(); 
      },
      error: (err) => {
        this.message = 'Failed to reject vacation request.';
        this.isError = true;
      }
    });
  }

  loadVacationRequests() {
    this.isLoading = true; 
    const user = this.client.getStoredUser();
    this.userId=user?.id!;
    if (this.userRole === 'company_manager') {
      
      this.vacationService.getAllVacationRequests().subscribe({
        next: (requests) => {
          this.vacationRequests = requests; 
          this.isLoading = false; 
        },
        error: (err) => {
          this.isError = true; 
          this.message = 'Failed to load vacation requests'; 
          this.isLoading = false; 
        }
      });
    } 
    else {
      this.vacationService.getAllVacationRequestsByUserId(this.userId).subscribe({      
        next: (requests) => {
         
          this.vacationRequests = requests; 
          this.isLoading = false; 
        },
        error: (err) => {
          this.isError = true; 
          this.message = 'Failed to load your vacation requests'; 
          this.isLoading = false; 
        }
      });
    }
  }

}
