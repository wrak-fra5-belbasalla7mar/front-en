import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { TeamComponent } from './components/team/team.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ManageCyclesComponent } from './components/manage-cycles/manage-cycles.component';
import { CreateKpiComponent } from './components/create-kpi/create-kpi.component';
import { AddObjectivesComponent } from './components/add-objectives/add-objectives.component';
import { JobOpeningsComponent } from './components/job-openings/job-openings.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobCvsComponent } from './components/job-cvs/job-cvs.component';
import { PostJobRequirementComponent } from './components/post-job-requirement/post-job-requirement.component';


export const routes: Routes = [
   { path: '', redirectTo: 'signin', pathMatch: 'full'},
   {path: 'signin',component: SignInComponent},
   {path: 'evaluation', component: EvaluationComponent}, 
   { path: 'create-kpi', component: CreateKpiComponent },
   { path: 'add-objectives/:userId/:cycleId', component: AddObjectivesComponent },
   {path: 'user', component: UserComponent},
   {path: 'team', component: TeamComponent},
   { path: 'job-openings', component: JobOpeningsComponent },
  { path: 'job-details/:id', component: JobDetailsComponent },
  { path: 'post-job', component: PostJobRequirementComponent },
  { path: 'job-cvs/:id', component: JobCvsComponent },
   {path: 'attendance', component: AttendanceComponent},
   { path: 'manage-cycles', component: ManageCyclesComponent }
   
];
