export class Planet {
  name: string;
  system: string;
  sector: string;
  region: string;
  classification: string;

  constructor(name: string, system: string, sector: string, region: string, classification: string) {
    this.name = name;
    this.system = system;
    this.sector = sector;
    this.region = region;
    this.classification = classification;
  }
}
