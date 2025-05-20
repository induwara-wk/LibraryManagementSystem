import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Sign In</h2>
              
              <div *ngIf="isLoggedIn" class="alert alert-success">
                Logged in as {{ username }}.
              </div>
              
              <form *ngIf="!isLoggedIn" (ngSubmit)="onSubmit()" #loginForm="ngForm">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    name="username"
                    [(ngModel)]="form.username"
                    required
                    #username="ngModel"
                  />
                  <div *ngIf="username.errors && username.touched" class="text-danger mt-1">
                    Username is required!
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    [(ngModel)]="form.password"
                    required
                    minlength="6"
                    #password="ngModel"
                  />
                  <div *ngIf="password.errors && password.touched" class="text-danger mt-1">
                    <div *ngIf="password.errors['required']">Password is required!</div>
                    <div *ngIf="password.errors['minlength']">
                      Password must be at least 6 characters
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button class="btn btn-primary" type="submit" [disabled]="loginForm.invalid">
                    Sign In
                  </button>
                </div>
                
                <div class="mt-3 text-center">
                  <p>
                    Don't have an account?
                    <a routerLink="/register" class="text-primary">Sign Up</a>
                  </p>
                </div>
              </form>

              <div *ngIf="isLoginFailed" class="alert alert-danger mt-3">
                Login failed: {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .card {
      border-radius: 10px;
      border: none;
    }
    
    .btn-primary {
      background-color: #6366F1;
      border-color: #6366F1;
    }
    
    .btn-primary:hover {
      background-color: #4F46E5;
      border-color: #4F46E5;
    }
  `]
})
export class LoginComponent {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  username?: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      const user = this.authService.currentUserValue;
      this.roles = user?.roles || [];
      this.username = user?.username;
      
      // Redirect if already logged in
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/books']);
      }
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login({ username, password }).subscribe({
      next: data => {
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = data.roles;
        this.username = data.username;
        
        // Redirect to admin dashboard if admin, otherwise to user dashboard
        if (this.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: err => {
        this.errorMessage = err.error.message || 'An error occurred during login';
        this.isLoginFailed = true;
      }
    });
  }
} 