export class Book {
  title: string;
  author: string;
  years: number[];
  publishYear: number;
  link: string;

  constructor(title: string, author: string, years: number[], publishYear: number, link: string) {
    this.title = title;
    this.author = author;
    this.years = years;
    this.publishYear = publishYear;
    this.link = link;
  }
}
