export class Vehicle {
  name: string;
  model: string;
  manufacturer: string;
  classification: string;

  constructor(name: string, model: string, manufacturer: string, classificiation: string) {
    this.name = name;
    this.model = model;
    this.manufacturer = manufacturer;
    this.classification = classificiation;
  }
}
