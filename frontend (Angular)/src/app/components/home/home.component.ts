import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <h1 class="display-4 mb-4">Library Management System</h1>
          <p class="lead mb-5">Welcome to our comprehensive library management system. Please log in or register to continue.</p>
          
          <div class="d-flex justify-content-center gap-3">
            <a routerLink="/login" class="btn btn-primary btn-lg">Login</a>
            <a routerLink="/register" class="btn btn-outline-primary btn-lg">Register</a>
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
    
    h1 {
      color: #333;
      margin-bottom: 1.5rem;
    }
    
    .btn {
      padding: 0.5rem 2rem;
    }
  `]
})
export class HomeComponent {

}
