import { Moon } from './moon';

export class MoonCrawler {
  isMoonPage($) {
    const astroHeaders = $('h2:contains(Astrographical information)').toArray();
    const hasAstroSection = astroHeaders.length > 0;
    const planet = this.extractMoonInfo($, 'planet');
    const hasPlanetSection = planet !== 'Unknown';
    return hasAstroSection && hasPlanetSection;
  }

  extractMoonInfo($: cheerio.Root, tag: string) {
    let moonInfo = 'Unknown';
    const moonElements = $(`div[data-source=${tag}]`).toArray();
    if (moonElements && moonElements.length) {
      const moonElement = $('a', moonElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (moonElement) {
        moonInfo = moonElement.toString();
        moonInfo = moonInfo.split(',')[0];
      }
    }
    return moonInfo;
  }

  extractMoonInfoAlt($: cheerio.Root, tag: string) {
    let moonInfo = 'Unknown';
    const moonElements = $(`div[data-source=${tag}]`).toArray();
    if (moonElements && moonElements.length) {
      const moonElement = $('div', moonElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (moonElement) {
        moonInfo = moonElement.toString();
        moonInfo = moonInfo.split('[')[0];
      }
    }
    return moonInfo;
  }

  async crawl($: cheerio.Root, name): Promise<Moon> {
    const emoji = String.fromCodePoint(0x1f319);
    const planet = this.extractMoonInfo($, 'planet');
    const classification = this.extractMoonInfoAlt($, 'class');
    const system = this.extractMoonInfo($, 'system').replace(/ system/g, '');
    const sector = this.extractMoonInfo($, 'sector')
      .replace(/ subsector/g, '')
      .replace(/ sector/g, '');
    const region = this.extractMoonInfo($, 'region').replace(/ region/g, '');
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} MOON -- Name: ${name}, Planet: ${planet}, System: ${system}, Sector: ${sector}, Region: ${region}, Classification: ${classification}`
    );
    return new Moon(name, planet, system, sector, region, classification);
  }
}
