import { extractSidePanelInfo } from './crawlUtil';
import { Vehicle } from './vehicle';

export class VehicleCrawler {
  isVehiclePage($) {
    const productionHeaders = $('h2:contains(Production information)').toArray();
    const hasProductionSection = productionHeaders.length > 0;
    const crew = extractSidePanelInfo($, 'crew');
    const hasCrewSection = crew !== 'Unknown';
    return hasProductionSection && hasCrewSection;
  }

  async crawl($: cheerio.Root, name): Promise<Vehicle> {
    const emoji = String.fromCodePoint(0x1f680);
    const model = extractSidePanelInfo($, 'model');
    const manufacturer = extractSidePanelInfo($, 'manufacturer');
    const classification = extractSidePanelInfo($, 'class');
    console.log(
      '\x1b[36m%s\x1b[0m',
      `--------> ${emoji} VEHICLE -- Name: ${name}, Model: ${model}, Manufacturer: ${manufacturer}, Classification: ${classification}`
    );
    return new Vehicle(name, model, manufacturer, classification);
  }
}
