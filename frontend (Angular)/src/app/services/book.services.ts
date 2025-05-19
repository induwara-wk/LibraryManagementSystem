import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchBooks(query: string): Observable<Book[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Book[]>(`${this.apiUrl}/search`, { params });
  }

  searchByTitle(title: string): Observable<Book[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Book[]>(`${this.apiUrl}/search/title`, { params });
  }

  searchByAuthor(author: string): Observable<Book[]> {
    const params = new HttpParams().set('author', author);
    return this.http.get<Book[]>(`${this.apiUrl}/search/author`, { params });
  }

  searchByIsbn(isbn: string): Observable<Book> {
    const params = new HttpParams().set('isbn', isbn);
    return this.http.get<Book>(`${this.apiUrl}/search/isbn`, { params });
  }
}