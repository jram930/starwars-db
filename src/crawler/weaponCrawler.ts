import { Weapon } from './weapon';

export class WeaponCrawler {
  isWeaponPage($) {
    const productionHeaders = $('h2:contains(Production information)').toArray();
    const hasProductionSection = productionHeaders.length > 0;
    const range = this.extractWeaponInfo($, 'range');
    const hasRangeSection = range !== 'Unknown';
    return hasProductionSection && hasRangeSection;
  }

  extractWeaponInfo($: cheerio.Root, tag: string) {
    let weaponInfo = 'Unknown';
    const weaponElements = $(`div[data-source=${tag}]`).toArray();
    if (weaponElements && weaponElements.length) {
      const weaponElement = $('a', weaponElements[0])
        .map((_, a) => $(a).text())
        .toArray();
      if (weaponElement) {
        weaponInfo = weaponElement.toString();
        weaponInfo = weaponInfo.split(',')[0];
      }
    }
    return weaponInfo;
  }

  async crawl($: cheerio.Root, name): Promise<Weapon> {
    const emoji = String.fromCodePoint(0x1f5e1);
    const type = this.extractWeaponInfo($, 'type');
    console.log('\x1b[36m%s\x1b[0m', `--------> ${emoji} WEAPON -- Name: ${name}, Type: ${type}`);
    return new Weapon(name, type);
  }
}
