export interface Kpi {
  id: number;
  name: string;
  maxScore: number;
}

export interface EvaluationKpi {
  feedback: string;
  kpi: Kpi;
  score: number;
}