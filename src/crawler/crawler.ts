import { Book } from './book';
import { BookCrawler } from './bookCrawler';
import { Character } from './character';
import { CharacterCrawler } from './characterCrawler';
import { BASE_URL } from './constants';
import { Entity } from './entity';
import { EntityCrawler } from './entityCrawler';
import { PageFetcher } from './pageFetcher';
import { Planet } from './planet';
import { PlanetCrawler } from './planetCrawler';
import cheerio from 'cheerio';

const seenBefore = {};

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
    this.characters = [];
    this.planets = [];
  }

  async crawl() {
    console.log(`----> Crawling books`);
    this.books = await this.bookCrawler.crawl();
    console.log(`----> Found ${this.books.length} books`);
    console.log(`----> Crawling entities from books`);
    this.entities = await this.entityCrawler.crawl(this.books);
    console.log(`----> Found ${this.entities.length} total entities`);
    await this.crawlEntityDetails();
  }

  async crawlEntityDetails() {
    const pageFetcher = new PageFetcher();
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (!seenBefore[entity.link]) {
        seenBefore[entity.link] = true;
        console.log(`----> Crawling ${entity.name} from ${entity.bookTitle} (${i + 1}/${this.entities.length})`);
        const url = entity.link.toLowerCase().startsWith('http') ? entity.link : `${BASE_URL}${entity.link}`;
        const pageData = await pageFetcher.fetchPageData(url);
        const $ = await cheerio.load(pageData);
        if (this.characterCrawler.isCharacterPage($)) {
          this.characters.push(await this.characterCrawler.crawl($, entity.name));
        } else if (this.planetCrawler.isPlanetPage($)) {
          this.planets.push(await this.planetCrawler.crawl($, entity.name));
        }
      }
    }
  }
}
