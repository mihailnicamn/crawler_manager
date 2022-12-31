const puppeteer = require('puppeteer');
const scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await page.goto('https://www.google.com/test1');
  var returnData = {};
  var test = parseFloat('1');
  test = test
  await page.click('document')
  await page.waitForTimeout(1000)
  returnData.test = await page.$(test).test()
  returnData.test = test
  await page.type(test)
  await page.evaluate(async () => {
    test
  })
  returnData.test = await page.evaluate(async () => {
    return await new Promise(resolve => {
      test
    })
  })

  await page.goto('https://www.google.com/test2');
  var returnData = {};
  var test = parseFloat('1');
  test = test
  await page.click('document')
  await page.waitForTimeout(1000)
  returnData.test = await page.$(test).test()
  returnData.test = test
  await page.type(test)
  await page.evaluate(async () => {
    test
  })
  returnData.test = await page.evaluate(async () => {
    return await new Promise(resolve => {
      test
    })
  })

  await page.goto('https://www.google.com/test3');
  var returnData = {};
  var test = parseFloat('1');
  test = test
  await page.click('document')
  await page.waitForTimeout(1000)
  returnData.test = await page.$(test).test()
  returnData.test = test
  await page.type(test)
  await page.evaluate(async () => {
    test
  })
  returnData.test = await page.evaluate(async () => {
    return await new Promise(resolve => {
      test
    })
  })
  return returnData;
}
scrape().then((data) => {
  const files = require('fs');
  var crawl_file = files.readFileSync(CRAWL_FILE, 'utf8');
  crawl_file = JSON.parse(crawl_file);
  crawl_file.push({
    "id": new Date().getTime(),
    "data": data
  });
});