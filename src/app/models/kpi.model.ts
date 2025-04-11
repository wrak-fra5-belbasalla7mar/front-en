import { Cycle } from "./cycle.model";
export interface Kpi {
  id?: number;
  name: string;
  maxScore: number;
  cycle?: Cycle;
}
export interface EvaluationKpi {
  feedback: string;
  kpi: Kpi;
  score: number;
}