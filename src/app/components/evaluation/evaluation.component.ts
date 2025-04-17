import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  cycles: Cycle[] = [];
  passedCycle: Cycle | null = null;
  otherCycles: Cycle[] = [];
  selectedOtherCycle: Cycle | null = null;
  teamMembers: TeamMember[] = [];
  selectedMember: TeamMember | null = null;
  kpis: Kpi[] = [];
  evaluationKpis: EvaluationKpi[] = [];
  currentUser: UserModel | null = null;
  team: Team | null = null;
  showEvaluationForm: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

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
          // Filter out the current user from the team members list
          this.teamMembers = (team.members || []).filter(
            member => member.userId !== this.currentUser!.id
          );
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
        this.cycles = cycles;
        this.passedCycle = cycles.find(cycle => cycle.state === 'PASSED') || null;
        this.otherCycles = cycles.filter(cycle => cycle.state !== 'PASSED');
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load cycles.';
      }
    });
  }

  startEvaluation(member: TeamMember): void {
    if (!this.passedCycle) {
      this.errorMessage = 'No passed cycle available for evaluation.';
      return;
    }

    this.selectedMember = member;
    this.showEvaluationForm = true;
    this.loadKPIsForCycle();
  }

  loadKPIsForCycle(): void {
    if (!this.passedCycle?.id) return;

    this.evaluationService.getKPIsByCycle(this.passedCycle.id).subscribe({
      next: (kpis) => {
        this.kpis = kpis;
        this.evaluationKpis = kpis.map(kpi => ({
          kpi,
          score: 0,
          feedback: ''
        }));
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load KPIs for this cycle.';
        this.showEvaluationForm = false;
      }
    });
  }

  saveEvaluation(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Please provide a score between 1 and 5 for all KPIs.';
      return;
    }

    if (!this.passedCycle || !this.selectedMember || !this.currentUser) {
      this.errorMessage = 'Missing required information to save evaluation.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

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
          this.successMessage = `Evaluation for ${this.selectedMember?.name} saved successfully!`;
          this.cancelEvaluation();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to save evaluation.';
          this.isLoading = false;
        }
      });
  }

  cancelEvaluation(): void {
    this.showEvaluationForm = false;
    this.selectedMember = null;
    this.kpis = [];
    this.evaluationKpis = [];
  }

  selectOtherCycle(cycle: Cycle): void {
    this.selectedOtherCycle = cycle;
    this.showEvaluationForm = false;
  }
}