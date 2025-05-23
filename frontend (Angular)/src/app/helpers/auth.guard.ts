import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    router.navigate(['/user/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn() && !authService.isAdmin()) {
    return true;
  }

  if (authService.isLoggedIn() && authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
}; 