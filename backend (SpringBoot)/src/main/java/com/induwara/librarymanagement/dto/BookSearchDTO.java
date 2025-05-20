package com.induwara.librarymanagement.dto;

public class BookSearchDTO {
    private String query;
    private String title;
    private String author;
    private String isbn;


    public BookSearchDTO() {
    }


    public String getQuery() {
        return query;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getIsbn() {
        return isbn;
    }
} 