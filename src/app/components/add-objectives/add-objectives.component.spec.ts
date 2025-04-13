import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObjectivesComponent } from './add-objectives.component';

describe('AddObjectivesComponent', () => {
  let component: AddObjectivesComponent;
  let fixture: ComponentFixture<AddObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddObjectivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
