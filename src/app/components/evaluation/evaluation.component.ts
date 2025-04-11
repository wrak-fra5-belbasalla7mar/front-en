import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../../models/team.model';
import { TeamMember } from '../../models/team-member.model';
import { Kpi, EvaluationKpi } from '../../models/kpi.model';

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

  constructor() {}

  ngOnInit(): void {
    this.team = {
      id: 1,
      teamName: 'Development Team',
      managerId: 1,
      members: [
        { userId: 1, name: 'Sarah Johnson', title: 'Senior UI Designer', level: 'Senior'},
        { userId: 2, name: 'Mike Chen', title: 'Developer', level: 'Mid' },
        { userId: 3, name: 'Emma Wilson', title: 'Product Manager', level: 'Lead' }
      ]
    };
  }

  selectMember(member: TeamMember): void {
    this.selectedMember = member;
    this.evaluationKpis = [
      { kpi: { id: 1, name: 'Communication Skills'}, score: 0 },
      { kpi: { id: 2, name: 'Technical Expertise'}, score: 0 },
      { kpi: { id: 3, name: 'Team Collaboration' }, score: 0 }
    ];
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
    const invalidKpi = this.evaluationKpis.find(kpi => kpi.score < 0 ||  kpi.score>5 );
    if (invalidKpi) {
      alert(`Invalid score for ${invalidKpi.kpi.name}. Score must be between 0 and 5`);
      return;
    }
    console.log('Evaluation for', this.selectedMember.name, ':', this.evaluationKpis);
    alert('Evaluation saved successfully! Check the console for details.');
    this.selectedMember = null;
    this.evaluationKpis = [];
  }
}