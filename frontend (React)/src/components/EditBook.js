import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedDate: '',
    numberOfPages: ''
  });
  const [originalIsbn, setOriginalIsbn] = useState('');

  useEffect(() => {
    console.log(`Fetching book with ID: ${id}`);
    BookService.getBookById(id)
      .then(response => {
        console.log("Book data:", response.data);
        const bookData = response.data;
        if (bookData.publishedDate) {
          bookData.publishedDate = bookData.publishedDate.substring(0, 10);
        }
        setBook(bookData);
        setOriginalIsbn(bookData.isbn);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book:', error);
        setLoading(false);
        alert('Error loading book details.');
        navigate('/');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;
    
    if (!book.title.trim()) {
      tempErrors.title = "Title is required";
      isValid = false;
    }
    
    if (!book.author.trim()) {
      tempErrors.author = "Author is required";
      isValid = false;
    }
    
    if (!book.isbn.trim()) {
      tempErrors.isbn = "ISBN is required";
      isValid = false;
    }
    
    if (book.numberOfPages && (isNaN(book.numberOfPages) || parseInt(book.numberOfPages) <= 0)) {
      tempErrors.numberOfPages = "Number of pages must be a positive number";
      isValid = false;
    }
    
    setErrors(tempErrors);
    return isValid;
  };

  const updateBook = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    console.log("Updating book:", book);

    const bookData = {
      ...book,
      numberOfPages: book.numberOfPages ? parseInt(book.numberOfPages, 10) : null
    };
    
    BookService.updateBook(id, bookData)
      .then(response => {
        console.log("Book updated successfully:", response.data);
        setSaving(false);
        navigate('/');
      })
      .catch(error => {
        console.error('Error updating book:', error);
        setSaving(false);
        
        if (error.response && error.response.data && 
            error.response.data.message && 
            error.response.data.message.includes('Duplicate') &&
            book.isbn !== originalIsbn) {
          setErrors({
            ...errors,
            isbn: "This ISBN already exists in the database"
          });
        } else {
          alert('Failed to update book. Please check your input and try again.');
        }
      });
  };

  return (
    <div className="card">
      <div className="card-header info">
        <h4>Edit Book</h4>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <form onSubmit={updateBook}>
            <div className="form-group">
              <label className="form-label">Title:</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'invalid' : ''}`}
                name="title"
                value={book.title}
                onChange={handleChange}
              />
              {errors.title && <div className="error-feedback">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Author:</label>
              <input
                type="text"
                className={`form-control ${errors.author ? 'invalid' : ''}`}
                name="author"
                value={book.author}
                onChange={handleChange}
              />
              {errors.author && <div className="error-feedback">{errors.author}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">ISBN:</label>
              <input
                type="text"
                className={`form-control ${errors.isbn ? 'invalid' : ''}`}
                name="isbn"
                value={book.isbn}
                onChange={handleChange}
              />
              {errors.isbn && <div className="error-feedback">{errors.isbn}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Published Date:</label>
              <input
                type="date"
                className="form-control"
                name="publishedDate"
                value={book.publishedDate || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Pages:</label>
              <input
                type="number"
                className={`form-control ${errors.numberOfPages ? 'invalid' : ''}`}
                name="numberOfPages"
                value={book.numberOfPages || ''}
                onChange={handleChange}
                min="1"
              />
              {errors.numberOfPages && <div className="error-feedback">{errors.numberOfPages}</div>}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/')}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-info" disabled={saving}>
                {saving ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditBook;