import axios from 'axios';
import cheerio from 'cheerio';
import { Book } from './book';

const BOOK_LIST = 'https://starwars.fandom.com/wiki/Timeline_of_Legends_books';

export class Crawler {
  books: Book[];

  constructor() {
    this.books = [];
  }

  extractTitles($: cheerio.Root): string[] {
    const titles = [];
    const titleElements = $('tr.novel td:nth-child(3) a')
      .map((_, a) => $(a).attr('title'))
      .toArray();
    titleElements.forEach((titleElement) => {
      titles.push(titleElement.toString());
    });
    return titles;
  }

  extractYears($: cheerio.Root): number[][] {
    const years = [];
    const yearCells = $('tr.novel td:nth-child(1)').toArray();
    yearCells.forEach((yearCell) => {
      let listedYears = $('a', yearCell)
        .map((_, a) => $(a).attr('title'))
        .toArray();
      if (listedYears.length > 2) {
        listedYears = [listedYears[0], listedYears[listedYears.length - 1]];
      }
      const listedYearNumbers = listedYears.map((y) =>
        this.convertYearToNumber(y.toString())
      );
      years.push([...listedYearNumbers]);
    });
    return years;
  }

  convertYearToNumber(year: string): number {
    const noCommas = year.replace(/,/g, '');
    const tokens = noCommas.split(' ');
    if (tokens[1].startsWith('A')) {
      return +tokens[0];
    } else {
      return -tokens[0];
    }
  }

  async crawl() {
    const response = await axios.get(BOOK_LIST);
    const $ = cheerio.load(response.data);
    const titles = this.extractTitles($);
    const yearList = this.extractYears($);
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      const years = yearList[i];
      if (years[0] >= 4) {
        this.books.push(new Book(title, years));
      }
    }
    console.log(this.books);
  }
}
