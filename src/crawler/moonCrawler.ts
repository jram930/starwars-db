import { extractSidePanelInfo, extractSummary } from './crawlUtil';
import { Moon } from './moon';

export class MoonCrawler {
  isMoonPage($) {
    const astroHeaders = $('h2:contains(Astrographical information)').toArray();
    const hasAstroSection = astroHeaders.length > 0;
    const planet = extractSidePanelInfo($, 'planet');
    const hasPlanetSection = planet !== 'Unknown';
    return hasAstroSection && hasPlanetSection;
  }

  async crawl($: cheerio.Root, name): Promise<Moon> {
    const emoji = String.fromCodePoint(0x1f319);
    const planet = extractSidePanelInfo($, 'planet');
    const classification = extractSidePanelInfo($, 'class');
    const system = extractSidePanelInfo($, 'system').replace(/ system/g, '');
    const sector = extractSidePanelInfo($, 'sector')
      .replace(/ subsector/g, '')
      .replace(/ sector/g, '');
    const region = extractSidePanelInfo($, 'region').replace(/ region/g, '');
    const summary = extractSummary($);
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} MOON -- Name: ${name}, Planet: ${planet}, System: ${system}, Sector: ${sector}, Region: ${region}, Classification: ${classification}`
    );
    console.log('\x1b[35m', summary);
    return new Moon(name, planet, system, sector, region, classification);
  }
}
