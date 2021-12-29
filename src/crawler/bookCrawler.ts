import axios from 'axios';
import cheerio from 'cheerio';
import { Book } from './book';

const BOOK_LIST = 'https://starwars.fandom.com/wiki/Timeline_of_Legends_books';

export class BookCrawler {
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

  extractAuthors($: cheerio.Root): string[] {
    const authors = [];
    const authorElements = $('tr.novel td:nth-child(4) a:nth-child(1)')
      .map((_, a) => $(a).attr('title'))
      .toArray();
    authorElements.forEach((authorElement) => {
      authors.push(authorElement.toString());
    });
    return authors;
  }

  extractPublishYears($: cheerio.Root): number[] {
    const publishYears = [];
    const publishYearElements = $('tr.novel td:nth-child(5)')
      .map((_, td) => $(td).text())
      .toArray();
    publishYearElements.forEach((publishYearElement) => {
      const year = this.parseYearFromDate(publishYearElement.toString());
      publishYears.push(year);
    });
    return publishYears;
  }

  parseYearFromDate(date: string): number {
    const tokens = date.split('-');
    return +tokens[0];
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

  async crawl(): Promise<Book[]> {
    const books = [];
    const response = await axios.get(BOOK_LIST);
    const $ = cheerio.load(response.data);
    const titles = this.extractTitles($);
    const authors = this.extractAuthors($);
    const yearList = this.extractYears($);
    const publishYears = this.extractPublishYears($);
    if (
      titles.length !== authors.length &&
      titles.length !== yearList.length &&
      titles.length !== publishYears.length
    ) {
      throw 'Something went wrong with crawling!';
    }
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      const author = authors[i];
      const years = yearList[i];
      const publishYear = publishYears[i];
      if (years[0] >= 4) {
        books.push(new Book(title, author, years, publishYear));
      }
    }
    return books;
  }
}
