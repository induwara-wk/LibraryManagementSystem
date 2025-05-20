package com.induwara.librarymanagement.service.impl;

import com.induwara.librarymanagement.dto.BookSearchDTO;
import com.induwara.librarymanagement.model.Book;
import com.induwara.librarymanagement.repository.BookRepository;
import com.induwara.librarymanagement.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    @Override
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book != null) {
            book.setTitle(bookDetails.getTitle());
            book.setAuthor(bookDetails.getAuthor());
            book.setIsbn(bookDetails.getIsbn());
            book.setPublishedDate(bookDetails.getPublishedDate());
            book.setNumberOfPages(bookDetails.getNumberOfPages());
            return bookRepository.save(book);
        }
        return null;
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public List<Book> searchBooks(String searchTerm) {
        return bookRepository.searchBooks(searchTerm);
    }

    @Override
    public List<Book> findByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Book> findByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    @Override
    public Book findByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn);
    }
    
    @Override
    public List<Book> advancedSearch(BookSearchDTO searchDTO) {
        // ISBN has highest priority as it should return a unique book
        if (searchDTO.getIsbn() != null && !searchDTO.getIsbn().isEmpty()) {
            Book book = findByIsbn(searchDTO.getIsbn());
            return book != null ? List.of(book) : new ArrayList<>();
        }
        
        // Next check for title
        if (searchDTO.getTitle() != null && !searchDTO.getTitle().isEmpty()) {
            return findByTitle(searchDTO.getTitle());
        }
        
        // Then check for author
        if (searchDTO.getAuthor() != null && !searchDTO.getAuthor().isEmpty()) {
            return findByAuthor(searchDTO.getAuthor());
        }
        
        // Finally, use general search query if provided
        if (searchDTO.getQuery() != null && !searchDTO.getQuery().isEmpty()) {
            return searchBooks(searchDTO.getQuery());
        }
        
        // If no criteria provided, return all books
        return getAllBooks();
    }
}
