package com.induwara.librarymanagement.controller.book;

import com.induwara.librarymanagement.dto.book.BookSearchDTO;
import com.induwara.librarymanagement.model.book.Book;
import com.induwara.librarymanagement.service.book.BookService;
import com.induwara.librarymanagement.service.book.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200"}, 
            allowedHeaders = {"Authorization", "Content-Type", "X-Requested-With"},
            methods = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE,
                    RequestMethod.OPTIONS
            },
            maxAge = 3600, 
            allowCredentials = "true")

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final FileUploadService fileUploadService;

    @Autowired
    public BookController(BookService bookService, FileUploadService fileUploadService) {
        this.bookService = bookService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return new ResponseEntity<>(book, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book newBook = bookService.createBook(book);
        return new ResponseEntity<>(newBook, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updatedBook = bookService.updateBook(id, book);
        return new ResponseEntity<>(updatedBook, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Book>> advancedSearch(@RequestBody BookSearchDTO searchDTO) {
        List<Book> books = bookService.advancedSearch(searchDTO);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @PostMapping("/{id}/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadBookFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Book book = bookService.getBookById(id);
            
            // Delete old file if exists
            if (book.getFilePath() != null) {
                fileUploadService.deleteFile(book.getFilePath());
            }
            
            // Upload new file
            String filename = fileUploadService.uploadFile(file);
            book.setFilePath(filename);
            bookService.updateBook(id, book);
            
            return ResponseEntity.ok().body("{\"message\": \"File uploaded successfully\", \"filename\": \"" + filename + "\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to upload file\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An unexpected error occurred\"}");
        }
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadBookFile(@PathVariable Long id) {
        try {
            Book book = bookService.getBookById(id);
            
            if (book.getFilePath() == null || book.getFilePath().isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Path filePath = fileUploadService.getFilePath(book.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "attachment; filename=\"" + book.getTitle() + ".pdf\"")
                        .body(resource);
            } else {
                book.setFilePath(null);
                bookService.updateBook(id, book);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/file/exists")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> checkFileExists(@PathVariable Long id) {
        try {
            Book book = bookService.getBookById(id);
            
            if (book.getFilePath() == null || book.getFilePath().isEmpty()) {
                return ResponseEntity.ok().body("{\"exists\": false}");
            }
            
            Path filePath = fileUploadService.getFilePath(book.getFilePath());
            boolean exists = java.nio.file.Files.exists(filePath) && java.nio.file.Files.isReadable(filePath);
            
            if (!exists) {
                book.setFilePath(null);
                bookService.updateBook(id, book);
            }
            
            return ResponseEntity.ok().body("{\"exists\": " + exists + "}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An unexpected error occurred\"}");
        }
    }

    @DeleteMapping("/{id}/file")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBookFile(@PathVariable Long id) {
        try {
            Book book = bookService.getBookById(id);
            
            if (book.getFilePath() != null) {
                fileUploadService.deleteFile(book.getFilePath());
                book.setFilePath(null);
                bookService.updateBook(id, book);
            }
            
            return ResponseEntity.ok().body("{\"message\": \"File deleted successfully\"}");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to delete file\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An unexpected error occurred\"}");
        }
    }
}