import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

const API_URL = 'http://localhost:8080/api/books';

export interface BookSearchDTO {
  query?: string;
  title?: string;
  author?: string;
  isbn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(API_URL);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${API_URL}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(API_URL, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${API_URL}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  searchBooks(searchParams: any): Observable<Book[]> {
    // Convert to BookSearchDTO format
    const searchDTO: BookSearchDTO = {};
    
    if (searchParams.term) {
      // If general term provided, use as query
      searchDTO.query = searchParams.term;
    }
    
    // Add specific field searches if provided
    if (searchParams.title) {
      searchDTO.title = searchParams.title;
    }
    
    if (searchParams.author) {
      searchDTO.author = searchParams.author;
    }
    
    if (searchParams.isbn) {
      searchDTO.isbn = searchParams.isbn;
    }
    
    console.log('Search DTO:', searchDTO);
    return this.http.post<Book[]>(`${API_URL}/search`, searchDTO);
  }
}
