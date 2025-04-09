import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberRowComponent } from './team-member-row.component';

describe('TeamMemberRowComponent', () => {
  let component: TeamMemberRowComponent;
  let fixture: ComponentFixture<TeamMemberRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMemberRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMemberRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
