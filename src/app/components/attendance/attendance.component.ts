import { Component } from '@angular/core';
import { LocationStatus } from '../../models/attendance-response-dto';
import { AttendanceService } from '../../services/attendance.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-attendance',
  imports: [FormsModule,CommonModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
  standalone: true,
})
export class AttendanceComponent {
  
  status: 'Absent'|'Remote'|'OnSite'='OnSite';
  
  
  message: string = '';
  isLoading: boolean = false;
  isError: boolean = false;
  userId!: number ;
  constructor(private attendanceService: AttendanceService , private client:ClientService) {}
  

  ngOnInit() {
    const user = this.client.getStoredUser();
    console.log(user);
    if (user?.id != null) {
      this.userId = user.id;
    } else {
      this.isError = true;
      this.message = 'User is not logged in';
    }
  }

  submitStatus() {
    this.isLoading = true;
    this.message = '';
    this.isError = false;

    this.attendanceService.setAttendanceStatus(this.userId, this.status).subscribe({
      next: (response) => {
        this.message = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.message = error.message || 'Failed to update attendance status';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

}
