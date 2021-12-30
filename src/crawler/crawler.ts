import { Book } from './book';
import { BookCrawler } from './bookCrawler';

export class Crawler {
  bookCrawler: BookCrawler;
  books: Book[];

  constructor() {
    this.bookCrawler = new BookCrawler();
  }

  async crawl() {
    console.log(`----> Crawling books`);
    this.books = await this.bookCrawler.crawl();
  }
}
