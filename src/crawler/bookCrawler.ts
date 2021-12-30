import cheerio from 'cheerio';
import { Book } from './book';
import { BOOK_PAGE } from './constants';
import { PageFetcher } from './pageFetcher';

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

  extractLinks($: cheerio.Root): string[] {
    const links = [];
    const linkElements = $('tr.novel td:nth-child(3) a')
      .map((_, a) => $(a).attr('href'))
      .toArray();
    linkElements.forEach((linkElement) => {
      links.push(linkElement.toString());
    });
    return links;
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
      const listedYearNumbers = listedYears.map((y) => this.convertYearToNumber(y.toString()));
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
    const pageFetcher = new PageFetcher();
    const pageData = await pageFetcher.fetchPageData(BOOK_PAGE);
    const $ = cheerio.load(pageData);
    const titles = this.extractTitles($);
    const links = this.extractLinks($);
    const authors = this.extractAuthors($);
    const yearList = this.extractYears($);
    const publishYears = this.extractPublishYears($);
    if (
      titles.length !== authors.length &&
      titles.length !== yearList.length &&
      titles.length !== publishYears.length &&
      titles.length !== links.length
    ) {
      throw 'Something went wrong with crawling!';
    }
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      const author = authors[i];
      const years = yearList[i];
      const publishYear = publishYears[i];
      const link = links[i];
      if (years[0] >= 4) {
        books.push(new Book(title, author, years, publishYear, link));
      }
    }
    return books;
  }
}
