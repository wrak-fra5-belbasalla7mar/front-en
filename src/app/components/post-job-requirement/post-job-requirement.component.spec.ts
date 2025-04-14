import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobRequirementComponent } from './post-job-requirement.component';

describe('PostJobRequirementComponent', () => {
  let component: PostJobRequirementComponent;
  let fixture: ComponentFixture<PostJobRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostJobRequirementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostJobRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
