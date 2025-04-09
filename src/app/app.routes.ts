import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { TeamComponent } from './components/team/team.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { SignInComponent } from './components/sign-in/sign-in.component';


export const routes: Routes = [
   { path: '', redirectTo: 'signin', pathMatch: 'full'},
   {path: 'signin',component: SignInComponent},
   {path: 'user', component: UserComponent},
   {path: 'team', component: TeamComponent},
   {path: 'evaluation', component: EvaluationComponent},
   {path: 'attendance', component: AttendanceComponent}


];
