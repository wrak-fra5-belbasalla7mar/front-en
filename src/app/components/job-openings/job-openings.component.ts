import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HiringService } from '../../services/hiring.service';
import { UserService } from '../../services/user.service';
import { Job, JobStatus } from '../../models/job.model';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-job-openings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-openings.component.html',
  styleUrls: ['./job-openings.component.css']
})
export class JobOpeningsComponent implements OnInit {
  openJobs: Job[] = [];
  myPostedJobs: Job[] = [];
  currentUser: UserModel | null = null;
  isHr: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private hiringService: HiringService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    if (!this.currentUser || !this.currentUser.id) {
      this.errorMessage = 'Please sign in to continue.';
      return;
    }

    this.isHr = this.currentUser.department === 'HR';
    this.loadOpenJobs();
    if (this.isHr) {
      this.loadMyPostedJobs();
    }
  }

  loadOpenJobs(): void {
    this.hiringService.getOpenJobs().subscribe({
      next: (jobs) => {
        this.openJobs = jobs;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load open jobs.';
      }
    });
  }

  loadMyPostedJobs(): void {
    this.hiringService.getJobsByCreator(this.currentUser!.id!).subscribe({
      next: (jobs) => {
        this.myPostedJobs = jobs;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load your posted jobs.';
      }
    });
  }

  viewDetails(jobId: number): void {
    this.router.navigate(['/job-details', jobId]);
  }

  postNewJob(): void {
    this.router.navigate(['/post-job']);
  }

  viewCvs(jobId: number): void {
    this.router.navigate(['/job-cvs', jobId]);
  }

  updateJob(jobId: number): void {
    const job = this.openJobs.find(j => j.id === jobId) || this.myPostedJobs.find(j => j.id === jobId);
    if (!job) {
      this.errorMessage = 'Job not found.';
      return;
    }
    this.router.navigate(['/post-job'], { state: { job } });
  }

  deleteJob(jobId: number): void {
    const job = this.openJobs.find(j => j.id === jobId) || this.myPostedJobs.find(j => j.id === jobId);
    if (!job) {
      this.errorMessage = 'Job not found.';
      return;
    }

    if (job.createdBy !== this.currentUser!.id) {
      this.errorMessage = 'You can only delete jobs you posted.';
      return;
    }

    this.hiringService.deleteJob(jobId).subscribe({
      next: () => {
        this.openJobs = this.openJobs.filter(job => job.id !== jobId);
        this.myPostedJobs = this.myPostedJobs.filter(job => job.id !== jobId);
        this.successMessage = 'Job deleted successfully!';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete job.';
        this.successMessage = null;
      }
    });
  }

  closeJob(jobId: number): void {
    const jobInOpenJobs = this.openJobs.find(j => j.id === jobId);
    const jobInMyPostedJobs = this.myPostedJobs.find(j => j.id === jobId);
    if (!jobInOpenJobs || !jobInMyPostedJobs) {
      this.errorMessage = 'Job not found.';
      return;
    }

    if (jobInOpenJobs.createdBy !== this.currentUser!.id) {
      this.errorMessage = 'You can only close jobs you posted.';
      return;
    }

    this.hiringService.closeJob(jobId).subscribe({
      next: () => {
        this.openJobs = this.openJobs.filter(job => job.id !== jobId);
        jobInMyPostedJobs.status = JobStatus.CLOSED;
        this.successMessage = 'Job closed successfully!';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to close job.';
        this.successMessage = null;
      }
    });
  }

  openJob(jobId: number): void {
    const jobInMyPostedJobs = this.myPostedJobs.find(j => j.id === jobId);
    if (!jobInMyPostedJobs) {
      this.errorMessage = 'Job not found.';
      return;
    }

    if (jobInMyPostedJobs.createdBy !== this.currentUser!.id) {
      this.errorMessage = 'You can only open jobs you posted.';
      return;
    }

    this.hiringService.openJob(jobId).subscribe({
      next: () => {
        jobInMyPostedJobs.status = JobStatus.OPEN;
        this.openJobs.push({ ...jobInMyPostedJobs });
        this.successMessage = 'Job opened successfully!';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to open job.';
        this.successMessage = null;
      }
    });
  }
}