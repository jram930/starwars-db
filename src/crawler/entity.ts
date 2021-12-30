export class Entity {
  name: string;
  link: string;
  bookTitle: string;

  constructor(name: string, link: string, bookTitle: string) {
    this.name = name;
    this.link = link;
    this.bookTitle = bookTitle;
  }
}
