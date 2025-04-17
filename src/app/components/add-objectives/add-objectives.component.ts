import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { Objective } from '../../models/objective.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { TeamMember } from '../../models/team-member.model';
import { Cycle } from '../../models/cycle.model';
import { UserService } from '../../services/user.service';

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
  cycle: Cycle | null = null;
  newObjective: Objective = { 
    title: '', 
    description: '', 
    assignedUserId: 0, 
    cycleId: 0, 
    managerId: 0, 
    teamId: 0, 
    deadline: '', 
    completed: false, 
    state: 'OPEN' // Default state
  };
  teamMembers: TeamMember[] = [];
  selectedMemberId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService,
    private teamService: TeamService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('userId'));
      this.cycleId = Number(params.get('cycleId'));
      if (this.userId && this.cycleId) {
        this.newObjective.assignedUserId = this.userId; 
               this.newObjective.cycleId = this.cycleId;
        const user = this.userService.getUser();
        if (user) {
          this.newObjective.managerId = user.id;
          this.loadTeamMembers();
          this.loadCycle();
        }
      }
    });
  }

  loadCycle(): void {
    if (!this.cycleId) return;
    this.isLoading = true;
    this.evaluationService.getCycleById(this.cycleId).subscribe({
      next: (cycle: Cycle) => {
        this.cycle = cycle;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load cycle';
        this.isLoading = false;
      }
    });
  }

  loadTeamMembers(): void {
    if (!this.userId || !this.cycleId) return;
    this.isLoading = true;
    this.teamService.team$.subscribe(team => {
      if (team && team.members) {
        this.teamMembers = team.members.filter(member => member.userId !== this.userId);
        this.newObjective.teamId = team.id;
        this.isLoading = false;
      } else {
        this.errorMessage = 'Team data not available. Please ensure you are logged in';
        this.isLoading = false;
      }
    });
  }

  selectMember(memberId: number): void {
    this.selectedMemberId = memberId;
    this.newObjective.assignedUserId = memberId;
  }

  saveObjective(): void {
    if (!this.cycle || this.cycle.state !== 'OPEN') {
      this.errorMessage = 'Cycle must be OPEN to add objectives';
      return;
    }
    if (!this.newObjective.title || !this.newObjective.description || !this.newObjective.assignedUserId || !this.newObjective.cycleId || !this.newObjective.deadline || !this.newObjective.teamId || !this.newObjective.managerId || !this.newObjective.state) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }
    if (this.newObjective.title.length > 100) {
      this.errorMessage = 'Objective title cannot exceed 100 characters';
      return;
    }
    if (this.newObjective.description.length > 500) {
      this.errorMessage = 'Objective description cannot exceed 500 characters';
      return;
    }
    console.log('Sending objective:', this.newObjective);
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.evaluationService.assignObjective(this.newObjective).subscribe({
      next: (savedObjective: Objective) => {
        // Remove the assigned user from teamMembers
        this.teamMembers = this.teamMembers.filter(member => member.userId !== savedObjective.assignedUserId);
        this.newObjective.title = '';
        this.newObjective.description = '';
        this.newObjective.deadline = '';
        this.newObjective.state = 'OPEN'; 
        this.selectedMemberId = null;
        this.isLoading = false;
        this.successMessage = 'Objective added successfully';
      },
      error: (err) => {
        console.error('Error details:', err);
        this.errorMessage = err.error?.message || err.message || 'Failed to add objective';
        this.isLoading = false;
      }
    });
  }

  cancelObjective(): void {
    this.selectedMemberId = null;
    this.newObjective.title = '';
    this.newObjective.description = '';
    this.newObjective.deadline = '';
    this.newObjective.state = 'OPEN'; // Reset state
  }

  isTeamManager(): boolean {
    const user = this.userService.getUser();
    return user?.role === 'TEAM_MANAGER';
  }
}