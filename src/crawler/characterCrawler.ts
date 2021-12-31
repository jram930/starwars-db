import { Character } from './character';
import { BASE_URL } from './constants';
import { Entity } from './entity';
import { PageFetcher } from './pageFetcher';
import cheerio from 'cheerio';

export class CharacterCrawler {
  isCharacterPage($) {
    const bioHeaders = $('h2:contains(Biographical information)').toArray();
    const hasBioSection = bioHeaders.length > 0;
    const novelAuthorsTag = $('div.page-header__categories a:contains(Novel authors)').toArray();
    const isAuthor = novelAuthorsTag.length > 0;
    return hasBioSection && !isAuthor;
  }

  extractBioInfo($: cheerio.Root, tag: string) {
    let bioInfo = 'Unknown';
    const bioElements = $(`div[data-source=${tag}]`).toArray();
    if (bioElements && bioElements.length) {
      const bioElement = $('a', bioElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (bioElement) {
        bioInfo = bioElement.toString();
        bioInfo = bioInfo.split(',')[0];
      }
    }
    return bioInfo;
  }

  async crawl(entities: Entity[]): Promise<Character[]> {
    const characters = [];
    const pageFetcher = new PageFetcher();
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      console.log(`------> Crawling ${entity.name} to see if it is a character`);
      const url = entity.link.toLowerCase().startsWith('http') ? entity.link : `${BASE_URL}${entity.link}`;
      const pageData = await pageFetcher.fetchPageData(url);
      const $ = await cheerio.load(pageData);
      if (this.isCharacterPage($)) {
        const name = entity.name;
        const species = this.extractBioInfo($, 'species');
        const homeworld = this.extractBioInfo($, 'homeworld');
        const gender = this.extractBioInfo($, 'gender');
        console.log(`--------> Name: ${name}, Species: ${species}, Gender: ${gender}, Homeworld: ${homeworld}`);
        characters.push(new Character(name, species, gender, homeworld));
      }
    }
    return characters;
  }
}
