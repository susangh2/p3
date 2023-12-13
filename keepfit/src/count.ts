import { readdirSync, unlink, unlinkSync } from 'fs';
import { resolve } from 'path';

// let dir = 'caesar';
let dir = 'burgers';
let dirPath = resolve(__dirname, '..', dir);
let files = readdirSync(dirPath, 'utf-8');

// files.forEach((element) => {
//   if (element.endsWith('.txt')) {
//     let filePath = dirPath + '/' + element;
//     unlinkSync(filePath);
//     // console.log(filePath);
//   }
// });

console.log(files.length);
