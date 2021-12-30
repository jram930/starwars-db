import { Book } from './book';
import { BookCrawler } from './bookCrawler';
import { Character } from './character';
import { CharacterCrawler } from './characterCrawler';
import { Entity } from './entity';
import { EntityCrawler } from './entityCrawler';

export class Crawler {
  bookCrawler: BookCrawler;
  entityCrawler: EntityCrawler;
  characterCrawler: CharacterCrawler;
  books: Book[];
  entities: Entity[];
  characters: Character[];

  constructor() {
    this.bookCrawler = new BookCrawler();
    this.entityCrawler = new EntityCrawler();
    this.characterCrawler = new CharacterCrawler();
  }

  async crawl() {
    console.log(`----> Crawling books`);
    this.books = await this.bookCrawler.crawl();
    console.log(`----> Found ${this.books.length} books`);
    console.log(`----> Crawling entities from books`);
    this.entities = await this.entityCrawler.crawl(this.books);
    console.log(`----> Found ${this.entities.length} total entities`);
    console.log(`----> Crawling entities to find characters`);
    this.characters = await this.characterCrawler.crawl(this.entities);
    console.log(`----> Found ${this.characters.length} total characters`);
  }
}
