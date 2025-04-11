export interface RatingRequest {
    submitterId: number;
    ratedPersonId: number;
    score: number;
    feedback?: string;
    kpi: { id: number };
    cycle: { id: number };
  }