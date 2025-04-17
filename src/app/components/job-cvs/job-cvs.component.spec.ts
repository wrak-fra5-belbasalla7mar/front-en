import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCvsComponent } from './job-cvs.component';

describe('JobCvsComponent', () => {
  let component: JobCvsComponent;
  let fixture: ComponentFixture<JobCvsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCvsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
