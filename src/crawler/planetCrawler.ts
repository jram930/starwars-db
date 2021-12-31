import { BASE_URL } from './constants';
import { Entity } from './entity';
import { PageFetcher } from './pageFetcher';
import cheerio from 'cheerio';
import { Planet } from './planet';

const seenBefore = {};

export class PlanetCrawler {
  isPlanetPage($) {
    const astroHeaders = $('h2:contains(Astrographical information)').toArray();
    const hasAstroSection = astroHeaders.length > 0;
    const moons = this.extractPlanetInfo($, 'moons');
    const hasMoonsSection = moons !== 'Unknown';
    return hasAstroSection && hasMoonsSection;
  }

  extractPlanetInfo($: cheerio.Root, tag: string) {
    let planetInfo = 'Unknown';
    const planetElements = $(`div[data-source=${tag}]`).toArray();
    if (planetElements && planetElements.length) {
      const planetElement = $('a', planetElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (planetElement) {
        planetInfo = planetElement.toString();
        planetInfo = planetInfo.split(',')[0];
      }
    }
    return planetInfo;
  }

  async crawl(entities: Entity[]): Promise<Planet[]> {
    const planets = [];
    const pageFetcher = new PageFetcher();
    const emoji = String.fromCodePoint(0x1fa90);
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const url = entity.link.toLowerCase().startsWith('http') ? entity.link : `${BASE_URL}${entity.link}`;
      if (!seenBefore[url]) {
        console.log(`------> Crawling ${entity.name} from ${entity.bookTitle} to see if it is a planet (${i + 1}/${entities.length})`);
        const pageData = await pageFetcher.fetchPageData(url);
        const $ = await cheerio.load(pageData);
        if (this.isPlanetPage($)) {
          const name = entity.name;
          const classification = 'Unknown';
          const numSuns = -1;
          const numMoons = -1;
          const system = 'Unknown';
          const sector = 'Unknown';
          const region = 'Unknown';
          const distanceFromCore = -1;
          console.log(
            '\x1b[36m%s\x1b[0m',
            `--------> ${emoji} PLANET -- Name: ${name}, System: ${system}, Sector: ${sector}, ${region}, Classification: ${classification}, Suns: ${numSuns}, Moons: ${numMoons}, Distance: ${distanceFromCore}`
          );
          planets.push(new Planet(name, classification, numSuns, numMoons, system, sector, region, distanceFromCore));
          seenBefore[url] = true;
        }
      }
    }
    return planets;
  }
}
