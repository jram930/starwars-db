import { Character } from './character';

export class CharacterCrawler {
  isCharacterPage($) {
    const bioHeaders = $('h2:contains(Biographical information)').toArray();
    const hasBioSection = bioHeaders.length > 0;
    const novelAuthorsTag = $('div.page-header__categories a:contains(Novel authors)').toArray();
    const isAuthor = novelAuthorsTag.length > 0;
    const directorsTag = $('div.page-header__categories a:contains(Directors)').toArray();
    const isDirector = directorsTag.length > 0;
    const producersTag = $('div.page-header__categories a:contains(Producers)').toArray();
    const isProducer = producersTag.length > 0;
    return hasBioSection && !isAuthor && !isDirector && !isProducer;
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

  async crawl($: cheerio.Root, name: string): Promise<Character> {
    let emoji = String.fromCodePoint(0x1f9d1);
    const species = this.extractBioInfo($, 'species');
    const homeworld = this.extractBioInfo($, 'homeworld');
    const gender = this.extractBioInfo($, 'gender');
    if (gender.toLowerCase() === 'male') {
      emoji = String.fromCodePoint(0x1f468);
    } else if (gender.toLowerCase() === 'female') {
      emoji = String.fromCodePoint(0x1f469);
    }
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} CHARACTER -- Name: ${name}, Species: ${species}, Gender: ${gender}, Homeworld: ${homeworld}`
    );
    return new Character(name, species, gender, homeworld);
  }
}
