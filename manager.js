const server = require("./server")
const crawler = require("./crawler")


const installDependencies = (scripts, handler) => {
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

const testRun = (script_data, handler) => {
    const files = require("fs");
    const filename = `./${Math.random()}_testRun.js`
    const beautify = require("js-beautify").js;
    var file_content = beautify(script_data.script, { indent_size: 2 });
    var template = files.readFileSync("./template.js", "utf8");
    template = template.replace("{{user_script}}", file_content);
    template = template.replace("{{name}}", script_data.name);
    template = template.replace("{{url}}", script_data.url);
    template = template.replace("{{subs}}", script_data.subs);
    console.log(script_data.script)
    installDependencies(getDependeces(script_data.script), handler)
    files.writeFileSync(filename, template);
    const { fork } = require('child_process');
    global.test_run = fork(filename, [], { silent: true });
    global.test_run.on('message', (m) => {
        handler(m.toString());
    });
    global.test_run.stderr.on('data', (data) => {
        handler(data.toString());
    });
    global.test_run.stdout.on('data', (data) => {
        handler(data.toString());
    });
    global.test_run.on('close', (code) => {
        handler(code.toString());
        files.rmSync(filename)
    });
}
const testStop = () => {
    global.test_run.kill();
}

server.start({
    ...crawler,
    testRun,
    testStop,
});