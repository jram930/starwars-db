import { Client } from 'pg';
import { Book } from '../crawler/book';
import { Character } from '../crawler/character';
import { Crawler } from '../crawler/crawler';
import { Entity } from '../crawler/entity';
import { Planet } from '../crawler/planet';

export class DBConnector {
  client: Client;
  connected: boolean;

  constructor() {
    this.connected = false;
  }

  async connect() {
    this.client = new Client({
      user: 'postgres',
      password: 'password',
      database: 'star_wars',
    });
    await this.client.connect();
    this.connected = true;
  }

  async disconnect() {
    if (this.connected) {
      await this.client.end();
    }
  }

  async wipeData() {
    if (!this.connected) {
      throw 'Not connected!';
    }
    await this.client.query('DROP TABLE IF EXISTS link_book_character');
    await this.client.query('DROP TABLE IF EXISTS link_book_planet');
    await this.client.query('DROP TABLE IF EXISTS book');
    await this.client.query('DROP TABLE IF EXISTS character');
    await this.client.query('DROP TABLE IF EXISTS planet');
    await this.client.query(
      'create table book (id SERIAL PRIMARY KEY, title text unique not null, author text, begin_year integer, end_year integer, publish_year integer)'
    );
    await this.client.query(
      'create table character (id SERIAL PRIMARY KEY, name text unique not null, species text, gender text, homeworld text)'
    );
    await this.client.query(
      'create table planet (id SERIAL PRIMARY KEY, name text unique not null, system text, sector text, region text, classification text) '
    );
    await this.client.query(
      'create table link_book_character (id SERIAL PRIMARY KEY, book_id integer, character_id integer, CONSTRAINT fk_book FOREIGN KEY(book_id) REFERENCES book(id), CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES character(id))'
    );
    await this.client.query(
      'create table link_book_planet (id SERIAL PRIMARY KEY, book_id integer, planet_id integer, CONSTRAINT fk_book FOREIGN KEY(book_id) REFERENCES book(id), CONSTRAINT fk_planet FOREIGN KEY(planet_id) REFERENCES planet(id))'
    );
  }

  async insertBooks(books: Book[]) {
    const sql = this.createInsertBookSql(books);
    try {
      await this.client.query(sql);
    } catch (err) {
      console.error(err);
    }
  }

  sanitizeString(str: string) {
    return str.replace(/'/g, "''");
  }

  createInsertBookSql(books: Book[]): string {
    let sql = 'INSERT INTO book (title, author, begin_year, end_year, publish_year) VALUES ';
    books.forEach((book) => {
      sql += `('${this.sanitizeString(book.title)}', '${this.sanitizeString(book.author)}', ${book.years[0]}, ${book.years[1] ?? null}, ${
        book.publishYear
      }), `;
    });
    sql = sql.slice(0, sql.length - 2);
    return sql;
  }

  createInsertCharacterSql(characters: Character[]) {
    let sql = 'INSERT INTO character (name, species, gender, homeworld) VALUES ';
    characters.forEach((character) => {
      sql += `('${this.sanitizeString(character.name)}', '${this.sanitizeString(character.species)}', '${this.sanitizeString(
        character.gender
      )}', '${this.sanitizeString(character.homeworld)}'), `;
    });
    sql = sql.slice(0, sql.length - 2);
    return sql;
  }

  async insertCharacters(characters: Character[]) {
    const sql = this.createInsertCharacterSql(characters);
    try {
      await this.client.query(sql);
    } catch (err) {
      console.error(err);
    }
  }

  createInsertPlanetSql(planets: Planet[]): string {
    let sql = `INSERT INTO planet (name, system, sector, region, classification) VALUES `;
    planets.forEach((planet) => {
      sql += `('${this.sanitizeString(planet.name)}', '${this.sanitizeString(planet.system)}', '${this.sanitizeString(
        planet.sector
      )}', '${this.sanitizeString(planet.region)}', '${this.sanitizeString(planet.classification)}'), `;
    });
    sql = sql.slice(0, sql.length - 2);
    return sql;
  }

  async insertPlanets(planets: Planet[]) {
    const sql = this.createInsertPlanetSql(planets);
    try {
      await this.client.query(sql);
    } catch (err) {
      console.error(err);
    }
  }

  async insertBookCharacterLinks(entities: Entity[], characters: Character[]) {
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const matchingEntities = entities.filter((e) => e.name === character.name);
      for (let j = 0; j < matchingEntities.length; j++) {
        try {
          const matchingEntity = matchingEntities[j];
          const bookRecords = await this.client.query(
            `SELECT * FROM book where title = '${this.sanitizeString(matchingEntity.bookTitle)}'`
          );
          const bookId = bookRecords.rows[0].id;
          const characterRecords = await this.client.query(
            `SELECT * FROM character where name = '${this.sanitizeString(matchingEntity.name)}'`
          );
          const characterId = characterRecords.rows[0].id;
          await this.client.query(`INSERT INTO link_book_character (book_id, character_id) VALUES (${bookId}, ${characterId})`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async insertBookPlanetLinks(entities: Entity[], planets: Planet[]) {
    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      const matchingEntities = entities.filter((e) => e.name === planet.name);
      for (let j = 0; j < matchingEntities.length; j++) {
        try {
          const matchingEntity = matchingEntities[j];
          const bookRecords = await this.client.query(
            `SELECT * FROM book where title = '${this.sanitizeString(matchingEntity.bookTitle)}'`
          );
          const bookId = bookRecords.rows[0].id;
          const planetRecords = await this.client.query(`SELECT * FROM planet where name = '${this.sanitizeString(matchingEntity.name)}'`);
          const planetId = planetRecords.rows[0].id;
          await this.client.query(`INSERT INTO link_book_planet (book_id, planet_id) VALUES (${bookId}, ${planetId})`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async insertAllData(crawler: Crawler) {
    console.log(`----> Inserting books`);
    await this.insertBooks(crawler.books);
    console.log(`----> Inserting characters`);
    await this.insertCharacters(crawler.characters);
    console.log(`----> Inserting planets`);
    await this.insertPlanets(crawler.planets);
    console.log(`----> Inserting book <-> character links`);
    await this.insertBookCharacterLinks(crawler.entities, crawler.characters);
    console.log(`----> Inserting book <-> planet links`);
    await this.insertBookPlanetLinks(crawler.entities, crawler.planets);
  }
}
