import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Sign Up</h2>
              
              <div *ngIf="isSuccessful" class="alert alert-success">
                Your registration is successful! Please <a routerLink="/login">login</a>.
              </div>
              
              <form *ngIf="!isSuccessful" (ngSubmit)="onSubmit()" #registerForm="ngForm">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    name="username"
                    [(ngModel)]="form.username"
                    required
                    minlength="3"
                    maxlength="20"
                    #username="ngModel"
                  />
                  <div *ngIf="username.errors && username.touched" class="text-danger mt-1">
                    <div *ngIf="username.errors['required']">Username is required!</div>
                    <div *ngIf="username.errors['minlength']">
                      Username must be at least 3 characters
                    </div>
                    <div *ngIf="username.errors['maxlength']">
                      Username must be at most 20 characters
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    [(ngModel)]="form.email"
                    required
                    email
                    #email="ngModel"
                  />
                  <div *ngIf="email.errors && email.touched" class="text-danger mt-1">
                    <div *ngIf="email.errors['required']">Email is required!</div>
                    <div *ngIf="email.errors['email']">
                      Email must be a valid email address
                    </div>
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

                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <div class="d-flex">
                    <div class="form-check me-4">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="role" 
                        id="roleUser" 
                        value="user"
                        [(ngModel)]="selectedRole"
                        checked
                      >
                      <label class="form-check-label" for="roleUser">
                        User
                      </label>
                    </div>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="role" 
                        id="roleAdmin" 
                        value="admin"
                        [(ngModel)]="selectedRole"
                      >
                      <label class="form-check-label" for="roleAdmin">
                        Admin
                      </label>
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button class="btn btn-primary" type="submit" [disabled]="registerForm.invalid">
                    Sign Up
                  </button>
                </div>
                
                <div class="mt-3 text-center">
                  <p>
                    Already have an account?
                    <a routerLink="/login" class="text-primary">Sign In</a>
                  </p>
                </div>
              </form>

              <div *ngIf="isSignUpFailed" class="alert alert-danger mt-3">
                Registration failed: {{ errorMessage }}
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
export class RegisterComponent {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  selectedRole: string = 'user';
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  onSubmit(): void {
    const { username, email, password } = this.form;
    const role = this.selectedRole === 'admin' ? ['admin'] : ['user'];

    this.authService.register({
      username,
      email,
      password,
      role
    }).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message || 'An error occurred during registration';
        this.isSignUpFailed = true;
      }
    });
  }
} 