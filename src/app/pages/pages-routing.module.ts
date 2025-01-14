import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeriodontalChartComponent } from './periodontal-chart/periodontal-chart.component';
import { PatientsComponent } from './patients/patients.component';
import { AddPatientComponent } from './patients/add-patient/add-patient.component';
import { EditPatientComponent } from './patients/edit-patient/edit-patient.component';
import { HomeComponent } from './home/home.component';
import { PatientsPeriodontalChartListComponent } from './periodontal-chart/patients-periodontal-chart-list/patients-periodontal-chart-list.component';

const routes: Routes = [

  { path: 'home', component: PatientsComponent },
  // { path: 'periodontal-chart-list', component: PatientsPeriodontalChartListComponent },
  // { path: 'periodontal-chart', component: PeriodontalChartComponent },
  // { path: 'patient-list', component: PatientsComponent },
  // { path: 'add-patient', component: AddPatientComponent },
  // { path: 'edit-patient', component: EditPatientComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
