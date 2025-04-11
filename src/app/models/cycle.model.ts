import { Kpi } from "./kpi.model";
export interface Cycle {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  state: 'OPEN' | 'PASSED' | 'CLOSED';
  companyManagerId: number;
  kpis?: Kpi[];
}