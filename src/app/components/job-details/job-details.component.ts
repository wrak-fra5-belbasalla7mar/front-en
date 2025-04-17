import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HiringService } from '../../services/hiring.service';
import { UserService } from '../../services/user.service';
import { Job, JobStatus } from '../../models/job.model';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  currentUser: UserModel | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  cvFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiringService: HiringService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    if (!this.currentUser || !this.currentUser.id) {
      this.errorMessage = 'Please sign in to continue.';
      return;
    }

    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadJobDetails(jobId);
  }

  loadJobDetails(jobId: number): void {
    this.hiringService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job;
        console.log('Job loaded:', this.job);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load job details.';
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cvFile = input.files[0];
      console.log('CV File selected:', this.cvFile);
    } else {
      this.cvFile = null;
      console.log('No file selected');
    }
  }

  applyForJob(): void {
    if (!this.job?.id || !this.currentUser?.id || !this.cvFile) {
      this.errorMessage = 'Please select a CV file to apply.';
      this.successMessage = null;
      return;
    }

    this.hiringService.applyForJob(this.job.id, this.currentUser.id, this.cvFile).subscribe({
      next: () => {
        this.successMessage = 'Your application has been submitted successfully!';
        this.errorMessage = null;
        this.cvFile = null;

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to submit application.';
        this.successMessage = null;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/job-openings']);
  }
}