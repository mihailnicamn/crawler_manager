const files = require("fs");
const filesystem = {
    init : (collections) => {
        collections.forEach((collection) => {
            if(!files.existsSync('./data')) {
                files.mkdirSync('./data');
            }
            if (!files.existsSync(`./data/${collection}.json`)) {
                files.writeFileSync(`./data/${collection}.json`, '[]');
            }
        })
    },
    find : (collection, options) => {
        const json = JSON.parse(files.readFileSync(`./data/${collection}.json`, "utf8"));
        return json.filter((item) => {
            var valid = true;
            Object.keys(options).forEach((key) => {
                if (item[key] != options[key]) valid = false;
            })
            return valid;
        });
    },
    add : (collection, data) => {
        var json = JSON.parse(files.readFileSync(`./data/${collection}.json`, "utf8"));
        json.push({
            _id : Math.random().toString(36).substr(2, 9),
            ...data,
        });
        files.writeFileSync(`./data/${collection}.json`, JSON.stringify(json));
    },
    update : (collection, options, data) => {
        var json = JSON.parse(files.readFileSync(`./data/${collection}.json`, "utf8"));
        json = json.map((item) => {
            var valid = true;
            Object.keys(options).forEach((key) => {
                if (item[key] != options[key]) valid = false;
            })
            if (valid) {
                return {
                    ...item,
                    ...data,
                }
            } else {
                return item;
            }
        });
        files.writeFileSync(`./data/${collection}.json`, JSON.stringify(json));
    },
    delete : (collection, options) => {
        var json = JSON.parse(files.readFileSync(`./data/${collection}.json`, "utf8"));
        json = json.filter((item) => {
            var valid = true;
            Object.keys(options).forEach((key) => {
                if (item[key] != options[key]) valid = false;
            })
            return !valid;
        });
        files.writeFileSync(`./data/${collection}.json`, JSON.stringify(json));
    },
    clear : (collection) => {
        files.writeFileSync(`./data/${collection}.json`, '[]');
    },
}
module.exports = filesystem