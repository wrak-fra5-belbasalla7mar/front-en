import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HiringService } from '../../services/hiring.service';
import { UserService } from '../../services/user.service';
import { Job, Location, JobStatus } from '../../models/job.model';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-post-job-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-job-requirement.component.html',
  styleUrls: ['./post-job-requirement.component.css']
})
export class PostJobRequirementComponent implements OnInit {
  newJob: Job = {
    createdBy: 0,
    title: '',
    department: '',
    description: '',
    location: Location.REMOTE,
    requirements: '',
    status: JobStatus.OPEN,
    createdAt: new Date().toISOString()
  };
  jobs: Job[] = [];
  currentUser: UserModel | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  locations = Object.values(Location);

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

    if (this.currentUser.department !== 'HR') {
      this.errorMessage = 'Only HR users can access this page.';
      return;
    }

    this.newJob.createdBy = this.currentUser.id!;
    this.loadJobs();
  }

  loadJobs(): void {
    this.hiringService.getAllJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load jobs.';
      }
    });
  }

  addJob(): void {
    this.hiringService.addJob(this.newJob, this.currentUser!.id!).subscribe({
      next: (job) => {
        this.jobs.push(job);
        this.resetForm();
        this.successMessage = 'Job posted successfully!';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to post job.';
        this.successMessage = null;
      }
    });
  }

  updateJob(job: Job): void {
    this.hiringService.updateJob(job).subscribe({
      next: (updatedJob) => {
        const index = this.jobs.findIndex(j => j.id === updatedJob.id);
        if (index !== -1) {
          this.jobs[index] = updatedJob;
        }
        this.successMessage = 'Job updated successfully!';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to update job.';
        this.successMessage = null;
      }
    });
  }

  deleteJob(jobId: number): void {
    this.hiringService.deleteJob(jobId).subscribe({
      next: () => {
        this.jobs = this.jobs.filter(job => job.id !== jobId);
        this.successMessage = 'Job deleted successfully!';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete job.';
        this.successMessage = null;
      }
    });
  }

  toggleJobStatus(job: Job): void {
    if (job.status === JobStatus.OPEN) {
      this.hiringService.closeJob(job.id!).subscribe({
        next: () => {
          job.status = JobStatus.CLOSED;
          this.successMessage = 'Job closed successfully!';
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to close job.';
          this.successMessage = null;
        }
      });
    } else {
      this.hiringService.openJob(job.id!).subscribe({
        next: () => {
          job.status = JobStatus.OPEN;
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

  viewCvs(jobId: number): void {
    this.router.navigate(['/job-cvs', jobId]);
  }

  resetForm(): void {
    this.newJob = {
      createdBy: this.currentUser!.id!,
      title: '',
      department: '',
      description: '',
      location: Location.REMOTE,
      requirements: '',
      status: JobStatus.OPEN,
      createdAt: new Date().toISOString()
    };
  }
}