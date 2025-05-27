import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() bookSaved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  currentBook: Book = {
    title: '',
    author: '',
    isbn: '',
    publishedDate: '',
    numberOfPages: 0
  };

  loading = false;
  error = '';
  success = '';
  isEditMode = false;
  selectedFile: File | null = null;
  uploadLoading = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    if (this.book) {
      this.isEditMode = true;
      this.currentBook = { ...this.book };
    } else {
      this.isEditMode = false;
      this.currentBook = {
        title: '',
        author: '',
        isbn: '',
        publishedDate: '',
        numberOfPages: 0
      };
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const operation = this.isEditMode 
      ? this.bookService.updateBook(this.currentBook.id!, this.currentBook)
      : this.bookService.createBook(this.currentBook);

    operation.subscribe({
      next: () => {
        this.success = this.isEditMode ? 'Book updated successfully!' : 'Book added successfully!';
        this.loading = false;
        setTimeout(() => {
          this.bookSaved.emit();
        }, 1000);
      },
      error: (error) => {
        this.error = error.message || 'An error occurred';
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.currentBook.title?.trim()) {
      this.error = 'Title is required';
      return false;
    }
    if (!this.currentBook.author?.trim()) {
      this.error = 'Author is required';
      return false;
    }
    if (!this.currentBook.isbn?.trim()) {
      this.error = 'ISBN is required';
      return false;
    }
    if (!this.currentBook.publishedDate) {
      this.error = 'Published date is required';
      return false;
    }
    if (!this.currentBook.numberOfPages || this.currentBook.numberOfPages <= 0) {
      this.error = 'Number of pages must be greater than 0';
      return false;
    }
    return true;
  }

  cancel(): void {
    this.cancelled.emit();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        this.error = 'Only PDF files are allowed';
        return;
      }
      
      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.error = 'File size must be less than 10MB';
        return;
      }
      
      this.selectedFile = file;
      this.error = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.currentBook.id) {
      this.error = 'Please select a file and save the book first';
      return;
    }

    this.uploadLoading = true;
    this.error = '';

    this.bookService.uploadBookFile(this.currentBook.id, this.selectedFile).subscribe({
      next: (response) => {
        this.success = 'File uploaded successfully!';
        this.uploadLoading = false;
        this.selectedFile = null;
        // Reset file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (error) => {
        this.error = error.message || 'Failed to upload file';
        this.uploadLoading = false;
      }
    });
  }
} 