import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.services';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error: string | null = null;
  searchQuery: string = '';
  searchType: string = 'general';

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = null;
    
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books. Please try again later.';
        this.loading = false;
        console.error('Error loading books:', err);
      }
    });
  }

  searchBooks(): void {
    if (!this.searchQuery.trim()) {
      this.loadBooks();
      return;
    }

    this.loading = true;
    this.error = null;

    // Create search parameters based on the search type
    const searchParams: any = {};
    
    switch (this.searchType) {
      case 'title':
        searchParams.title = this.searchQuery;
        break;
      case 'author':
        searchParams.author = this.searchQuery;
        break;
      case 'isbn':
        searchParams.isbn = this.searchQuery;
        break;
      default:
        searchParams.query = this.searchQuery;
    }

    // Use the new advancedSearch method
    this.bookService.advancedSearch(searchParams).subscribe({
      next: (data: Book[]) => {
        this.books = data;
        if (data.length === 0) {
          this.error = `No books found matching your search criteria.`;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to search books. Please try again later.';
        this.loading = false;
        console.error('Error searching books:', err);
      }
    });
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.searchType = 'general';
    this.loadBooks();
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== id);
        },
        
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Failed to delete book. Please try again later.');
        }
      });
    }
  }
}
