export class Planet {
  name: string;
  classification: string;
  numSuns: number;
  numMoons: number;
  system: string;
  sector: string;
  region: string;
  distanceFromCore: number;

  constructor(
    name: string,
    classification: string,
    numSuns: number,
    numMoons: number,
    system: string,
    sector: string,
    region: string,
    distanceFromCore: number
  ) {
    this.name = name;
    this.classification = classification;
    this.numSuns = numSuns;
    this.numMoons = numMoons;
    this.system = system;
    this.sector = sector;
    this.region = region;
    this.distanceFromCore = distanceFromCore;
  }
}
