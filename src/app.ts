// import express from 'express';
// const app = express();
// const port = 3000;
import { Crawler } from './crawler/crawler';
import { DBConnector } from './db/dbConnector';
const crawler = new Crawler();
const db = new DBConnector();

async function ingestData() {
  try {
    await db.connect();
    await db.wipeData();
    await crawler.crawl();
    await db.insertBooks(crawler.books);
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
