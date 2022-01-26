import { Character } from './character';
import { extractSidePanelInfo, extractSummary } from './crawlUtil';

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

  async crawl($: cheerio.Root, name: string): Promise<Character> {
    let emoji = String.fromCodePoint(0x1f9d1);
    const species = extractSidePanelInfo($, 'species');
    const homeworld = extractSidePanelInfo($, 'homeworld');
    const gender = extractSidePanelInfo($, 'gender');
    const summary = extractSummary($);
    if (gender.toLowerCase() === 'male') {
      emoji = String.fromCodePoint(0x1f468);
    } else if (gender.toLowerCase() === 'female') {
      emoji = String.fromCodePoint(0x1f469);
    }
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} CHARACTER -- Name: ${name}, Species: ${species}, Gender: ${gender}, Homeworld: ${homeworld}`
    );
    console.log('\x1b[35m', summary);
    return new Character(name, species, gender, homeworld);
  }
}
