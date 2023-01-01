
global.scraper = {};
const userAgent = require('user-agents');
//custom functions
async function scrollDown(page, time = 10) {
  await page.evaluate(async (time) => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, time);
    });
  });
}
async function scrollUp(page, time = 10) {
  await page.evaluate(async (time) => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, -distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, time);
    });
  });
}
async function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
const safeUndefined = (object,key) => {
  if(typeof object == "undefined"){
    return undefined
  }
  if(typeof object[key] == "undefined"){
    return undefined
  }
  return object[key]
}
//!custom functions

//config
const setConfig = (config) => {
  Object.keys(config).forEach((key) => {
    global[key] = config[key];
  });
}
const getUserAgent = (options) => {
  if(options == "random"){
    return new userAgent().toString()
  }
  if(options == "desktop"){
    return new userAgent({deviceCategory: 'desktop'}).toString()
  }
  if(options == "mobile"){
    return new userAgent({deviceCategory: 'mobile'}).toString()
  }
  if(Array.isArray(options)){
    //if any of the options contains object with key:"mine" return object.value
    const mine = options.filter((option) => {
      if(typeof option == "object" && option.key == "mine"){
        return true
      }
      return false
    })
    if(mine.length > 0){
      return mine[0].value
    }
    return new userAgent(options).toString()
  }
  return null
}
//!config

//user script
const userScript = async (page) => {
  return new Promise(async (resolve, reject) => {
    const returnResults = resolve;
    const returnError = reject;
    try {
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
      returnResults(result);
    } catch (e) {
      returnError(e);
    }
  });
}

//!user script


//main
const run = async () => {
  return new Promise(async (resolve) => {
    const returnResults = resolve;
    try {
      global.puppeteer = require('puppeteer');
      var user_agent = getUserAgent(global.user_agent);
      if(user_agent == null){
        user_agent = ``;
      }else{
        user_agent = `--user-agent=${getUserAgent(global.user_agent)}`;
      }
      global.browser = await puppeteer.launch({
        ...global.browser_options,
        args : [
          ...safeUndefined(global.browser_config,"args") || [],
          
        ]
      })
      if(global.scraper.pages.length > 0 && global.scraper.base_url.includes("{{sub}}")){
        returnResults(await Promise.all(global.scraper.pages.map(async (page) => {
          const pageInstance = await global.browser.newPage();
          await pageInstance.goto(global.scraper.base_url.replaceAll("{{sub}}", page));
          const result = {
            url : global.scraper.base_url.replaceAll("{{sub}}", page),
            runned_at : new Date().getTime(),
            data : await userScript(pageInstance)
          }
          await pageInstance.close();
          return result;
        
        })));
      } else {
        const page = await global.browser.newPage();
        await page.goto(global.scraper.base_url);
        const result = {
          url : global.scraper.base_url,
          runned_at : new Date().getTime(),
          data : await userScript(page)
        }
        await page.close();
        returnResults(result);
      }
      global.browser.close();
    } catch (e) {
      resolve(e);
      global.browser.close();
    }
  });
}
//!main







(async () => {
//run
setConfig({
  browser_options: {
    headless: false,
  },
  user_agent: "mobile",
  scraper: {
    name : "MyBrowserInfo",
    base_url: 'https://mybrowserinfo.com/detail.asp',
    pages: [],
    results: []
  }
});
global.scraper.results = await run();
//!run
console.log(global.scraper)
})();
