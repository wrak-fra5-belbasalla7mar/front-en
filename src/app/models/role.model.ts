import { Kpi } from "./kpi.model";
import { LevelEnum } from "./level.enum";
export interface Role {
  id?: number;
  name: string;
  level: LevelEnum;
  kpis?: Kpi[];
}