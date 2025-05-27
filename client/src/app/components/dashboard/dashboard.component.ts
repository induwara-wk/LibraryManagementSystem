import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { Book, BookSearchDTO } from '../../models/book.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BookFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  books: Book[] = [];
  searchTerm = '';
  selectedFilter = 'all';
  loading = true;
  error = '';
  showBookForm = false;
  editingBook: Book | null = null;

  // Delete confirmation modal properties
  showDeleteModal = false;
  bookToDelete: { id: number; title: string } | null = null;
  deleteLoading = false;
  deleteMessage = '';
  deleteMessageType: 'success' | 'error' | '' = '';

  constructor(
    public authService: AuthService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load books';
        this.loading = false;
      }
    });
  }

  searchBooks(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.error = '';

      // Use advanced search based on selected filter
      this.performAdvancedSearch();
    } else {
      this.loadBooks();
    }
  }

  performAdvancedSearch(): void {
    const searchDTO: BookSearchDTO = {};
    const term = this.searchTerm.trim();

    // Apply search based on selected filter (matches backend logic exactly)
    switch (this.selectedFilter) {
      case 'title':
        searchDTO.title = term;
        break;
      case 'author':
        searchDTO.author = term;
        break;
      case 'isbn':
        searchDTO.isbn = term;
        break;
      case 'all':
      default:
        searchDTO.query = term; // General search across all fields
        break;
    }

    this.bookService.advancedSearch(searchDTO).subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Search failed';
        this.loading = false;
      }
    });
  }

  refreshBooks(): void {
    this.searchTerm = '';
    this.selectedFilter = 'all';
    this.loadBooks();
  }

  getSearchPlaceholder(): string {
    switch (this.selectedFilter) {
      case 'title':
        return 'Search by title...';
      case 'author':
        return 'Search by author...';
      case 'isbn':
        return 'Search by ISBN...';
      case 'all':
      default:
        return 'Search books...';
    }
  }

  retryLoadBooks(): void {
    this.loadBooks();
  }

  viewBook(id: number): void {
    const book = this.books.find(b => b.id === id);
    if (!book) {
      alert('Book not found');
      return;
    }

    if (!book.filePath) {
      alert('Sorry, this book is not uploaded yet');
      return;
    }

    // Try to view the PDF file with authentication
    this.bookService.viewBookFile(id).subscribe({
      next: (blob) => {
        // Create blob URL and open in new tab
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

        // Clean up the URL after a delay to allow the browser to load it
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      },
      error: (error) => {
        // If there's an error (like 404), the file doesn't exist
        book.filePath = undefined;
        alert('Sorry, this book is not uploaded yet');
      }
    });
  }



  showAddBookModal(): void {
    this.editingBook = null;
    this.showBookForm = true;
  }

  editBook(id: number): void {
    const book = this.books.find(b => b.id === id);
    if (book) {
      this.editingBook = { ...book };
      this.showBookForm = true;
    }
  }

  closeBookModal(): void {
    this.showBookForm = false;
    this.editingBook = null;
  }

  onBookSaved(): void {
    this.closeBookModal();
    this.loadBooks();
  }

  deleteBook(id: number, title: string): void {
    this.bookToDelete = { id, title };
    this.showDeleteModal = true;
    this.deleteMessage = '';
    this.deleteMessageType = '';
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.bookToDelete = null;
    this.deleteMessage = '';
    this.deleteMessageType = '';
    this.deleteLoading = false;
  }

  confirmDelete(): void {
    if (!this.bookToDelete) return;

    this.deleteLoading = true;
    this.deleteMessage = '';
    this.deleteMessageType = '';

    this.bookService.deleteBook(this.bookToDelete.id).subscribe({
      next: () => {
        this.deleteMessage = `"${this.bookToDelete!.title}" has been deleted successfully!`;
        this.deleteMessageType = 'success';
        this.deleteLoading = false;

        setTimeout(() => {
          this.closeDeleteModal();
          this.loadBooks();
        }, 1500);
      },
      error: (error) => {
        this.deleteMessage = error.message || 'Failed to delete book. Please try again.';
        this.deleteMessageType = 'error';
        this.deleteLoading = false;
      }
    });
  }
}
