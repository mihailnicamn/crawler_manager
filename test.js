const cfg = 
{name: `My Browser Info 🤖`,
name_html : `My Browser Info 🤖`,
url: `https://mybrowserinfo.com/detail.asp`,
script : `
await page.waitForSelector('span');
const result = await page.evaluate(() => {
  var results = {};
  const keys = [...document.querySelectorAll('dt')].map((key) => key.innerText);
  const values = [...document.querySelectorAll('dd')].map((value) => value.innerText);
  keys.forEach((key, index) => {
    results[key] = values[index];
  });
  return results;
});
returnResults(result);`
}
const files = require("fs");
const filename = `./${Math.random()}_testRun.js`
files.writeFileSync(filename, JSON.stringify(cfg));