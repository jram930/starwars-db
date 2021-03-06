import { extractSidePanelInfo, extractSummary } from './crawlUtil';
import { Planet } from './planet';

export class PlanetCrawler {
  isPlanetPage($) {
    const astroHeaders = $('h2:contains(Astrographical information)').toArray();
    const hasAstroSection = astroHeaders.length > 0;
    const moons = extractSidePanelInfo($, 'moons');
    const hasMoonsSection = moons !== 'Unknown';
    return hasAstroSection && hasMoonsSection;
  }

  async crawl($: cheerio.Root, name): Promise<Planet> {
    const emoji = String.fromCodePoint(0x1fa90);
    const classification = extractSidePanelInfo($, 'class');
    const system = extractSidePanelInfo($, 'system').replace(/ system/g, '');
    const sector = extractSidePanelInfo($, 'sector')
      .replace(/ subsector/g, '')
      .replace(/ sector/g, '');
    const region = extractSidePanelInfo($, 'region').replace(/ region/g, '');
    const summary = extractSummary($);
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} PLANET -- Name: ${name}, System: ${system}, Sector: ${sector}, Region: ${region}, Classification: ${classification}`
    );
    console.log('\x1b[35m', summary);
    return new Planet(name, system, sector, region, classification);
  }
}
