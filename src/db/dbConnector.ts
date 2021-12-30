import { Client } from 'pg';
import { Book } from '../crawler/book';
import { Crawler } from '../crawler/crawler';

export class DBConnector {
  client: Client;
  connected: boolean;

  constructor() {
    this.connected = false;
  }

  async connect() {
    this.client = new Client({
      user: 'postgres',
      password: 'password',
      database: 'star_wars',
    });
    await this.client.connect();
    this.connected = true;
  }

  async disconnect() {
    if (this.connected) {
      await this.client.end();
    }
  }

  async wipeData() {
    if (!this.connected) {
      throw 'Not connected!';
    }
    await this.client.query('TRUNCATE TABLE book');
  }

  async insertBooks(books: Book[]) {
    const sql = this.createInsertBookSql(books);
    await this.client.query(sql);
  }

  sanitizeString(str: string) {
    return str.replace(/'/g, "''");
  }

  createInsertBookSql(books: Book[]): string {
    let sql =
      'INSERT INTO book (title, author, begin_year, end_year, publish_year) VALUES ';
    books.forEach((book) => {
      sql += `('${this.sanitizeString(book.title)}', '${this.sanitizeString(
        book.author
      )}', ${book.years[0]}, ${book.years[1] ?? null}, ${book.publishYear}), `;
    });
    sql = sql.slice(0, sql.length - 2);
    return sql;
  }

  async insertAllData(crawler: Crawler) {
    console.log(`----> Inserting books`);
    await this.insertBooks(crawler.books);
  }
}
