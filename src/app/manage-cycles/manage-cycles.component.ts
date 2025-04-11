import { Component, OnInit } from '@angular/core';
import { EvaluationService, Cycle } from '../services/evaluation.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-cycles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-cycles.component.html',
  styleUrls: ['./manage-cycles.component.css']
})
export class ManageCyclesComponent implements OnInit {
  currentUser: any | null = null;
  cycles: Cycle[] = [];
  newCycle: Cycle = {
    name: '',
    startDate: '',
    endDate: '',
    state: 'OPEN',
    companyManagerId: 0
  };
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/sign-in']);
      return;
    }
    if (this.currentUser.role !== 'CompanyManager') {
      this.errorMessage = 'Only Company Managers can manage cycles.';
      return;
    }
    this.newCycle.companyManagerId = this.currentUser.id;
    this.loadCycles();
  }

  loadCycles(): void {
    this.isLoading = true;
    this.evaluationService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  createCycle(): void {
    this.isLoading = true;
    this.evaluationService.createCycle(this.newCycle).subscribe({
      next: () => {
        alert('Cycle created successfully!');
        this.newCycle = { name: '', startDate: '', endDate: '', state: 'OPEN', companyManagerId: this.currentUser.id };
        this.loadCycles();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  passCycle(cycleId: number): void {
    if (confirm('Are you sure you want to pass this cycle?')) {
      this.isLoading = true;
      this.evaluationService.passCycle(cycleId).subscribe({
        next: () => {
          alert('Cycle passed successfully!');
          this.loadCycles();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isLoading = false;
        }
      });
    }
  }

  closeCycle(cycleId: number): void {
    if (confirm('Are you sure you want to close this cycle? This will calculate average scores.')) {
      this.isLoading = true;
      this.evaluationService.closeCycle(cycleId).subscribe({
        next: () => {
          alert('Cycle closed successfully!');
          this.loadCycles();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isLoading = false;
        }
      });
    }
  }
}