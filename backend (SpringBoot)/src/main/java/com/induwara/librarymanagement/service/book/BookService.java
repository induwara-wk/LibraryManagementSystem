package com.induwara.librarymanagement.service.book;

import com.induwara.librarymanagement.dto.book.BookSearchDTO;
import com.induwara.librarymanagement.model.book.Book;

import java.util.List;

public interface BookService {

    List<Book> getAllBooks();

    Book getBookById(Long id);

    Book createBook(Book book);

    Book updateBook(Long id, Book book);

    void deleteBook(Long id);

    List<Book> searchBooks(String searchTerm);

    List<Book> findByTitle(String title);

    List<Book> findByAuthor(String author);

    Book findByIsbn(String isbn);

    List<Book> advancedSearch(BookSearchDTO searchDTO);
}