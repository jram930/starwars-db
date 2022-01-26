# Star Wars Extended Universe Database

A database to curate knowledge about the Star Wars Extended Universe (EU) from four years after the Battle of Yavin (4 ABY) onward (as that is the time period of books I tend to focus on reading).

For now this repo is concerned with getting the broad strokes of knowledge going by scraping [Wookiepedia](https://starwars.fandom.com/wiki/Main_Page) for a large portion of the database. Once that is in decent shape I plan on curating it with my own notes as I continue reading the books.

Currently focused on capturing:

- Books
- Characters
- Planets
- Moons
- Vehicles
- Weapons

Eventually would like to focus on some variations of the following:

- Events
- Factions
- Races/Species

Once the databaase is in decent shape would like to serve it up in at least tabular format on a website.

# Sample Crawler Output

```
--------> 🗡 WEAPON -- Name: Amphistaff, Type: Exotic melee weapon, Manufacturer: Yuuzhan Vong, Model: Amphistaff
 Amphistaffs were genetically engineered serpentine creatures that served as the primary anti-personnel weapons of the Yuuzhan Vong.

--------> 👩 CHARACTER -- Name: Vana Dorja, Species: Human, Gender: Female, Homeworld: Unknown
 Vana Dorja was a Human female who served as a commander in the Navy of the Imperial Remnant during the Yuuzhan Vong War. She was an inquisitive and observant woman with a partisan Imperial frame of mind. Her family had a long history of naval service to the Galactic Republic and Galactic Empire, with her father having captained an Imperial Star Destroyer into the era of the Remnant. Although the Remnant's Council of Moffs chose not to participate in the war, Dorja was sent on an allegedly commercial mission to the New Republic's capital planet of Coruscant, where she witnessed the extra-galactic Yuuzhan Vong attack the world in 27 ABY. She escaped before the invaders conquered the capital, and in 28 ABY, she made her way to the New Republic's provisional capital planet of Mon Calamari and requested a ride back to Imperial Space.

--------> 🪐 PLANET -- Name: Bastion, System: Sartinaynian, Sector: Braxant, Region: Outer Rim Territories, Classification: Terrestrial
 Bastion, originally Sartinaynian, was the capital world of the Imperial Remnant, a successor state of the Galactic Empire, located in the Braxant sector in the Outer Rim Territories, and later the Fel Empire and Empire-in-exile. Bastion was located in the Sartinaynian system at the terminus of the trade route known as the Braxant Run.

--------> 🚀 VEHICLE -- Name: Nssis-class Clawcraft, Model: Nssis-class Clawcraft, Manufacturer: Unknown shipyards affiliated with the Chiss Ascendancy and the Empire of the Hand, Classification: Starfighter
 The Nssis-class Clawcraft was a starfighter typically associated with the Chiss, but in fact was a hybrid development of standard Imperial technology.

--------> 👨 CHARACTER -- Name: Komm Karsh, Species: Yuuzhan Vong, Gender: Male, Homeworld: Unknown
 Komm Karsh was a male Yuuzhan Vong warrior holding the rank of Supreme Commander in 28 ABY. Under Supreme Overlord Shimrra Jamaane, the Yuuzhan Vong invaded the galaxy, and Karsh was the leader of the Vong's only strategic buffer in case of a major enemy reprisal. However, he perished along with the majority of his fleet in 28 ABY, during his attempt to examine the contents of the libraries of the captured planet Obroa-skai. Karsh's death and the loss of his fleet forced the Yuuzhan Vong empire to refrain from offensive actions.

--------> 👨 CHARACTER -- Name: Cal Omas, Species: Human, Gender: Male, Homeworld: Alderaan
 Cal Omas was a male Alderaanian who served as the last Chief of State of the New Republic, and the first of the Galactic Federation of Free Alliances, of which he was a founder. He began his service in galactic affairs when he joined the Alliance to Restore the Republic following the destruction of his home planet. He succeeded Leia Organa as Senator of the People of Alderaan in the New Republic, and served in that position for several years, until Chief of State Borsk Fey'lya's suicide on Coruscant during the Yuuzhan Vong attack on the capital.

--------> 🪐 PLANET -- Name: Zonama Sekot, System: Mobile, Sector: Mobile, Region: Mobile, Classification: Terrestrial
 Zonama Sekot (Ferroan for "World of Body and Mind") was a living, sentient world capable of traveling through space. Zonama was the planet itself, while Sekot was the living intelligence of Zonama.[5] It was also the seed of the original Yuuzhan Vong homeworld, Yuuzhan'tar, which had been destroyed during the Cremlevian War.[6][3]

--------> 👨 CHARACTER -- Name: Ch'Gang Hool, Species: Yuuzhan Vong, Gender: Male, Homeworld: Koros-Strohna
 Ch'Gang Hool was the Master Shaper in charge of the worldshaping of Yuuzhan'tar. He was tasked with growing the thirteen dhuryams, and supervising which one would become the World Brain.

--------> 🪐 PLANET -- Name: Ebaq, System: Treskov, Sector: Unknown, Region: Deep Core, Classification: Unknown
 Ebaq was a gas giant in the Treskov system and the fifth planet of that system, orbiting Treskov 115-W. The planet had eleven moons, including Ebaq 9.[1]

--------> 🌙 MOON -- Name: Ebaq 9, Planet: Ebaq, System: Treskov, Sector: Unknown, Region: Deep Core, Classification: Unknown
 Ebaq 9 was a natural satellite of the Deep Core planet Ebaq located in the Treskov system.[1] The moon was a barren planetoid.
 ```

# Instructions

- Set up a local postgres on your machine (I set up mine up in Docker) with username `postgres` and passowrd `password`
- Create a `star_wars` database
- Run `npm run start` to prettify, compile, and run the application

# Implementation Notes

To avoid getting blocked by Wookiepedia, I have implemented a couple of safeguards:

- Everytime a page from Wookiepedia is scraped, the data is stored to disk under the `wookiepedia` folder. The `useFileIfPossible` variable in `pageFetcher.ts` is defaulted to `true`. When this is `true`, anytime a page would be scraped from Wookiepedia, the data is fetched from disk instead.
- An in-memory cache is kept with the contents of each page that was scraped. If a page has already been scraped/loaded this run, it will be loaded from memory instead.
- If a page absolutely must be scraped from Wookiepedia, a randomized sleep is used to have a delay of 5 to 30 seconds between each fetch.
