import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { TeamComponent } from './components/team/team.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ManageCyclesComponent } from './manage-cycles/manage-cycles.component';


export const routes: Routes = [
   { path: '', redirectTo: 'ManageCyclesComponent', pathMatch: 'full'},
   {path: 'evaluation', component: EvaluationComponent},
   { path: 'manage-cycles', component: ManageCyclesComponent },
   {path: 'user', component: UserComponent},
   {path: 'team', component: TeamComponent},
   {path: 'attendance', component: AttendanceComponent},
   {path: 'signin',component: SignInComponent}

];
