import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { UserService } from '../../services/user.service';
import { Cycle } from '../../models/cycle.model';
import { Kpi } from '../../models/kpi.model';
import { Role } from '../../models/role.model';
import { UserModel } from '../../models/user.model';
import { LevelEnum } from '../../models/level.enum';

@Component({
  selector: 'app-manage-cycles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-cycles.component.html',
  styleUrls: ['./manage-cycles.component.css']
})
export class ManageCyclesComponent implements OnInit {
  newCycle: Cycle = { name: '', startDate: '', endDate: '', companyManagerId: 0 };
  cycles: Cycle[] = [];
  allKPIs: Kpi[] = [];
  allRoles: Role[] = [];
  selectedKPIs: number[] = [];
  selectedRoles: { role: Role | null; weight: number }[] = [];
  editingCycleId: number | null = null;
  editingKPIs: number[] = [];
  newKpi: Kpi = { name: '' };
  newRole: Role = { name: '', level: LevelEnum.FRESH };
  showKpiForm = false;
  showAddRoleForm = false;
  showKpiSelection = false;
  loadingStates: { [cycleId: number]: boolean } = {}; // Track loading state per cycle
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: UserModel | null = null;
  levelOptions = Object.values(LevelEnum);

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    console.log('Current User:', this.currentUser);
    if (!this.currentUser || !this.currentUser.id) {
      this.errorMessage = 'User not logged in or ID missing.';
    } else {
      this.newCycle.companyManagerId = this.currentUser.id;
    }
    this.loadCycles();
    this.loadKPIs();
    this.loadRoles();
  }

  isCompanyManager(): boolean {
    const user = this.userService.getUser();
    return user?.role === 'COMPANY_MANAGER';
  }

  isTeamManager(): boolean {
    const user = this.userService.getUser();
    return user?.role === 'TEAM_MANAGER';
  }

  loadCycles(): void {
    this.evaluationService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        console.log('Cycles loaded:', this.cycles);
        cycles.forEach(cycle => {
          if (cycle.id) {
            this.evaluationService.getKPIsByCycle(cycle.id).subscribe({
              next: (kpis) => cycle.kpis = kpis,
              error: () => {}
            });
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load cycles.';
      }
    });
  }

  loadKPIs(): void {
    this.evaluationService.getAllKPIs().subscribe({
      next: (kpis) => this.allKPIs = kpis,
      error: (err) => this.errorMessage = err.message
    });
  }

  loadRoles(): void {
    this.evaluationService.getAllRoles().subscribe({
      next: (roles) => this.allRoles = roles,
      error: (err) => this.errorMessage = err.message
    });
  }

  toggleKpiForm(): void {
    this.showKpiForm = !this.showKpiForm;
  }

  toggleAddRoleForm(): void {
    this.showAddRoleForm = !this.showAddRoleForm;
  }

  addRoleEntry(): void {
    this.selectedRoles.push({ role: null, weight: 1.0 });
  }

  removeRoleEntry(index: number): void {
    this.selectedRoles.splice(index, 1);
  }

  createRole(): void {
    if (!this.newRole.name || !this.newRole.level) {
      this.errorMessage = 'Enter role name and level.';
      return;
    }

    this.evaluationService.createRole(this.newRole).subscribe({
      next: (role) => {
        this.allRoles.push(role);
        this.newRole = { name: '', level: LevelEnum.FRESH };
        this.showAddRoleForm = false;
        this.successMessage = 'Role created.';
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  createKpiAndAssign(): void {
    const userId = this.currentUser?.id;
    if (!this.newKpi.name || !userId) {
      this.errorMessage = 'Enter KPI name.';
      return;
    }

    this.evaluationService.createKPI(this.newKpi, userId).subscribe({
      next: (kpi) => {
        const roleRequests = this.selectedRoles
          .filter(entry => entry.role)
          .map(entry => this.evaluationService.assignKpiToRole(
            kpi.id!, entry.role!.name, entry.role!.level, entry.weight
          ));

        Promise.all(roleRequests).then(() => {
          this.successMessage = 'KPI created and roles assigned.';
          this.loadKPIs();
          this.resetForm();
        }).catch(err => {
          this.errorMessage = err.message || 'Failed to assign roles.';
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to create KPI.';
      }
    });
  }

  createCycle(): void {
    if (!this.newCycle.name || !this.newCycle.startDate || !this.newCycle.endDate) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    this.evaluationService.createCycle(this.newCycle).subscribe({
      next: (cycle) => {
        const assignRequests = this.selectedKPIs.map(kpiId =>
          this.evaluationService.assignKpiToCycle(kpiId, cycle.id!)
        );

        Promise.all(assignRequests).then(() => {
          this.cycles.push(cycle);
          this.resetForm();
          this.successMessage = 'Cycle created successfully.';
        }).catch((err) => {
          this.errorMessage = err.message;
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to create cycle.';
      }
    });
  }

  downloadReport(cycleId: number): void {
    this.loadingStates[cycleId] = true; // Set loading for this specific cycle
    this.evaluationService.downloadReport(cycleId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cycle_report_${cycleId}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        this.successMessage = 'Report downloaded successfully.';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to download report';
      },
      complete: () => {
        this.loadingStates[cycleId] = false; // Reset loading for this cycle
      }
    });
  }

  resetForm(): void {
    this.newKpi = { name: '' };
    this.selectedRoles = [];
    this.selectedKPIs = [];
    this.showKpiForm = false;
    this.showAddRoleForm = false;
    this.errorMessage = null;
    this.successMessage = null;
  }

  onKpiChange(event: Event, kpiId: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedKPIs.push(kpiId);
    } else {
      this.selectedKPIs = this.selectedKPIs.filter(id => id !== kpiId);
    }
  }
}