// import express from 'express';
// const app = express();
// const port = 3000;
import { Crawler } from './crawler/crawler';
const crawler = new Crawler();

crawler.crawl();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });
