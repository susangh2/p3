import { stat } from 'fs';
import { resolve } from 'path';
import { Page, chromium } from 'playwright';
import * as crypto from 'crypto';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { writeFileSync } from 'fs';

let page: Page;

let dir = 'burgers';
mkdirSync(dir, { recursive: true });

async function main() {
  let broswer = await chromium.launch({ headless: false });
  page = await broswer.newPage();

  //   await page.goto('https://www.youtube.com/');
  //   await page.getByPlaceholder('搜尋').click();
  //   await page.getByPlaceholder('搜尋').fill('messi unbelievable goal');
  //   await page.getByPlaceholder('搜尋').press('Enter');
  //   await page.waitForSelector('a#video-title');

  // let searchKeyword = '卡邦尼 openrice';
  // let altKeyword = '卡邦尼意粉';

  // let searchKeyword = 'caesar salad food review';
  // let altKeywords = 'caesar salad';

  let searchKeyword = 'burger with fries review';
  let altKeywords = ['burger'];
  // let searchKeyword = 'mushroom risotto';
  // let altKeywords = ['mushroom risotto '];

  await page.goto('https://www.google.com/');
  await page.getByLabel('搜尋', { exact: true }).click();
  await page.getByLabel('搜尋', { exact: true }).fill(searchKeyword);
  await page.keyboard.press('Enter');
  //   await page.waitForTimeout(3000);
  await page.waitForSelector('[role=link]');
  await page.getByRole('link', { name: '圖片', exact: true }).click();

  //   await page.getByRole('button', { name: '顯示更多結果' }).click();
  // await page.waitForTimeout(3000);

  // downloadPhoto
  let downloaded = new Set();
  for (;;) {
    let result = await page.evaluate(async (altKeywords) => {
      function findText(text: string) {
        for (let div of document.querySelectorAll('div')) {
          if (div.textContent?.trim() == text) {
            return div;
          }
        }
      }

      function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      async function scroll(e: Element) {
        e.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await sleep(500);
      }

      let images: { alt: string; src: string }[] = [];

      let items = document.querySelectorAll('[role=listitem]');
      if (items.length == 0) {
        //   console.log('wait first listitem');
        await sleep(500);
        return { images };
      }
      item_loop: for (let item of items) {
        if (!item.querySelector('h3') || !item.querySelector('a img')) {
          continue;
        }
        let img = item.querySelector('img');
        let alt = img?.alt;
        if (!img || !alt) continue;
        let altLower = alt.toLowerCase();
        for (let altKeyword of altKeywords)
          if (!altLower.includes(altKeyword)) continue item_loop;
        if (!img.src) {
          // console.log('wait img.src:', img);
          await scroll(item);
          return { images };
        }
        images.push({ alt, src: img.src });
      }

      let status =
        document.querySelector<HTMLElement>('[data-status]')?.dataset?.status;
      // console.log('status:', status);

      if (status != '3') {
        let more = document.querySelector<HTMLInputElement>(
          'input[value=顯示更多結果]',
        );
        if (more) {
          await scroll(more);
          more.click();
        }
      }

      return { images, status };
    }, altKeywords);

    console.log('images:', result.images.length, 'status:', result.status);

    for (let image of result.images) {
      if (downloaded.has(image.src)) continue;
      downloaded.add(image.src);

      let res = await fetch(image.src);
      let blob = await res.blob();
      let bin = await blob.arrayBuffer();
      let buffer = Buffer.from(bin);
      let hash = crypto.createHash('sha256');
      hash.write(buffer);
      let digest = hash.digest().toString('hex');
      let filename = digest + '.' + blob.type.split('/').pop()!.split(';')[0];
      let file = join(dir, filename);
      writeFileSync(file, buffer);

      console.log('saved', filename, image.alt);

      filename = digest + '.txt';
      file = join(dir, filename);
      writeFileSync(file, image.alt);
    }

    if (result.status == '3') {
      break;
    }
  }
}

// async function collectProduect(){

// }

main().catch((e) => {
  console.log(e);
});
