export class Book {
  title: string;
  author: string;
  years: number[];
  publishYear: number;

  constructor(
    title: string,
    author: string,
    years: number[],
    publishYear: number
  ) {
    this.title = title;
    this.author = author;
    this.years = years;
    this.publishYear = publishYear;
  }
}
