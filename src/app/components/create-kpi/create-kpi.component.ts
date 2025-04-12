import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationService } from '../../services/evaluation.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from '../../models/role.model';
import { UserModel } from '../../models/user.model';
import { Kpi } from '../../models/kpi.model';
import { Cycle } from '../../models/cycle.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-kpi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-kpi.component.html',
  styleUrls: ['./create-kpi.component.css']
})
export class CreateKpiComponent implements OnInit {
  newKPI: Kpi = { name: '' };
  selectedCycleId: number | null = null;
  cycles: Cycle[] = [];
  allRoles: Role[] = [];
  selectedRoles: { role: Role | null; weight: number }[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: UserModel | null = null;
  showAddRoleForm: boolean = false;
  newRole: Role = { name: '', level: '' };

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    // console.log('Current user in CreateKpiComponent:', this.currentUser); 


    if (!this.currentUser) {
      this.errorMessage = 'Please sign in to continue.';
      return;
    }

    this.route.queryParams.subscribe(params => {
      const cycleId = params['cycleId'];
      if (cycleId) {
        this.selectedCycleId = +cycleId;
      }
    });

    this.loadCycles();
    this.loadRoles();
  }

  loadCycles(): void {
    this.evaluationService.getCycles().subscribe({
      next: (cycles) => {
        console.log('Cycles loaded from API:', cycles);
        this.cycles = cycles;
        const passedCycle = this.cycles.find(cycle => cycle.state === 'PASSED');
        if (passedCycle && passedCycle.id) {
          this.selectedCycleId = passedCycle.id;
        } else if (this.cycles.length > 0 && this.cycles[0].id) {
          this.selectedCycleId = this.cycles[0].id;
        }
      },
      error: (err) => {
        console.error('Error loading cycles:', err);
        this.errorMessage = err.message || 'Failed to load cycles.';
      }
    });
  }

  loadRoles(): void {
    this.evaluationService.getAllRoles().subscribe({
      next: (roles) => {
        console.log('Roles loaded from API:', roles);
        this.allRoles = roles;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.errorMessage = err.message || 'Failed to load roles.';
      }
    });
  }

  showAddRole(): void {
    this.showAddRoleForm = true;
    this.newRole = { name: '', level: '' };
    this.errorMessage = null;
    this.successMessage = null;
  }

  cancelAddRole(): void {
    this.showAddRoleForm = false;
    this.newRole = { name: '', level: '' };
  }

  saveNewRole(): void {
    if (!this.newRole.name || !this.newRole.level) {
      this.errorMessage = 'Please fill in both name and level for the new role.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.evaluationService.createRole(this.newRole).subscribe({
      next: (role) => {
        this.allRoles.push(role);
        this.showAddRoleForm = false;
        this.newRole = { name: '', level: '' };
        this.isLoading = false;
        this.successMessage = 'Role created successfully.';
      },
      error: (err: { message: string; }) => {
        this.errorMessage = err.message || 'Failed to create role.';
        this.isLoading = false;
      }
    });
  }

  addRole(): void {
    this.selectedRoles.push({ role: null, weight: 1.0 });
  }

  removeRole(index: number): void {
    this.selectedRoles.splice(index, 1);
  }

  createKPI(): void {
    if (!this.newKPI.name || !this.selectedCycleId) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;


    const userId = this.currentUser?.id;
    if (!userId) {
      this.errorMessage = 'User ID not found. Please sign in again.';
      this.isLoading = false;
      return;
    }

    this.evaluationService.createKPI(this.newKPI, userId).subscribe({
      next: (kpi) => {
        this.evaluationService.assignKpiToCycle(kpi.id!, this.selectedCycleId!).subscribe({
          next: () => {
            if (this.selectedRoles.length > 0) {
              const validRoles = this.selectedRoles.filter(sr => sr.role !== null);
              if (validRoles.length === 0) {
                this.isLoading = false;
                this.router.navigate(['/manage-cycles']);
                return;
              }
              const assignRoleRequests = validRoles.map(role =>
                this.evaluationService.assignKpiToRole(
                  kpi.id!,
                  role.role!.name,
                  role.role!.level,
                  role.weight
                )
              );
              forkJoin(assignRoleRequests).subscribe({
                next: () => {
                  this.isLoading = false;
                  this.successMessage = 'KPI created and roles assigned successfully.';
                  this.router.navigate(['/manage-cycles']);
                },
                error: (err) => {
                  this.errorMessage = err.message || 'Failed to assign roles to KPI.';
                  this.isLoading = false;
                }
              });
            } else {
              this.isLoading = false;
              this.successMessage = 'KPI created successfully.';
              this.router.navigate(['/manage-cycles']);
            }
          },
          error: (err) => {
            this.errorMessage = err.message || 'Failed to assign KPI to cycle.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to create KPI.';
        this.isLoading = false;
      }
    });
  }
}