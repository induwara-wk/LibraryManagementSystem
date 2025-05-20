import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../models/book';
import { BookModalComponent } from '../book-modal/book-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BookModalComponent],
  template: `
    <div class="container mt-4">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="book-title mb-0">Books</h2>
            <button class="btn btn-primary new-book-btn" (click)="showAddBookModal()">
              <i class="bi bi-plus me-1"></i> New Book
            </button>
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
                  <td>
                    <div class="d-flex justify-content-center gap-2">
                      <button class="btn btn-sm btn-view" (click)="viewBook(book)">View</button>
                      <button class="btn btn-sm btn-edit" (click)="editBook(book)">Edit</button>
                      <button class="btn btn-sm btn-delete" (click)="deleteBook(book.id)">Delete</button>
                    </div>
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

    <!-- Add Book Modal -->
    <app-book-modal 
      *ngIf="showModal" 
      [book]="selectedBook"
      [modalType]="modalType"
      (close)="closeModal()"
      (save)="saveBook($event)">
    </app-book-modal>
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
    
    .new-book-btn {
      background-color: #6366F1;
      border-color: #6366F1;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
    }
    
    .btn-view {
      background-color: #6366F1;
      border-color: #6366F1;
      color: white;
      min-width: 60px;
    }
    
    .btn-edit {
      background-color: #3B82F6;
      border-color: #3B82F6;
      color: white;
      min-width: 60px;
    }
    
    .btn-delete {
      background-color: #DC2626;
      border-color: #DC2626;
      color: white;
      min-width: 60px;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  showModal: boolean = false;
  selectedBook: Book | null = null;
  modalType: 'add' | 'edit' | 'view' = 'add';
  private booksUpdatedListener: any;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in and is an admin
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    if (!this.authService.isAdmin()) {
      // Redirect if not an admin
      window.location.href = '/books';
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

  showAddBookModal(): void {
    this.selectedBook = {
      title: '',
      author: '',
      isbn: '',
      publishedDate: '',
      numberOfPages: 0
    };
    this.modalType = 'add';
    this.showModal = true;
  }

  editBook(book: Book): void {
    this.selectedBook = { ...book };
    this.modalType = 'edit';
    this.showModal = true;
  }

  viewBook(book: Book): void {
    this.selectedBook = { ...book };
    this.modalType = 'view';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBook = null;
  }

  saveBook(book: Book): void {
    if (this.modalType === 'add') {
      this.bookService.createBook(book).subscribe({
        next: () => {
          this.loadBooks();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating book:', error);
        }
      });
    } else if (this.modalType === 'edit' && this.selectedBook?.id) {
      this.bookService.updateBook(this.selectedBook.id, book).subscribe({
        next: () => {
          this.loadBooks();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating book:', error);
        }
      });
    }
  }

  deleteBook(id?: number): void {
    if (id && confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (error) => {
          console.error('Error deleting book:', error);
        }
      });
    }
  }
}
