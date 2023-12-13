// import { stat } from 'fs';
// import { resolve } from 'path';
// import { Page, chromium } from 'playwright';
// import * as crypto from 'crypto';
// import { mkdirSync } from 'fs';
// import { join } from 'path';
// import { writeFileSync } from 'fs';

// let page: Page;

// let dir = 'casesar Salad';
// mkdirSync(dir, { recursive: true });

// async function main() {
//   let broswer = await chromium.launch({ headless: false });
//   page = await broswer.newPage();

//   //   await page.goto('https://www.youtube.com/');
//   //   await page.getByPlaceholder('搜尋').click();
//   //   await page.getByPlaceholder('搜尋').fill('messi unbelievable goal');
//   //   await page.getByPlaceholder('搜尋').press('Enter');
//   //   await page.waitForSelector('a#video-title');

//   let searchKeyword = 'Caesar Salad openrice';
//   let altKeyword = 'caesar salad';

//   await page.goto('https://www.google.com/');
//   await page.getByLabel('搜尋', { exact: true }).click();
//   await page.getByLabel('搜尋', { exact: true }).fill(searchKeyword);
//   await page.keyboard.press('Enter');
//   //   await page.waitForTimeout(3000);
//   await page.waitForSelector('[role=link]');
//   await page.waitForTimeout(200);
//   await page.getByRole('link', { name: '圖片', exact: true }).click();

// for (;;) {
//   let result = await page.evaluate(async (altKeyword) => {
//     function findText(text: string) {
//       for (let div of document.querySelectorAll('div')) {
//         if (div.textContent?.trim() == text) {
//           return div;
//         }
//       }
//     }
//   }
// }
//   for (;;) {
//     let result = await page.evaluate(async (altKeyword) => {
//       function findText(text: string) {
//         // for (let div of document.querySelectorAll('div')) {
//         //   if (div.textContent.trim() == text) {
//         //     return div;
//         //   }
//         // }
//       }

//       function sleep(ms: number) {
//         return new Promise((resolve) => setTimeout(resolve, ms));
//       }
//       async function scroll(e: Element) {
//         e.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }

//       // let images: { alt: string; src: string }[] = [];

//       let items = document.querySelectorAll('[role=listitem]');
//       if (items.length == 0) {
//         await sleep(500);
//         console.log('wait for first element');
//         return { status: 'looping' };
//       }
//       return { status: 'done' };

//       // for (let item of items) {
//       //   if (!item.querySelector('h3') || !item.querySelector('a img')) {
//       //     continue;
//       //   }

//       //   let img = item.querySelector('img');
//       //   let alt = img.alt;
//       //   if (!alt.includes(altKeyword)) {
//       //     continue;
//       //   }
//       // }

//       // let status =
//       //   document.querySelector<HTMLElement>('[data-status]')?.dataset?.status;

//       // if (status != '3') {
//       //   let more = document.querySelector<HTMLInputElement>(
//       //     'input[value=顯示更多結果]',
//       //   );
//       // }

//       // return { images };
//     }, altKeyword);
//     console.log('status:', result.status);
//     if (result.status == 'done') {
//       break;
//     }
//     // if (result.status === '3') {
//     //   console.log('status is 3');
//     //   break;
//     // }
//   }
// }

// main().catch((e) => {
//   console.log(e);
// });
