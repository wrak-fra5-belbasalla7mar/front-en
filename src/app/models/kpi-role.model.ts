import { Kpi } from "./kpi.model";
export interface KpiRole {
    id?: number;
    kpi: Kpi;
    role: { name: string; level: string };
    weight: number;
  }