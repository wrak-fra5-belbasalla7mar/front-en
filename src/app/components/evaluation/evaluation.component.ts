import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationService } from '../../services/evaluation.service';
import { UserService } from '../../services/user.service';
import { TeamService } from '../../services/team.service';
import { TeamMember } from '../../models/team-member.model';
import { Kpi, EvaluationKpi } from '../../models/kpi.model';
import { Cycle } from '../../models/cycle.model';
import { UserModel } from '../../models/user.model';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  passedCycle: Cycle | null = null; 
  otherCycles: Cycle[] = [];
  selectedOtherCycle: Cycle | null = null;
  teamMembers: TeamMember[] = [];
  selectedMember: TeamMember | null = null;
  kpis: Kpi[] = [];
  evaluationKpis: EvaluationKpi[] = [];
  currentUser: UserModel | null = null;
  team: Team | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  showEvaluationForm: boolean = false;

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    if (!this.currentUser || !this.currentUser.id) {
      this.errorMessage = 'Please sign in to continue.';
      return;
    }

    this.teamService.team$.subscribe({
      next: (team) => {
        this.team = team;
        if (team) {
          this.teamMembers = team.members || [];
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load team.';
      }
    });

    this.loadCycles();
  }

  loadCycles(): void {
    this.evaluationService.getCycles().subscribe({
      next: (cycles) => {
        this.passedCycle = cycles.find(cycle => cycle.state === 'PASSED') || null;
        this.otherCycles = cycles.filter(cycle => cycle.state !== 'PASSED');
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load cycles.';
      }
    });
  }

  selectOtherCycle(cycle: Cycle): void {
    this.selectedOtherCycle = cycle;
    this.selectedMember = null;
    this.kpis = [];
    this.evaluationKpis = [];
    this.showEvaluationForm = false;
  }

  startEvaluation(member: TeamMember): void {
    this.selectedMember = member;
    if (this.passedCycle && this.selectedMember) {
      this.evaluationService.getKPIsByCycle(this.passedCycle.id!).subscribe({
        next: (kpis) => {
          this.kpis = kpis;
          this.evaluationKpis = kpis.map(kpi => ({
            kpi,
            score: 0,
            feedback: ''
          }));
          this.showEvaluationForm = true;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load KPIs.';
        }
      });
    }
  }

  saveEvaluation(): void {
    if (!this.passedCycle || !this.selectedMember || !this.currentUser) {
      this.errorMessage = 'Missing required data to save evaluation.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.evaluationService
      .saveEvaluation(
        this.currentUser.id!,
        this.selectedMember,
        this.evaluationKpis,
        this.passedCycle.id!
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to save evaluation.';
          this.isLoading = false;
        }
      });
  }

  resetForm(): void {
    this.selectedMember = null;
    this.kpis = [];
    this.evaluationKpis = [];
    this.showEvaluationForm = false;
  }

  cancelEvaluation(): void {
    this.selectedMember = null;
    this.kpis = [];
    this.evaluationKpis = [];
    this.showEvaluationForm = false;
  }
}