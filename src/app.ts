// import express from 'express';
// const app = express();
// const port = 3000;
import { Crawler } from './crawler/crawler';
import { DBConnector } from './db/dbConnector';
const crawler = new Crawler();
const db = new DBConnector();

// Generated with https://patorjk.com/software/taag/#p=display&f=Big%20Money-ne&t=STAR%20WARS%20DB%20
console.log(`
  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$$        /$$      /$$  /$$$$$$  /$$$$$$$   /$$$$$$        /$$$$$$$  /$$$$$$$       
 /$$__  $$|__  $$__//$$__  $$| $$__  $$      | $$  /$ | $$ /$$__  $$| $$__  $$ /$$__  $$      | $$__  $$| $$__  $$      
| $$  \\__/   | $$  | $$  \\ $$| $$  \\ $$      | $$ /$$$| $$| $$  \\ $$| $$  \\ $$| $$  \\__/      | $$  \\ $$| $$  \\ $$      
|  $$$$$$    | $$  | $$$$$$$$| $$$$$$$/      | $$/$$ $$ $$| $$$$$$$$| $$$$$$$/|  $$$$$$       | $$  | $$| $$$$$$$       
 \\____  $$   | $$  | $$__  $$| $$__  $$      | $$$$_  $$$$| $$__  $$| $$__  $$ \\____  $$      | $$  | $$| $$__  $$      
 /$$  \\ $$   | $$  | $$  | $$| $$  \\ $$      | $$$/ \\  $$$| $$  | $$| $$  \\ $$ /$$  \\ $$      | $$  | $$| $$  \\ $$      
|  $$$$$$/   | $$  | $$  | $$| $$  | $$      | $$/   \\  $$| $$  | $$| $$  | $$|  $$$$$$/      | $$$$$$$/| $$$$$$$/      
 \\______/    |__/  |__/  |__/|__/  |__/      |__/     \\__/|__/  |__/|__/  |__/ \\______/       |_______/ |_______/       
                                                                                                                      
                                                                                                                      
                                                                                                                      
`);

async function ingestData() {
  try {
    console.log(`--> Connecting to DB`);
    await db.connect();
    console.log(`--> Wiping existing data`);
    await db.wipeData();
    console.log(`--> Crawling wookiepedia`);
    await crawler.crawl();
    console.log(`--> Inserting data`);
    await db.insertAllData(crawler);
    console.log('--> All data crawled and loaded');
  } catch (err) {
    console.error(err);
  } finally {
    await db.disconnect();
  }
}

ingestData();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });
