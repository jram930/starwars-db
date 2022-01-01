import { extractSidePanelInfo } from './crawlUtil';
import { Weapon } from './weapon';

export class WeaponCrawler {
  isWeaponPage($) {
    const productionHeaders = $('h2:contains(Production information)').toArray();
    const hasProductionSection = productionHeaders.length > 0;
    const range = extractSidePanelInfo($, 'range');
    const hasRangeSection = range !== 'Unknown';
    return hasProductionSection && hasRangeSection;
  }

  async crawl($: cheerio.Root, name): Promise<Weapon> {
    const emoji = String.fromCodePoint(0x1f5e1);
    const type = extractSidePanelInfo($, 'type');
    const manufacturer = extractSidePanelInfo($, 'manufacturer');
    const model = extractSidePanelInfo($, 'model');
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} WEAPON -- Name: ${name}, Type: ${type}, Manufacturer: ${manufacturer}, Model: ${model}`
    );
    return new Weapon(name, type, manufacturer, model);
  }
}
