import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { EvaluationService } from '../../services/evaluation.service';
import { Objective } from '../../models/objective.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-objectives',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './add-objectives.component.html',
  styleUrls: ['./add-objectives.component.css']
})
export class AddObjectivesComponent implements OnInit {
  userId: number | null = null;
  cycleId: number | null = null;
  newObjective: Objective = { title: '', description: '', assignedUserId: 0, cycleId: 0, completed: false };
  objectives: Objective[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('userId'));
      this.cycleId = Number(params.get('cycleId'));
      this.newObjective.assignedUserId = this.userId!;
      this.newObjective.cycleId = this.cycleId!;
      this.loadObjectives();
    });
  }

  loadObjectives(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.evaluationService.getObjectivesByUserId(this.userId).subscribe({
      next: (objectives: Objective[]) => {
        this.objectives = objectives.filter(obj => obj.cycleId === this.cycleId);
        this.isLoading = false;
      },
      error: (err: { message: string }) => {
        this.errorMessage = err.message || 'Failed to load objectives.';
        this.isLoading = false;
      }
    });
  }

  saveObjective(): void {
    if (!this.newObjective.title) {
      this.errorMessage = 'Objective title is required.';
      return;
    }

    if (this.newObjective.title.length > 100) {
      this.errorMessage = 'Objective title cannot exceed 100 characters.';
      return;
    }

    if (this.newObjective.description && this.newObjective.description.length > 500) {
      this.errorMessage = 'Objective description cannot exceed 500 characters.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.evaluationService.assignObjective(this.newObjective).subscribe({
      next: (savedObjective: Objective) => {
        this.objectives.push(savedObjective);
        this.newObjective.title = '';
        this.newObjective.description = '';
        this.isLoading = false;
        this.successMessage = 'Objective added successfully.';
      },
      error: (err: { message: string }) => {
        this.errorMessage = err.message || 'Failed to add objective.';
        this.isLoading = false;
      }
    });
  }
}