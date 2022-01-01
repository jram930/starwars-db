import { Vehicle } from './vehicle';

export class VehicleCrawler {
  isVehiclePage($) {
    const productionHeaders = $('h2:contains(Production information)').toArray();
    const hasProductionSection = productionHeaders.length > 0;
    const crew = this.extractVehicleInfo($, 'crew');
    const hasCrewSection = crew !== 'Unknown';
    return hasProductionSection && hasCrewSection;
  }

  extractVehicleInfo($: cheerio.Root, tag: string) {
    let vehicleInfo = 'Unknown';
    const vehicleElements = $(`div[data-source=${tag}]`).toArray();
    if (vehicleElements && vehicleElements.length) {
      const vehicleElement = $('a', vehicleElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (vehicleElement) {
        vehicleInfo = vehicleElement.toString();
        vehicleInfo = vehicleInfo.split(',')[0];
      }
    }
    return vehicleInfo;
  }

  extractVehicleInfoAlt($: cheerio.Root, tag: string) {
    let vehicleInfo = 'Unknown';
    const vehicleElements = $(`div[data-source=${tag}]`).toArray();
    if (vehicleElements && vehicleElements.length) {
      const vehicleElement = $('div', vehicleElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (vehicleElement) {
        vehicleInfo = vehicleElement.toString();
        vehicleInfo = vehicleInfo.split('[')[0];
      }
    }
    return vehicleInfo;
  }

  async crawl($: cheerio.Root, name): Promise<Vehicle> {
    const emoji = String.fromCodePoint(0x1f680);
    let model = this.extractVehicleInfo($, 'model');
    if (!model || model === '' || model === 'Unknown' || model.startsWith('[')) {
      model = this.extractVehicleInfoAlt($, 'model');
    }
    console.log('\x1b[36m%s\x1b[0m', `--------> ${emoji} VEHICLE -- Name: ${name}, Model: ${model}`);
    return new Vehicle(name, model);
  }
}
