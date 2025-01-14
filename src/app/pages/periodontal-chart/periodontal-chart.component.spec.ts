import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodontalChartComponent } from './periodontal-chart.component';

describe('PeriodontalChartComponent', () => {
  let component: PeriodontalChartComponent;
  let fixture: ComponentFixture<PeriodontalChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodontalChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodontalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
