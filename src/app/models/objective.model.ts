export interface Objective {
  id?: number;
  title: string;
  description: string;
  assignedUserId: number;
  cycleId: number;
  managerId: number;
  teamId: number;
  deadline: string;
  completed: boolean;
  state: 'OPEN' | 'COMPLETED' | 'IN_PROGRESS';
}