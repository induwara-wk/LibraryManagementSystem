import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.services';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent implements OnInit {
  book: Book = {
    title: '',
    author: '',
    isbn: '',
    publishedDate: '',
    numberOfPages: undefined
  };
  
  isEditMode = false;
  loading = false;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) { }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadBook(Number(id));
    }
  }
  
  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        if (this.book.publishedDate) {
          const date = new Date(this.book.publishedDate);
          this.book.publishedDate = date.toISOString().split('T')[0];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load book. Please try again later.';
        this.loading = false;
        console.error('Error loading book:', err);
      }
    });
  }
  
  onSubmit(): void {
    this.loading = true;
    this.error = null;
    
    if (this.isEditMode && this.book.id) {
      this.bookService.updateBook(this.book.id, this.book).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/books', this.book.id]);
        },
        error: (err) => {
          this.error = 'Failed to update book. Please try again later.';
          this.loading = false;
          console.error('Error updating book:', err);
        }
      });
    } else {
      this.bookService.createBook(this.book).subscribe({
        next: (data) => {
          this.loading = false;
          this.router.navigate(['/books', data.id]);
        },
        error: (err) => {
          this.error = 'Failed to create book. Please try again later.';
          this.loading = false;
          console.error('Error creating book:', err);
        }
      });
    }
  }
}