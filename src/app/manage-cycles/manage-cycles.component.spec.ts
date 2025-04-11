import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCyclesComponent } from './manage-cycles.component';

describe('ManageCyclesComponent', () => {
  let component: ManageCyclesComponent;
  let fixture: ComponentFixture<ManageCyclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCyclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCyclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
