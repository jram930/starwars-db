import cheerio from 'cheerio';
import { Book } from './book';
import { BASE_URL } from './constants';
import { Entity } from './entity';
import { PageFetcher } from './pageFetcher';

export class EntityCrawler {
  extractNames($) {
    const names = [];
    const nameElements = $('.mw-parser-output p a')
      .map((_, a) => $(a).attr('title'))
      .toArray();
    nameElements.forEach((nameElement) => {
      const name = this.cleanUpName(nameElement.toString());
      names.push(name);
    });
    return names;
  }

  extractLinks($) {
    const links = [];
    const linkElements = $('.mw-parser-output p a')
      .map((_, a) => $(a).attr('href'))
      .toArray();
    linkElements.forEach((linkElement) => {
      links.push(linkElement.toString());
    });
    return links;
  }

  cleanUpName(rawName: string) {
    let name = rawName;
    name = name.replace(/\/Legends/g, '');
    return name;
  }

  async crawl(books: Book[]) {
    const entities = [];
    const pageFetcher = new PageFetcher();
    // const books = booksLong.slice(0, 1);
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      console.log(`------> Crawling entities for ${book.title}`);
      const pageData = await pageFetcher.fetchPageData(`${BASE_URL}${book.link}`);
      const $ = cheerio.load(pageData);
      const names = this.extractNames($);
      const links = this.extractLinks($);
      if (names.length !== links.length) {
        throw 'Problem crawling';
      }
      console.log(`------> Found ${names.length} entities`);
      for (let j = 0; j < names.length; j++) {
        entities.push(new Entity(names[j], links[j], book.title));
      }
    }
    return entities;
  }
}
