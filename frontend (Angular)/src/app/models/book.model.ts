export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  numberOfPages: number;
  filePath?: string;
}

export interface BookSearchDTO {
  query?: string;
  title?: string;
  author?: string;
  isbn?: string;
} 