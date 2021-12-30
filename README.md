# Star Wars Extended Universe Database

A database to curate knowledge about the Star Wars Extended Universe (EU) from four years after the Battle of Yavin (4 ABY) onward (as that is the time period of books I tend to focus on reading).

For now this repo is concerned with getting the broad strokes of knowledge going by scraping [Wookiepedia](https://starwars.fandom.com/wiki/Main_Page) for a large portion of the database. Once that is in decent shape I plan on curating it with my own notes as I continue reading the books.

Currently focused on capturing:

- Books
- Characters
- Planets

Eventually would like to focus on some variations of the following:

- Events
- Vehicles
- Weapons
- Factions

Once the databaase is in decent shape would like to serve it up in at least tabular format on a website.

# Instructions

- Set up a local postgres on your machine (I set up mine up in Docker) with username `postgres` and passowrd `password`
- Create a `star_wars` database
- Run `npm run start` to prettify, compile, and run the application

# Implementation Notes

To avoid getting blocked by Wookiepedia, I have implemented a couple of safeguards:

- Everytime a page from Wookiepedia is scraped, the data is stored to disk under the `wookiepedia` folder. The `useFileIfPossible` variable in `pageFetcher.ts` is defaulted to `true`. When this is `true`, anytime a page would be scraped from Wookiepedia, the data is fetched from disk instead.
- An in-memory cache is kept with the contents of each page that was scraped. If a page has already been scraped/loaded this run, it will be loaded from memory instead.
- If a page absolutely must be scraped from Wookiepedia, a randomized sleep is used to have a delay of 20 to 120 seconds between each fetch.
