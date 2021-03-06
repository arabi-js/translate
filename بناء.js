const fs = require('fs');
const path = require('path');

const libPath = path.resolve(__dirname, './حزمة/');
const indexPath = path.resolve(__dirname, './مصدر/مدخل.js');
const translatorPath = path.resolve(__dirname, './مصدر/مترجم.js');
const requirePath = path.resolve(__dirname, './مصدر/استدعي.js');

let translatorContent = fs.readFileSync(translatorPath, { encoding: 'utf8' });
let requireContent = fs.readFileSync(requirePath, { encoding: 'utf8' });
requireContent = requireContent.split('\n');
requireContent.shift();
requireContent = requireContent.join('\n');

// this is the same function used in the webpack config of arjs: https://github.com/scicave/javascript-in-arabic/blob/%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A/webpack.config.js
function replaceIndents(s) {
  return s.replace(/^(  )+/gm, (m)=>new Array(m.length/2+1).fill('').join('_@_@indent@_@_'));
}

let translatorCodeStr = JSON.stringify(replaceIndents(translatorContent.replace('exports.__default = ', '')));
let requireCodeStr = JSON.stringify(replaceIndents(requireContent.replace('exports.__default = ', '')));

const indexCode = fs.readFileSync(indexPath, { encoding: 'utf8' })
  .replace('REQUIRE_CODE', requireCodeStr)
  .replace('TRANSLATOR_CODE', translatorCodeStr);

fs.mkdirSync(libPath, { recursive: true });
fs.writeFileSync(path.resolve(libPath, './مدخل.js'), indexCode);
fs.copyFileSync(translatorPath, path.resolve(libPath, './مترجم.js'));
fs.copyFileSync(requirePath, path.resolve(libPath, './استدعي.js'));
