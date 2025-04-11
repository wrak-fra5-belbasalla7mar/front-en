export interface Kpi {
  id: number;
  name: string;
}

export interface EvaluationKpi {
  kpi: Kpi;
  score: number;
}