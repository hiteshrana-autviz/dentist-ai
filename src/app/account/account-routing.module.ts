import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginGuard } from '../core/gaurds/login.guard';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
 { path: 'login',
  // canActivate : [loginGuard],
  component: LoginComponent
},
{
  path: 'register',
  // canActivate : [loginGuard],
  component: RegistrationComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
