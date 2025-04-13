export interface Objective {
    id?: number;
    title: string;
    description?: string;
    assignedUserId: number;
    cycleId: number;
    completed?: boolean;
  }