import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HiringService } from '../../services/hiring.service';
import { UserService } from '../../services/user.service';
import { JobApplication } from '../../models/job-application.model';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-job-cvs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-cvs.component.html',
  styleUrls: ['./job-cvs.component.css']
})
export class JobCvsComponent implements OnInit {
  applications: JobApplication[] = [];
  currentUser: UserModel | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

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

    if (this.currentUser.department !== 'HR') {
      this.errorMessage = 'Only HR users can access this page.';
      return;
    }

    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadApplications(jobId);
  }

  loadApplications(jobId: number): void {
    this.hiringService.getApplicationsByJobId(jobId).subscribe({
      next: (apps) => {
        this.applications = apps;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load applications.';
      }
    });
  }

  downloadCv(applicationId: number): void {
    this.hiringService.downloadCv(applicationId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv_${applicationId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to download CV.';
      }
    });
  }

  deleteApplication(applicationId: number): void {
    this.hiringService.deleteApplication(applicationId).subscribe({
      next: (response) => {
        this.applications = this.applications.filter(app => app.id !== applicationId);
        this.successMessage = response.message;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete application.';
        this.successMessage = null;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/job-openings']);
  }
}