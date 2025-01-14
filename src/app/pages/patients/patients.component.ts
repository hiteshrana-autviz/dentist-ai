import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

import { PatientService } from '../../core/services/patient.service';
import { SessionService } from '../../core/services/session.service';
import { UserDto } from '../../interfaces/user-dto';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginatedResult } from '../../interfaces/paginated-result';
import { Patient, PatientDto } from '../../interfaces/patient';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../core/services/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [TableModule, CommonModule, DialogModule, ButtonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss',
  providers: [DatePipe],
})
export class PatientsComponent {
  patients: PatientDto[] = [];
  totalPatients: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  patientDialogVisible: boolean = false;
  isEditMode: boolean = false;
  selectedPatient: PatientDto = {} as PatientDto;
  user: UserDto | undefined;
  selectDob: string = '';
  searchTerm?: string;
  nextPatientId: any;

  constructor(
    private patientService: PatientService,
    private sessionService: SessionService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionService.getCurrentUser().subscribe((res) => {
      this.user = res.data;
      console.log(this.user);
      if (this.user) this.loadPatients();
    });
    this.loadPatients();
  }
  onSearch(value: any) {
    if (value.target.value == null || value.target.value == '') {
      this.searchTerm = undefined;
    } else {
      this.searchTerm = value.target.value?.trim();
    }
    this.loadPatients();
  }
  loadPatients(): void {
    if (this.user) {
      this.patientService
        .getPatientsByDoctorIdsWithPagination(
          [this.user.id],
          this.user.tenantId,
          this.pageNumber,
          this.pageSize,
          this.searchTerm
        )
        .subscribe(
          (response: PaginatedResult<PatientDto>) => {
            this.patients = response.patients.sort(); // Access patients array correctly
            this.totalPatients = response.totalCount;
            this.getNextPatientId(); // Total count from the paginated result
          },
          (error) => {
            this.patients = []; // Access patients array correctly
            this.totalPatients = 0;
            console.error(error);
          }
        );
    }
  }
  getNextPatientId() {
    if (this.user)
      this.patientService
        .getNextPatientId(this.user?.tenantId, this.user.id)
        .subscribe((res) => {
          this.nextPatientId = res;
        });
  }
  onPageChange(event: any): void {
    const page = event.first / event.rows;
    const limit = event.rows;
    this.pageNumber = page + 1;
    this.pageSize = limit;
    this.loadPatients();
  }

  openAddPatientDialog(): void {
    this.isEditMode = false;
    this.selectedPatient = {} as PatientDto;
    this.selectDob = ''; // Reset selected patient
    this.selectedPatient.patientId = this.nextPatientId;
    this.patientDialogVisible = true;
  }

  openEditPatientDialog(patient: PatientDto): void {
    this.isEditMode = true;
    this.selectedPatient = { ...patient };
    this.selectDob = this.formatDate(this.selectedPatient.dateOfBirth); // Copy the patient data into selectedPatient
    this.patientDialogVisible = true;
  }

  closeDialog(): void {
    this.patientDialogVisible = false;
  }

  savePatient(): void {
    if (this.user)
      (this.selectedPatient.doctorId = this.user?.id),
        (this.selectedPatient.tenantId = this.user?.tenantId);
    this.selectedPatient.dateOfBirth = this.selectDob;
    if (this.isEditMode) {
      if (!this.selectedPatient?.id) {
        this.notificationService.errorAlert('Patient ID is required');
        return; // or handle the error as needed
      }

      this.patientService
        .updatePatient(this.selectedPatient.id, this.selectedPatient)
        .subscribe(
          () => {
            this.loadPatients();
            this.closeDialog();
            this.notificationService.successAlert(
              'Patient updated successfully'
            );
          },
          (err) => {
            this.closeDialog();
            this.notificationService.warningAlert(err.error.message);
          }
        );
    } else {
      this.patientService.addPatient(this.selectedPatient).subscribe({
        next: (response) => {
          if (response.success) {
            // Show success message using PrimeNG message service
            this.notificationService.successAlert(response.message);
            this.patientDialogVisible = false;
            this.isEditMode = false;
            this.loadPatients();
            // Reset form or perform any other necessary actions
          } else {
            // Show failure message using PrimeNG message service
            this.notificationService.warningAlert(response.message);
          }
        },
        error: (error) => {
          this.patientDialogVisible = false;
          this.isEditMode = false;
          this.notificationService.warningAlert(error.error.message);
        },
      });
    }
  }

  formatDate(date: any): string {
    // Ensure the date is a valid Date object
    const dateObj = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  isFormValid(): boolean {
    return (
      !!this.selectedPatient.name &&
      !!this.selectedPatient.patientId &&
      !!this.selectDob &&
      !!this.selectedPatient.phone
    );
  }
  navigateToPeriodontalChartList(patientId: string) {
    // this.router.navigate(['periodontal-chart-list'], { queryParams: { patientId: patientId } });
    this.router.navigate(['periodontal-chart'], { queryParams: {  patientId: patientId } });
  }
  
}
