import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  
  if (authService.isLoggedIn()) {
    authService.handleLoginRedirect();
    return false;
  }
  return true;
};
