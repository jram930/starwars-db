export class Character {
  name: string;
  species: string;
  gender: string;
  homeworld: string;

  constructor(name: string, species: string, gender: string, homeworld: string) {
    this.name = name;
    this.species = species;
    this.gender = gender;
    this.homeworld = homeworld;
  }
}
