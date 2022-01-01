export class Weapon {
  name: string;
  type: string;
  manufacturer: string;
  model: string;

  constructor(name: string, type: string, manufacturer: string, model: string) {
    this.name = name;
    this.type = type;
    this.manufacturer = manufacturer;
    this.model = model;
  }
}
