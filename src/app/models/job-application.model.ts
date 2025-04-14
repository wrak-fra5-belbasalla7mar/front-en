import { Job } from './job.model';

export interface JobApplication {
  id?: number;
  userId: number;
  cv: string;
  submittedAt: string;
  notes?: string;
  job: Job;
}