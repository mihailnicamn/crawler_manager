const server = require("./server")
const crawler = require("./crawler")

server.start(crawler)

const testRun = (script_data,handler) => {
    const files = require("fs");
    const filename = `./${script_data.name}_testRun.js`
    const beautify = require("js-beautify").js;
    var file_content = beautify(script_data.script, { indent_size: 2 });
    files.writeFileSync(filename, file_content);
    const { fork } = require('child_process');
    const child = fork(filename, [], { silent: true });
    child.on('message', (m) => {
        handler(m);
    });
    child.stderr.on('data', (data) => {
        handler(data);
    });
    child.on('close', (code) => {
        handler(code);
        files.rmSync(filename)
    });
}
const installDependencies = (scripts,handler) => {
    const { spawn } = require('child_process');
    const cmd = `npm install --save ${scripts.join(" ")}`
    const child = spawn(cmd, [], { shell: true, stdio: 'pipe' });
    child.stdout.on('data', (data) => {
        handler(data.toString());
    });
    child.stderr.on('data', (data) => {
        handler(data.toString());
    });
    child.on('close', (code) => {
        handler(code.toString());
    });
}
const getDependeces = (script_data) => {
    //get dependence name from require() function
    const regex = /require\((.*?)\)/g;
    const matches = script_data.match(regex);
    const dependencies = [];
    if (matches) {
        matches.forEach((item) => {
            dependencies.push(item.replace("require(", "").replace(")", "").replace(/'/g, "").replace(/"/g, ""));
        });
    }
    return dependencies;
}
installDependencies(getDependeces(`require('body-parser');require('express');require('js-beautify');require('js-yaml');require('crypto-js');require('puppeteer');require('node-cron');require('express-basic-auth)`), (data) => {
    console.log(data)
});