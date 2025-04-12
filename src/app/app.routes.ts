import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { TeamComponent } from './components/team/team.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ManageCyclesComponent } from './components/manage-cycles/manage-cycles.component';
import { CreateKpiComponent } from './components/create-kpi/create-kpi.component';


export const routes: Routes = [
   { path: '', redirectTo: 'signin', pathMatch: 'full'},
   {path: 'signin',component: SignInComponent},
   {path: 'evaluation', component: EvaluationComponent}, 
   { path: 'create-kpi', component: CreateKpiComponent },
   {path: 'user', component: UserComponent},
   {path: 'team', component: TeamComponent},
   {path: 'attendance', component: AttendanceComponent},
   { path: 'manage-cycles', component: ManageCyclesComponent }
   
];
