
import { Component, Input } from '@angular/core';
import { PeriodontalChartService } from '../../../core/services/periodontal-chart.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients-periodontal-chart-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients-periodontal-chart-list.component.html',
  styleUrl: './patients-periodontal-chart-list.component.scss',
  providers : [DatePipe]
})
export class PatientsPeriodontalChartListComponent {
  @Input() patientId: string =''; 
  tenantId:  string | null ='';
  charts: any[] = [];
  constructor(private chartService : PeriodontalChartService,
    private authService : AuthService,
    private router : Router
    
  ){
  this.tenantId = this.authService.getTenantIdFromCookie();
  }
  ngOnInit(): void {
    this.loadCharts();  
  }
loadCharts(): void {
  if(this.tenantId)
    this.chartService.getChartsByPatientAndTenantId(this.patientId, this.tenantId)
      .subscribe({
        next: (response) => {
          if (response?.success) {
            this.charts = response.charts;
            console.log('Charts retrieved successfully', this.charts);
          } else {
            console.error('Failed to retrieve charts:', response?.Message);
          }
        },
        error: (error) => {
          console.error('Error fetching charts:', error);
        }
      });
  }

  viewChart(chartId: string) {
    this.router.navigate(['periodontal-chart'], { queryParams: { chartId: chartId, patientId: this.patientId } });
    // Navigate to the chart details page or perform other actions
  }
  
  
  addNewReport() {
    this.router.navigate(['periodontal-chart'], { queryParams: {  patientId: this.patientId } });
    // Open a modal or redirect to a report creation form
  }
}
