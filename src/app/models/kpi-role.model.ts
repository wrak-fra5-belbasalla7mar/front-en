import { Kpi } from "./kpi.model";
import { LevelEnum } from "./level.enum";
export interface KpiRole {
    id?: number;
    kpi: Kpi;
    role: { name: string; level: LevelEnum };
    weight: number;
  }