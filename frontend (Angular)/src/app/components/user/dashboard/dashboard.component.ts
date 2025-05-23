import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="book-title mb-0">Books</h2>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th scope="col">TITLE</th>
                  <th scope="col">AUTHOR</th>
                  <th scope="col">ISBN</th>
                  <th scope="col">DATE PUBLISHED</th>
                  <th scope="col">PAGES</th>
                  <th scope="col" class="text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let book of books">
                  <td>{{ book.title }}</td>
                  <td>{{ book.author }}</td>
                  <td>{{ book.isbn }}</td>
                  <td>{{ book.publishedDate | date:'yyyy-MM-dd' }}</td>
                  <td>{{ book.numberOfPages }}</td>
                  <td class="text-center">
                    <button class="btn btn-primary view-book-btn" (click)="viewBook(book)">View book</button>
                  </td>
                </tr>
                <tr *ngIf="books.length === 0">
                  <td colspan="6" class="text-center py-4">No books found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    
    .book-title {
      font-weight: 600;
      color: #333;
      font-size: 22px;
    }
    
    .card {
      border: none;
      border-radius: 0.5rem;
      background-color: #f9f9f9;
    }
    
    .table {
      margin-bottom: 0;
    }
    
    .table-header th {
      font-weight: 500;
      color: #6c757d;
      background-color: #f3f4f6;
      padding: 12px 16px;
      border-bottom: none;
      font-size: 14px;
    }
    
    .table tbody tr td {
      padding: 16px;
      vertical-align: middle;
      border-bottom: 1px solid #e9ecef;
    }
    
    .view-book-btn {
      background-color: #6366F1;
      border-color: #6366F1;
      color: white;
      min-width: 110px;
      border-radius: 6px;
    }
  `]
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  private booksUpdatedListener: any;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    // Add event listener for books updates from the app component
    this.booksUpdatedListener = this.handleBooksUpdated.bind(this);
    window.addEventListener('booksUpdated', this.booksUpdatedListener);
    
    this.loadBooks();
  }
  
  ngOnDestroy(): void {
    // Remove event listener on component destroy
    if (this.booksUpdatedListener) {
      window.removeEventListener('booksUpdated', this.booksUpdatedListener);
    }
  }
  
  handleBooksUpdated(event: any) {
    if (event.detail) {
      this.books = event.detail;
    }
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        if (error.status === 401 || error.status === 403) {
          // Token might be expired or invalid
          this.authService.logout();
          window.location.href = '/login';
        }
      }
    });
  }

  viewBook(book: Book): void {
    // Navigate to book details page or show a modal with book details
    console.log('Viewing book:', book);
    // For now, we'll just log the book. In a real app, we would navigate to a details page
    // this.router.navigate(['/books', book.id]);
  }
} 