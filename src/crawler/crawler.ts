import { Book } from './book';
import { BookCrawler } from './bookCrawler';

export class Crawler {
  bookCrawler: BookCrawler;
  books: Book[];

  constructor() {
    this.bookCrawler = new BookCrawler();
  }

  async crawl() {
    this.books = await this.bookCrawler.crawl();
  }
}
