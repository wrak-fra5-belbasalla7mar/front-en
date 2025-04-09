import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftSidebarComponent } from './lift-sidebar.component';

describe('LiftSidebarComponent', () => {
  let component: LiftSidebarComponent;
  let fixture: ComponentFixture<LiftSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiftSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
