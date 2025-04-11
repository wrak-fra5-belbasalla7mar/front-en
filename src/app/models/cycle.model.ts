export interface Cycle {
    id: number;
    startDate: string; 
    endDate: string;
    state: 'OPENED' | 'PASSED' | 'CLOSED';
  }