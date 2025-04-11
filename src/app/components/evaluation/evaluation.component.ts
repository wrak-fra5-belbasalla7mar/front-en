import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../../models/team.model';
import { TeamMember } from '../../models/team-member.model';
import { Kpi, EvaluationKpi } from '../../models/kpi.model';
import { Cycle } from '../../models/cycle.model';
import { UserService } from '../../services/user.service';
import { TeamService } from '../../services/team.service';
import { EvaluationService } from '../../services/evaluation.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  team: Team | null = null;
  selectedMember: TeamMember | null = null;
  evaluationKpis: EvaluationKpi[] = [];
  currentUser: UserModel | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  cycles: Cycle[] = [];
  selectedCycleId: number | null = null;

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {this.currentUser = user; });
    if (!this.currentUser) {
      this.errorMessage = 'Please sign in to continue.';
      return;
    }
  
    this.teamService.team$.subscribe(team => {
      this.team = team}); 
    if (!this.team) {
      this.errorMessage = 'No team found. Please contact support.';
      return;
    }
  
    this.isLoading = true;
    this.evaluationService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles.filter(cycle => cycle.state === 'PASSED');
        if (this.cycles.length > 0) {
          this.selectedCycleId = this.cycles[0].id ?? null;
          if (this.selectedCycleId !== null) {
            this.loadKPIs();
          } else {
            this.errorMessage = 'Selected cycle does not have a valid ID.';
            this.isLoading = false;
          }
        } else {
          this.errorMessage = 'No evaluation cycles available.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load evaluation cycles. Please try again.';
        this.isLoading = false;
        console.error('Error fetching cycles:', err);
      }
    });
  }
  loadKPIs(): void {
    if (!this.selectedCycleId) return;

    this.isLoading = true;
    this.evaluationKpis = [];
    this.evaluationService.getKPIsByCycle(this.selectedCycleId).subscribe({
      next: (kpis: Kpi[]) => {
        this.evaluationKpis = kpis.map((kpi: Kpi) => ({
          kpi: { ...kpi, maxScore: kpi.maxScore || 5 }, 
          score: 0,
          feedback: ''
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load KPIs for the selected cycle. Please try again.';
        this.isLoading = false;
        console.error('Error fetching KPIs:', err);
      }
    });
  }

  selectMember(member: TeamMember): void {
    this.selectedMember = member;
    this.evaluationKpis = this.evaluationKpis.map(kpi => ({
      ...kpi,
      score: 0,
      feedback: ''
    }));
    setTimeout(() => {
      const evaluationForm = document.querySelector('.col-md-8');
      if (evaluationForm && window.innerWidth <= 767) {
        evaluationForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }

  saveEvaluation(): void {
    if (!this.selectedMember) {
      alert('No member selected!');
      return;
    }
    if (!this.selectedCycleId) {
      alert('No evaluation cycle selected!');
      return;
    }
    const invalidKpi = this.evaluationKpis.find(kpi => kpi.score < 1 || kpi.score > (kpi.kpi.maxScore || 5));
    if (invalidKpi) {
      alert(`Invalid score for ${invalidKpi.kpi.name}. Score must be between 1 and ${invalidKpi.kpi.maxScore || 5}`);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.evaluationService.saveEvaluation(this.currentUser!.id, this.selectedMember, this.evaluationKpis, this.selectedCycleId).subscribe({
      next: () => {
        alert('Evaluation saved successfully!');
        this.selectedMember = null;
        this.evaluationKpis = this.evaluationKpis.map(kpi => ({
          ...kpi,
          score: 0,
          feedback: ''
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to save evaluation. Please try again.';
        this.isLoading = false;
        console.error('Error saving evaluation:', err);
      }
    });
  }
}