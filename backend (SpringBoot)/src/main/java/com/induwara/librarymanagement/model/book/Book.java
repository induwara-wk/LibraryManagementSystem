package com.induwara.librarymanagement.model.book;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(unique = true, nullable = false)
    private String isbn;

    @Column(name = "published_date")
    private LocalDate publishedDate;

    @Column(name = "number_of_pages")
    private Integer numberOfPages;

    @Column(name = "file_path")
    private String filePath;

    public Book() {
    }

    public Book(String title, String author, String isbn, LocalDate publishedDate, Integer numberOfPages) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publishedDate = publishedDate;
        this.numberOfPages = numberOfPages;
    }

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public String getTitle() {

        return title;
    }

    public void setTitle(String title) {

        this.title = title;
    }

    public String getAuthor() {

        return author;
    }

    public void setAuthor(String author) {

        this.author = author;
    }

    public String getIsbn() {

        return isbn;
    }

    public void setIsbn(String isbn) {

        this.isbn = isbn;
    }

    public LocalDate getPublishedDate() {

        return publishedDate;
    }

    public void setPublishedDate(LocalDate publishedDate) {

        this.publishedDate = publishedDate;
    }

    public Integer getNumberOfPages() {

        return numberOfPages;
    }

    public void setNumberOfPages(Integer numberOfPages) {

        this.numberOfPages = numberOfPages;
    }

    public String getFilePath() {

        return filePath;
    }

    public void setFilePath(String filePath) {

        this.filePath = filePath;
    }
}