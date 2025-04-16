import { Kpi } from "./kpi.model";
export interface Cycle {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  state?: 'OPEN' | 'PASSED' | 'CLOSED' | 'CREATED';
  companyManagerId: number;
  kpis?: Kpi[];
}