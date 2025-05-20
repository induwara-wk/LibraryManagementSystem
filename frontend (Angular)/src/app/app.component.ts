import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { BookService } from './services/book.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'VERSE';
  searchTerm: string = '';
  hideNavbar: boolean = false;
  showAdminActions: boolean = false;
  selectedField: string = 'All';
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide navbar on home, login, and register pages
        this.hideNavbar = [
          '/', 
          '/login', 
          '/register'
        ].includes(event.url);
        
        // Show admin actions if user is admin
        this.showAdminActions = this.authService.isAdmin();
      }
    });
  }

  setSearchField(field: string) {
    this.selectedField = field;
    console.log('Search field set to:', field);
    
    // If there's an existing search term, perform the search with the new field
    if (this.searchTerm.trim()) {
      this.searchBooks();
    }
  }

  searchBooks() {
    if (this.searchTerm.trim()) {
      const searchParams: any = {};
      
      // Set search parameters based on selected field
      if (this.selectedField === 'All') {
        searchParams.query = this.searchTerm; // Use query field for general search
      } else {
        // For specific fields (title, author, isbn), use the field name as parameter
        searchParams[this.selectedField] = this.searchTerm;
      }
      
      console.log('Searching with params:', searchParams);
      
      this.bookService.searchBooks(searchParams).subscribe({
        next: (data) => {
          console.log('Search results:', data);
          this.publishBooksUpdated(data);
        },
        error: (error) => {
          console.error('Error searching books:', error);
        }
      });
    } else {
      this.refreshBooks();
    }
  }

  refreshBooks() {
    this.searchTerm = '';
    
    // Load all books and publish to subscribers
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        console.log('Refreshed books:', data);
        this.publishBooksUpdated(data);
      },
      error: (error) => {
        console.error('Error refreshing books:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Method to publish books updates to components
  private publishBooksUpdated(books: any[]) {
    // In a real app, you'd use a shared service or state management
    // For simplicity, we'll use a custom event
    const event = new CustomEvent('booksUpdated', { detail: books });
    window.dispatchEvent(event);
  }
}
 