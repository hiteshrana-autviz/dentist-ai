import { TestBed } from '@angular/core/testing';

import { PeriodontalChartService } from './periodontal-chart.service';

describe('PeriodontalChartService', () => {
  let service: PeriodontalChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodontalChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
