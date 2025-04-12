import { Cycle } from "./cycle.model";
import { Role } from "./role.model";
export interface Kpi {
  id?: number;
  name: string;
  cycle?: Cycle;
  roles?: Role[];
  maxScore?: number;
}
export interface EvaluationKpi {
  feedback: string;
  kpi: Kpi;
  score: number;
}