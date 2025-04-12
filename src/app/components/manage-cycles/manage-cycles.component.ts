import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationService } from '../../services/evaluation.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Cycle } from '../../models/cycle.model';
import { Kpi } from '../../models/kpi.model';
import { UserModel } from '../../models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-manage-cycles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-cycles.component.html',
  styleUrls: ['./manage-cycles.component.css']
})
export class ManageCyclesComponent implements OnInit {
  newCycle: Cycle = { name: '', startDate: '', endDate: '', state: 'OPEN', companyManagerId: 0 };
  cycles: Cycle[] = [];
  allKPIs: Kpi[] = [];
  selectedKPIs: number[] = [];
  editingCycleId: number | null = null;
  editingKPIs: number[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showKpiSelection: boolean = false;
  currentUser: UserModel | null = null;

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    console.log('Current user in ManageCyclesComponent:', this.currentUser); // Logging عشان نفهم إيه اللي بيحصل

    if (!this.currentUser) {
      this.errorMessage = 'Please sign in to continue.';
      return;
    }

    if (this.currentUser?.id) {
      this.newCycle.companyManagerId = this.currentUser.id;
    } else {
      console.warn('User ID not found, but user exists:', this.currentUser);
    }

    this.loadCycles();
    this.loadKPIs();
  }

  loadCycles(): void {
    this.isLoading = true;
    this.evaluationService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        this.cycles.forEach(cycle => {
          if (cycle.id) {
            this.evaluationService.getKPIsByCycle(cycle.id).subscribe({
              next: (kpis) => {
                cycle.kpis = kpis;
              },
              error: (err) => {
                console.error(`Failed to load KPIs for cycle ${cycle.id}:`, err);
              }
            });
          }
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load cycles.';
        this.isLoading = false;
      }
    });
  }

  loadKPIs(): void {
    this.evaluationService.getAllKPIs().subscribe({
      next: (kpis) => {
        this.allKPIs = kpis;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load KPIs.';
      }
    });
  }

  createCycle(): void {
    if (!this.newCycle.name || !this.newCycle.startDate || !this.newCycle.endDate || !this.newCycle.companyManagerId) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const startDate = new Date(this.newCycle.startDate);
    const endDate = new Date(this.newCycle.endDate);
    if (startDate >= endDate) {
      this.errorMessage = 'End date must be after start date.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.evaluationService.createCycle(this.newCycle).subscribe({
      next: (cycle) => {
        if (this.selectedKPIs.length > 0) {
          const assignRequests = this.selectedKPIs.map(kpiId =>
            this.evaluationService.assignKpiToCycle(kpiId, cycle.id!)
          );
          forkJoin(assignRequests).subscribe({
            next: () => {
              this.cycles.push(cycle);
              this.resetForm();
              this.isLoading = false;
              this.successMessage = 'Cycle created successfully.';
            },
            error: (err) => {
              this.errorMessage = err.message || 'Failed to assign KPIs to cycle.';
              this.isLoading = false;
            }
          });
        } else {
          this.cycles.push(cycle);
          this.resetForm();
          this.isLoading = false;
          this.successMessage = 'Cycle created successfully.';
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to create cycle.';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.newCycle = { name: '', startDate: '', endDate: '', state: 'OPEN', companyManagerId: this.currentUser?.id || 0 };
    this.selectedKPIs = [];
    this.showKpiSelection = false;
  }

  passCycle(cycleId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.evaluationService.passCycle(cycleId).subscribe({
      next: (updatedCycle) => {
        const index = this.cycles.findIndex(c => c.id === cycleId);
        if (index !== -1) {
          this.cycles[index] = updatedCycle;
        }
        this.isLoading = false;
        this.successMessage = 'Cycle passed successfully.';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to pass cycle.';
        this.isLoading = false;
      }
    });
  }

  closeCycle(cycleId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.evaluationService.closeCycle(cycleId).subscribe({
      next: (updatedCycle) => {
        const index = this.cycles.findIndex(c => c.id === cycleId);
        if (index !== -1) {
          this.cycles[index] = updatedCycle;
        }
        this.isLoading = false;
        this.successMessage = 'Cycle closed successfully.';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to close cycle.';
        this.isLoading = false;
      }
    });
  }

  startEditingKPIs(cycleId: number): void {
    this.editingCycleId = cycleId;
    this.editingKPIs = [];
    this.showKpiSelection = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

  saveKPIs(cycleId: number): void {
    if (this.editingKPIs.length === 0) {
      this.cancelEditing();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const assignRequests = this.editingKPIs.map(kpiId =>
      this.evaluationService.assignKpiToCycle(kpiId, cycleId)
    );
    forkJoin(assignRequests).subscribe({
      next: () => {
        this.loadCycles();
        this.cancelEditing();
        this.isLoading = false;
        this.successMessage = 'KPIs assigned successfully.';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to assign KPIs to cycle.';
        this.isLoading = false;
      }
    });
  }

  cancelEditing(): void {
    this.editingCycleId = null;
    this.editingKPIs = [];
    this.showKpiSelection = false;
  }

  navigateToCreateKPI(cycleId?: number): void {
    console.log('Navigating to Create KPI', { cycleId });
    if (cycleId) {
      this.router.navigate(['/create-kpi'], { queryParams: { cycleId } });
    } else {
      this.router.navigate(['/create-kpi']);
    }
  }

  onKpiChange(event: Event, kpiId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedKPIs.push(kpiId);
    } else {
      this.selectedKPIs = this.selectedKPIs.filter(id => id !== kpiId);
    }
  }

  onEditKpiChange(event: Event, kpiId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.editingKPIs.push(kpiId);
    } else {
      this.editingKPIs = this.editingKPIs.filter(id => id !== kpiId);
    }
  }

  isKpiSelectedForCycle(kpiId: number, cycle: Cycle): boolean {
    return cycle.kpis?.some(cycleKpi => cycleKpi.id === kpiId) || false;
  }
}