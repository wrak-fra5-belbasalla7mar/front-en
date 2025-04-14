import { JobApplication } from "./job-application.model";

export enum Location {
    REMOTE = 'REMOTE',
    ONSITE = 'ONSITE',
    HYBRID = 'HYBRID'
  }
  
  export enum JobStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
  }
  
  export interface Job {
    id?: number;
    createdBy: number;
    title: string;
    department: string;
    description: string;
    location: Location;
    requirements: string;
    status: JobStatus;
    createdAt: string;
    applications?: JobApplication[];
  }