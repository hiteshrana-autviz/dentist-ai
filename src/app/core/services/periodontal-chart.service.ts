import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PeriodontalChart } from '../../interfaces/periodontal-chart';
import { AddOrUpdateTeethDto, Tooth } from '../../interfaces/tooth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeriodontalChartService {
  private apiUrl = `${environment.baseUrl}/api/PeriodontalChart`; // Adjust the base URL as necessary

  constructor(private http: HttpClient) {}

  // Get a chart by ID
  getChart(id: string, tenantId: string): Observable<any> {
    const url = `${this.apiUrl}/GetChart/${id}/${tenantId}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  // Get charts by patient ID
  getChartsByPatientId(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetChartsByPatientId/${patientId}`); // Call the GetChartsByPatientId endpoint
  }

  // Add a new chart
  addChart(chart: PeriodontalChart): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddChart`, chart);
  }

  // Update an existing chart
  updateChart(id: string, chart: PeriodontalChart): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateChart/${id}`, chart);
  }

  // Delete a chart
  deleteChart(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteChart/${id}`);
  }

  // Add or update teeth
  // addOrUpdateTeeth(patientId: string, teeth: Tooth[]): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/AddOrUpdateTeeth/${patientId}`, teeth);
  // }
  addOrUpdateTeeth(data: AddOrUpdateTeethDto): Observable<any> {
    const url = `${this.apiUrl}/AddOrUpdateTeeth`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, data, { headers });
  }

  getChartsByPatientAndTenantId(patientId: string, tenantId: string): Observable<any> {
    const params = new HttpParams()
      .set('patientId', patientId)
      .set('tenantId', tenantId);

    return this.http.get<any>(`${this.apiUrl}/GetChartsByPatientAndTenantId`, { params });
  }
}


