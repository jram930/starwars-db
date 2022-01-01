import { Planet } from './planet';

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

  extractPlanetInfoAlt($: cheerio.Root, tag: string) {
    let planetInfo = 'Unknown';
    const planetElements = $(`div[data-source=${tag}]`).toArray();
    if (planetElements && planetElements.length) {
      const planetElement = $('div', planetElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (planetElement) {
        planetInfo = planetElement.toString();
        planetInfo = planetInfo.split('[')[0];
      }
    }
    return planetInfo;
  }

  async crawl($: cheerio.Root, name): Promise<Planet> {
    const emoji = String.fromCodePoint(0x1fa90);
    const classification = this.extractPlanetInfoAlt($, 'class');
    const system = this.extractPlanetInfo($, 'system').replace(/ system/g, '');
    const sector = this.extractPlanetInfo($, 'sector')
      .replace(/ subsector/g, '')
      .replace(/ sector/g, '');
    const region = this.extractPlanetInfo($, 'region').replace(/ region/g, '');
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} PLANET -- Name: ${name}, System: ${system}, Sector: ${sector}, Region: ${region}, Classification: ${classification}`
    );
    return new Planet(name, system, sector, region, classification);
  }
}
