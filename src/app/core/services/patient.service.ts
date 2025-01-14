import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient, PatientDto } from '../../interfaces/patient';
import { PaginatedResult } from '../../interfaces/paginated-result';
 // Define the paginated result model for pagination

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = `${environment.baseUrl}/api/patient`; // API base URL

  constructor(private http: HttpClient) { }

  // Get patient by Id and tenantId
  getPatientById(id: string, tenantId: string): Observable<Patient> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.get<Patient>(`${this.apiUrl}/GetPatient/${id}`, { params });
  }

  // Get patients by tenantId
  getPatientsByTenantId(tenantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetPatientsByTenantId/${tenantId}`);
  }

  // Add a new patient
  addPatient(patient: PatientDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddPatient`, patient);
  }

  // Update a patient
  updatePatient(id: string, patient: PatientDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdatePatient/${id}`, patient);
  }

  // Delete a patient
  deletePatient(id: string, tenantId: string): Observable<any> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.delete(`${this.apiUrl}/DeletePatient/${id}`, { params });
  }

  // Get patient by patientId (different field for identification)
  getPatientByPatientId(patientId: number, tenantId: string): Observable<Patient> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.get<Patient>(`${this.apiUrl}/GetPatientByPatientIdAsync/${patientId}`, { params });
  }
  getNextPatientId(tenantId: string, doctorId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/NextpatientId/${tenantId}/${doctorId}`);
  }
  // Get patients by doctor IDs with pagination
  getPatientsByDoctorIdsWithPagination(doctorIds: string[], tenantId: string, pageNumber: number = 1, pageSize: number = 10,  searchTerm?: string): Observable<PaginatedResult<PatientDto>> {
    let params = new HttpParams()
      .set('tenantId', tenantId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString()
    );

    doctorIds.forEach((id, index) => {
      params = params.set(`doctorIds[${index}]`, id);
    });
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
  }
    return this.http.get<PaginatedResult<PatientDto>>(`${this.apiUrl}/GetPatientsByDoctorIdsWithPagination`, { params });
  }
}
