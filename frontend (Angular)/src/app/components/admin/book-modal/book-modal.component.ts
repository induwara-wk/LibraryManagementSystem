import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()"></div>
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ modalType === 'add' ? 'Add a new book' : modalType === 'edit' ? 'Update Book' : 'View Book' }}
          </h5>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="onSave()" #bookForm="ngForm">
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input
                type="text"
                class="form-control"
                id="title"
                name="title"
                placeholder="Enter book title..."
                [(ngModel)]="bookCopy.title"
                required
                [disabled]="modalType === 'view'"
              />
            </div>

            <div class="mb-3">
              <label for="author" class="form-label">Author</label>
              <input
                type="text"
                class="form-control"
                id="author"
                name="author"
                placeholder="Enter author's name..."
                [(ngModel)]="bookCopy.author"
                required
                [disabled]="modalType === 'view'"
              />
            </div>

            <div class="mb-3">
              <label for="isbn" class="form-label">ISBN</label>
              <input
                type="text"
                class="form-control"
                id="isbn"
                name="isbn"
                placeholder="Enter ISBN..."
                [(ngModel)]="bookCopy.isbn"
                required
                [disabled]="modalType === 'view'"
              />
            </div>

            <div class="mb-3">
              <label for="publishedDate" class="form-label">Date Published</label>
              <input
                type="date"
                class="form-control"
                id="publishedDate"
                name="publishedDate"
                placeholder="Select the published date..."
                [(ngModel)]="bookCopy.publishedDate"
                required
                [disabled]="modalType === 'view'"
              />
            </div>

            <div class="mb-4">
              <label for="numberOfPages" class="form-label">Pages</label>
              <input
                type="number"
                class="form-control"
                id="numberOfPages"
                name="numberOfPages"
                placeholder="Enter number of pages..."
                [(ngModel)]="bookCopy.numberOfPages"
                required
                [disabled]="modalType === 'view'"
              />
            </div>

            <div class="d-flex justify-content-between">
              <div>
                <button *ngIf="modalType !== 'view'" type="button" class="btn btn-upload" (click)="onUpload()">
                  <i class="bi bi-upload me-2"></i> Upload Book
                </button>
              </div>
              <div>
                <button type="button" class="btn btn-cancel me-2" (click)="onClose()">
                  {{ modalType === 'view' ? 'Close' : 'Cancel' }}
                </button>
                <button *ngIf="modalType !== 'view'" type="submit" class="btn btn-save" [disabled]="bookForm.invalid">
                  {{ modalType === 'add' ? 'Save' : 'Update' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1040;
    }
    
    .modal-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1050;
      width: 100%;
      max-width: 500px;
    }
    
    .modal-content {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 24px;
    }
    
    .modal-header {
      padding-bottom: 16px;
      border-bottom: 1px solid #e9ecef;
      margin-bottom: 20px;
    }
    
    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }
    
    .modal-body {
      padding: 0;
    }

    .form-label {
      font-weight: 500;
      color: #4b5563;
      font-size: 0.95rem;
      margin-bottom: 6px;
    }

    .form-control {
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background-color: #f9fafb;
      font-size: 0.95rem;
    }

    .form-control:focus {
      border-color: #6366F1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-control:disabled {
      background-color: #f3f4f6;
      opacity: 0.7;
    }

    .btn-upload {
      background-color: transparent;
      color: #6366F1;
      border: 1px solid #6366F1;
      display: flex;
      align-items: center;
      padding: 8px 16px;
      font-weight: 500;
    }

    .btn-cancel {
      background-color: #f3f4f6;
      border-color: #e5e7eb;
      color: #6b7280;
      padding: 8px 20px;
      font-weight: 500;
    }

    .btn-save {
      background-color: #6366F1;
      border-color: #6366F1;
      color: white;
      padding: 8px 20px;
      font-weight: 500;
    }

    .btn-save:hover {
      background-color: #4F46E5;
      border-color: #4F46E5;
    }

    .btn-save:disabled {
      background-color: #a5a6f6;
      border-color: #a5a6f6;
    }
  `]
})
export class BookModalComponent implements OnInit {
  @Input() book: Book | null = null;
  @Input() modalType: 'add' | 'edit' | 'view' = 'add';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Book>();
  
  bookCopy: Book = {
    title: '',
    author: '',
    isbn: '',
    publishedDate: '',
    numberOfPages: 0
  };

  ngOnInit(): void {
    if (this.book) {
      this.bookCopy = { ...this.book };
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit(this.bookCopy);
  }

  onUpload(): void {
    // This would be implemented to handle file uploads
    console.log('Upload functionality would be implemented here');
  }
}
