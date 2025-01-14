import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { NotificationsService } from '../../core/services/notifications.service';

import { finalize, takeUntil } from 'rxjs';
import { LoginResponse } from '../../interfaces/login-response';
import { AuthService } from '../../core/services/auth.service';
import { BaseDestroyCompoent } from '../../shared/utils/basedestroy';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseDestroyCompoent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string = '';
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _route: Router,
    private notificationService : NotificationsService,
    private _cdr : ChangeDetectorRef
  ) {
    super();
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  onSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.valid) {
      this.loading = true
      const { email, password } = this.loginForm.value;
      this._authService.login(email, password).pipe((takeUntil(this.destroy$) , finalize(()=>{
      }))).subscribe({
        next: (response: LoginResponse) => {
          this.loading = false;      
          this.notificationService.successToast("Login successful!")
          if (this._authService.isAuthenticated()) {  
            this._route.navigate(['/home']); 
            
          }
          
          this._cdr.detectChanges();

        },
        error: (err) => {
          this.loading = false
          this.notificationService.errorAlert(err.error?.message || 'Login failed. Please check your credentials.');
        },
      });
    }else{
      this.notificationService.errorAlert('Please enter valid credentials.');
    }
  }
  navigateToRegister(){
    this._route.navigate(['/account/register']); 
  }

  showPwd() {
    this.showPassword = !this.showPassword;
  }
  get f() {
    return this.loginForm.controls;
  }
  resetPassword() {
    // Redirect to the reset password page
    this._route.navigate(['/account/reset-password']); // Adjust the route as necessary
  }
}
