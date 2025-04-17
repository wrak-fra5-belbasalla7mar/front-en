import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';
import { JobApplication } from '../models/job-application.model';

@Injectable({
  providedIn: 'root'
})
export class HiringService {
  private apiUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  getOpenJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/open`);
  }

  getJobsByCreator(userId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/creator/${userId}`);
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`);
  }

  addJob(job: Job, createdBy: number): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs?createdBy=${createdBy}`, job);
  }

  updateJob(job: Job): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/jobs`, job);
  }

  deleteJob(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/jobs/${id}`);
  }

  openJob(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/jobs/open/${id}`, {});
  }

  closeJob(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/jobs/close/${id}`, {});
  }

  applyForJob(jobId: number, userId: number, cvFile: File): Observable<JobApplication> {
    const formData = new FormData();
    formData.append('jobId', jobId.toString());
    formData.append('userId', userId.toString());
    formData.append('cv_file', cvFile);
    return this.http.post<JobApplication>(`${this.apiUrl}/applications`, formData);
  }

  getApplicationsByJobId(jobId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/applications/job/${jobId}`);
  }

  downloadCv(applicationId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/applications/cv/${applicationId}`, {
      responseType: 'blob'
    });
  }

  deleteApplication(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/applications/${id}`);
  }
}