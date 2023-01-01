var templating_id = 0;
window.template_recipes = [
    {
        id : templating_id++,
        name: `Get Ads from Google Search 🤷‍♂️`,
        name_html : `Get Ads from <span class="text-primary">G</span><span class="text-danger">o</span><span class="text-warning">o</span><span class="text-primary">g</span><span class="text-success">l</span><span class="text-danger">e</span> Search 🤷‍♂️`,
        script : ``,
    },
    {
        id : templating_id++,
        name: `Weekly Natural Gas Storage Report 📈`,
        name_html : `Weekly Natural Gas Storage Report 📈`,
        script : ``,
    },
    {
        id : templating_id++,
        name: `IMDb Top 250 Movies 🍿`,
        name_html : `<span class="badge bg-warning text-black">IMDb</span> Top 250 Movies 🍿`,
        script : ``,
    },
    {
        id : templating_id++,
        name: `Wikipedia Person Profile 👤`,
        name_html : `Wikipedia Person Profile 👤`,
        script : ``,
    },
    {
        id : templating_id++,
        name: `Warren Buffet Portfolio 📈`,
        name_html : `Warren Buffet Portfolio 📈`,
        script : ``,
    },
    {
        id : templating_id++,
        name: `Verify Car License Plate 🚘`,
        name_html : `Verify Car License Plate 🚘`,
        script : ``,
    },
    {
        id : templating_id++,
        name: `TripAdvisor Hotel Reviews 🏨`,
        name_html : `TripAdvisor Hotel Reviews 🏨`,
        url : `https://www.tripadvisor.com/Hotel_Review-g188590-d12967879-Reviews-or540-Monet_Garden_Hotel_Amsterdam-Amsterdam_North_Holland_Province.html#REVIEWS`,
        script : `
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
        returnResults(results);`,
    },
    {
        id : templating_id++,
        name: `My Browser Info 🤖`,
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
];