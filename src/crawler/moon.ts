export class Moon {
  name: string;
  planet: string;
  system: string;
  sector: string;
  region: string;
  classification: string;

  constructor(name: string, planet: string, system: string, sector: string, region: string, classification: string) {
    this.name = name;
    this.planet = planet;
    this.system = system;
    this.sector = sector;
    this.region = region;
    this.classification = classification;
  }
}
