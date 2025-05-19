import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';

function BookList() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    console.log("Fetching books from API...");
    BookService.getAllBooks()
      .then(response => {
        console.log("API Response:", response.data);
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setLoading(true);
      
      let searchPromise;
      
      switch(searchType) {
        case 'title':
          searchPromise = BookService.searchByTitle(searchTerm);
          break;
        case 'author':
          searchPromise = BookService.searchByAuthor(searchTerm);
          break;
        case 'isbn':
          searchPromise = BookService.searchByIsbn(searchTerm);
          break;
        default:
          searchPromise = BookService.searchBooks(searchTerm);
      }
      
      searchPromise
        .then(response => {
          // Handle the case when searching by ISBN (returns single object, not array)
          if (searchType === 'isbn' && response.data && !Array.isArray(response.data)) {
            setBooks([response.data]);
          } else {
            setBooks(response.data);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error searching books:', error);
          setLoading(false);
          // If not found, especially for ISBN search
          if (error.response && error.response.status === 404) {
            setBooks([]);
          }
        });
    } else {
      fetchBooks();
    }
  };

  const deleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      BookService.deleteBook(id)
        .then(() => {
          fetchBooks();
        })
        .catch(error => {
          console.error('Error deleting book:', error);
        });
    }
  };

  return (
    <div>
      <div className="header-actions">
    
        <h2><Link className="" to="/">Books List</Link></h2>
        <Link to="/add" className="add-button">Add New Book</Link>
      </div>
      
      <form className="search-form" onSubmit={handleSearch}>
        <select 
          className="search-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="all">All Fields</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="isbn">ISBN</option>
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
        <button 
          type="button" 
          className="reset-button" 
          onClick={() => {
            setSearchTerm('');
            setSearchType('all');
            fetchBooks();
          }}
        >
          Reset
        </button>
      </form>
      
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          <table className="books-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Published Date</th>
                <th>Pages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.publishedDate}</td>
                    <td>{book.numberOfPages}</td>
                    <td className="action-buttons">
                      <Link to={`/edit/${book.id}`} className="edit-button">Edit</Link>
                      <button className="delete-button" onClick={() => deleteBook(book.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-message">No books found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookList;