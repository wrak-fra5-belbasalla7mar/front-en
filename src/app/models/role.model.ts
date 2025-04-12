import { Kpi } from "./kpi.model";
export interface Role {
  id?: number;
  name: string;
  level: string;
  kpis?: Kpi[];
}