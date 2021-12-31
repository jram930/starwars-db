import { Book } from './book';
import { BookCrawler } from './bookCrawler';
import { Character } from './character';
import { CharacterCrawler } from './characterCrawler';
import { Entity } from './entity';
import { EntityCrawler } from './entityCrawler';
import { Planet } from './planet';
import { PlanetCrawler } from './planetCrawler';

export class Crawler {
  bookCrawler: BookCrawler;
  entityCrawler: EntityCrawler;
  characterCrawler: CharacterCrawler;
  planetCrawler: PlanetCrawler;
  books: Book[];
  entities: Entity[];
  characters: Character[];
  planets: Planet[];

  constructor() {
    this.bookCrawler = new BookCrawler();
    this.entityCrawler = new EntityCrawler();
    this.characterCrawler = new CharacterCrawler();
    this.planetCrawler = new PlanetCrawler();
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
    this.planets = await this.planetCrawler.crawl(this.entities);
    console.log(`----> Found ${this.planets.length} total planets`);
  }
}
