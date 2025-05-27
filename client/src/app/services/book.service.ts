import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book, BookSearchDTO } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book).pipe(
      catchError(this.handleError)
    );
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchBooks(searchTerm: string): Observable<Book[]> {
    return this.http.post<Book[]>(`${this.apiUrl}/search`, { query: searchTerm }).pipe(
      catchError(this.handleError)
    );
  }

  // Advanced search using BookSearchDTO (matches backend exactly)
  advancedSearch(searchDTO: BookSearchDTO): Observable<Book[]> {
    return this.http.post<Book[]>(`${this.apiUrl}/search`, searchDTO).pipe(
      catchError(this.handleError)
    );
  }

  // Search by title only
  searchByTitle(title: string): Observable<Book[]> {
    return this.http.post<Book[]>(`${this.apiUrl}/search`, { title }).pipe(
      catchError(this.handleError)
    );
  }

  // Search by author only
  searchByAuthor(author: string): Observable<Book[]> {
    return this.http.post<Book[]>(`${this.apiUrl}/search`, { author }).pipe(
      catchError(this.handleError)
    );
  }

  // Search by ISBN only
  searchByIsbn(isbn: string): Observable<Book[]> {
    return this.http.post<Book[]>(`${this.apiUrl}/search`, { isbn }).pipe(
      catchError(this.handleError)
    );
  }

  // Upload PDF file for a book
  uploadBookFile(bookId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.apiUrl}/${bookId}/upload`, formData).pipe(
      catchError(this.handleError)
    );
  }



  // Check if PDF file exists for a book
  checkFileExists(bookId: number): Observable<{exists: boolean}> {
    return this.http.get<{exists: boolean}>(`${this.apiUrl}/${bookId}/file/exists`).pipe(
      catchError(this.handleError)
    );
  }

  // View PDF file for a book (returns blob for viewing)
  viewBookFile(bookId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${bookId}/download`, { 
      responseType: 'blob' 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete PDF file for a book
  deleteBookFile(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookId}/file`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot connect to server. Please check if the backend is running on http://localhost:8080';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'Access forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 