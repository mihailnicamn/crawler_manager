
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
      var results = [];
      const elemets = {
        cookie_button: '#onetrust-accept-btn-handler',
        page_number: '.pageNum.current',
        max_page_number: '.pageNum',
      }
      await page.waitForSelector(elemets.max_page_number)
      const totalReviews = await page.evaluate(() => {
        return parseInt(document.querySelector('[data-test-target="CC_TAB_Reviews_LABEL"]').innerText.replaceAll("Reviews", ""))
      });
      await page.waitForSelector(elemets.cookie_button)
      await page.click(elemets.cookie_button)
      await page.evaluate(() => {
        [...document.querySelectorAll('span')].find(element => element.textContent === 'All languages').click();
        [...document.querySelectorAll('span')].find(element => element.textContent === 'All languages').click();
      });
      while (results.length < totalReviews) {
        await scrollDown(page, 10);
        const reviews = await page.evaluate(() => {
          [...document.querySelectorAll('[data-test-target="expand-review"]')].forEach(element => element.click());
          return [...document.querySelectorAll('[data-test-target="HR_CC_CARD"]')].map(element => {
            return {
              user: {
                username: element.querySelector('.ui_social_avatar').getAttribute('href').split('/')[2],
                avatar: element.querySelector('.ui_social_avatar').querySelector('img').getAttribute('src'),
                name: element.querySelector('.ui_header_link').innerText,
                date: element.querySelector('.ui_header_link').nextSibling.textContent,
              },
              review: {
                title: element.querySelector('[data-test-target="review-title"]').innerText,
                text: element.querySelector('q').innerText,
                rating: {
                  overall: parseInt(element.querySelector('.ui_bubble_rating').getAttribute('class').split(' ')[1].split('_')[1]) / 10,
                }
              }
            }
          });
        });
        results = [...results, ...reviews];
        await page.evaluate(() => {
          const pages = [...document.querySelectorAll('.pageNum')];
          if (document.querySelector('.pageNum.current').innerText == pages[pages.length - 1].innerText) {
            return;
          }
          pages.filter(element => element.innerText == parseInt(document.querySelector('.pageNum.current').innerText) + 1)[0].click();
        });
      }
      returnResults(results);
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
    name : "TripAdvisor Hotel Reviews 🏨 ",
    base_url: 'https://www.tripadvisor.com/Hotel_Review-g304058-d7078098-Reviews-Green_Park_Hotel-Focsani_Vrancea_County_Southeast_Romania.html#REVIEWS',
    pages: [],
    results: []
  }
});
global.scraper.results = await run();
//!run
console.log(global.scraper)
})();
