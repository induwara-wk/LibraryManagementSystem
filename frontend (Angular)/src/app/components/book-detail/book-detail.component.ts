import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.services';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.loadBook();
  }

  loadBook(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load book details. Please try again later.';
        this.loading = false;
        console.error('Error loading book:', err);
      }
    });
  }

  deleteBook(): void {
    if (!this.book || !this.book.id) return;
    
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(this.book.id).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Failed to delete book. Please try again later.');
        }
      });
    }
  }
}