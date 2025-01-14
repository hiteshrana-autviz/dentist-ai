import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsPeriodontalChartListComponent } from './patients-periodontal-chart-list.component';

describe('PatientsPeriodontalChartListComponent', () => {
  let component: PatientsPeriodontalChartListComponent;
  let fixture: ComponentFixture<PatientsPeriodontalChartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsPeriodontalChartListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsPeriodontalChartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
