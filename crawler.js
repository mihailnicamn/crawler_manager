const YAML = require('yaml')
const _eval = require('eval')
const beautify = require('js-beautify').js
const files = require('fs')
const crypto = require('crypto-js')
const getHumanReadableDescription = (flow) => {
    const description = flow.map((item) => {
        if (item.define) return `Define ${item.define.key} as ${item.define.value}`;
        if (item.set) return `Set ${item.set.key} as ${item.set.value}`;
        if (item.click) return `Click ${item.click}`;
        if (item.wait) return `Wait ${item.wait} miliseconds`;
        if (item.pageSave) return `Save ${item.pageSave.key} from ${item.pageSave.selector} ${item.pageSave.data}`;
        if (item.save) return `Save ${item.save.key} from ${item.save.from}`;
        if (item.write) return `Write ${item.write.keyword}`;
        if (item.inject) return `Inject ${item.inject.script}`;
        if (item.evaluate) return `Evaluate using ${item.evaluate.script} and save as ${item.evaluate.return}`;
    });
    return description.join(`\n`);
}
const getMainJs = (config) => {
    const getFlowJS = (flow) => {
        var init = `var returnData = {}; `;
        const js = flow.map((item) => {
            if (item.define) return `var ${item.define.key} = ${item.define.type === "string" ? `"${item.define.value}"` : item.define.type === "number" ? `parseFloat('${item.define.value}')` : item.define.type === "boolean" ? item.define.value : "null"};`;
            if (item.set) return `${item.set.key} = ${item.set.value}`;
            if (item.click) return `await page.click('${item.click}')`;
            if (item.wait) return `await page.waitForTimeout(${item.wait})`;
            if (item.pageSave) return `returnData.${item.pageSave.key} = await page.$(${item.pageSave.selector}).${item.pageSave.data}()`;
            if (item.save) return `returnData.${item.save.key} = ${item.save.from}`;
            if (item.write) return `await page.type(${item.write.keyword})`;
            if (item.inject) return `await page.evaluate(async () => { ${item.inject.script} })`;
            if (item.evaluate) return `returnData.${item.evaluate.return} = await page.evaluate(async () => { return await new Promise(resolve => { ${item.evaluate.script} })})`;
        });
        return init + `\n` + js.join(`\n`);
    }
    const json = yml.parse(config);
    var js = `
    const puppeteer = require('puppeteer');
    const CRAWL_FILE = './crawls/${json.name}.json';
    const scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();`;
    if (json.url.filter((item) => item.main).length == 0) return console.log("No URL");
    const url = json.url.filter((item) => item.main)[0].main;
    if (url.includes("{{sub}}") && json.url.filter((item) => item.sub).length == 0) return console.log("URL has SUB declarated but no SUB found");
    if (url.includes("{{sub}}")) {
        var url_js = ``;
        const urls = json.url.filter((item) => item.sub)[0].sub.map((item) => url.replace("{{sub}}", item));
        urls.forEach((item) => {
            url_js += `\n\nawait page.goto('${item}');\n`;
            url_js += getFlowJS(json.flow); + `\nawait browser.close();`;
        });
        js += url_js;
    } else {
        js += `await page.goto('${url}');\n`;
        js += getFlowJS(json.flow); + `\nawait browser.close();`;
    }
    return beautify(js + `\nreturn returnData;}\nscrape().then((data) => {console.log(data)});`, { indent_size: 2 });
}
const getID = (string) => {
    return crypto.MD5(string).toString();
}
const find = (id) => {
   return files.readdirSync("./crawlers/config").filter((item) => item.includes(".yml")).filter((item) => getID(item) == id);
}

const config = {
    save : async (string) => {
        const json = YAML.parse(string);
        files.writeFileSync("./crawlers/js/" + json.name + ".js", getMainJs(string));
        files.writeFileSync("./crawlers/config/" + json.name + ".yml", string);
        if(!files.existsSync("./crawls/" + json.name + ".json")) files.writeFileSync("./crawls/" + json.name + ".json", '[]');
    },
    get : async (id) => {
        const files = find(id);
        if (files.length == 0) throw new Error("Crawler not found");
        return files.readFileSync("./crawlers/config/" + files[0], "utf8");
    },
    results : async (id) => {
        const files = find(id);
        if (files.length == 0) throw new Error("Crawler not found");
        return JSON.stringify(files.readFileSync("./crawls/" + files[0].replace(".yml", "") + ".json", "utf8")).reverse();
    },
    run : async (id) => {
        const files = find(id);
        if (files.length == 0) throw new Error("Crawler not found");
        const { spawn } = require('child_process');
        const child = spawn('node', ['./crawlers/js/' + files[0].replace(".yml", "") + ".js"]);
    },
    list : async () => {
        const crawlers = files.readdirSync("./crawlers/configs");
        return crawlers.map((item) => {
            return {
                name : item.replace(".yml", ""),
                id : getID(item.replace(".yml", ""))
            }
        });
    },
    exists : async (id) => {
        return find(id).length > 0;
    },
    description : async (id) => {
        const files = find(id);
        if (files.length == 0) throw new Error("Crawler not found");
        const json = YAML.parse(files.readFileSync("./crawlers/config/" + files[0], "utf8"));
        return getHumanReadableDescription(json.flow);
    }
}

module.exports = config;