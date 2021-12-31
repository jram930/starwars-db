import axios from 'axios';
import { PageCache } from './pageCache';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import path from 'path';

const useFileIfPossible = true;
const pageCache = new PageCache();

// Cache crawled pages to local filesystem to play nice with the website and not get put on a bad list
const cacheDir = path.resolve(__dirname, '../../wookiepedia');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

export class PageFetcher {
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  cleanUrlForFS(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  async fetchPageData(url: string): Promise<Buffer> {
    if (pageCache[url]) {
      return pageCache[url];
    }

    const safeUrl = this.cleanUrlForFS(url);
    const filepath = path.resolve(cacheDir, safeUrl);
    if (useFileIfPossible) {
      if (await fs.existsSync(filepath)) {
        return await fsPromises.readFile(filepath);
      }
    }

    // Randomly sleep from 5 - 30 seconds
    await this.sleep(5000 + this.getRandomInt(25) * 1000);
    // await this.sleep(5000);
    // console.log(`Fetching ${url}`);
    const response = await axios.get(url);
    pageCache[url] = response.data;
    await fsPromises.writeFile(filepath, response.data);
    return response.data;
  }
}
