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
    const child = spawn('npm', ['install', '--save', ...scripts]);
    child.stdout.on('data', (data) => {
        handler(data);
    });
    child.stderr.on('data', (data) => {
        handler(data);
    });
    child.on('close', (code) => {
        handler(code);
    });
}