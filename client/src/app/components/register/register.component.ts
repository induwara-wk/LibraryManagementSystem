import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  selectedRole = 'user'; // Default to user role
  error = '';
  success = '';
  loading = false;

  // Available roles
  roles = [
    { value: 'user', label: 'User', description: 'Can view and search books' },
    { value: 'admin', label: 'Administrator', description: 'Can manage books and users' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    // Map frontend role to backend role format
    const roleArray = this.selectedRole === 'admin' ? ['admin'] : ['user'];

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      role: roleArray
    }).subscribe({
      next: (response) => {
        this.success = 'Registration successful! Please login.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
} 