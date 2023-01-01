const server = require("express")
const app = server()
require('dotenv').config()
const db = require("./db")
const port = process.env.PORT || 3000

const basicAuth = require('express-basic-auth')

app.use(basicAuth({
    challenge: true,
    users: { 'admin': 'admin' }
}))
const create = (crawler) => {
    const url = '/app/create'
    app.post(`${url}/js`, (req, res) => {
        res.send("create")
    })
    app.post(`${url}/config`, (req, res) => {
        res.send("create")
    })
    app.post(`${url}/test/start`, (req, res) => {
        crawler.testRun(req.body, console.log);
        res.send("create")
    });
    app.post(`${url}/test/stop`, (req, res) => {
        crawler.testStop();
        res.send("create")
    });
}
const control = (crawler) => {
    const url = '/app/control'
    app.post(`${url}/start`, (req, res) => {
        const id = req.query.id
        res.send("control")
    })
    app.post(`${url}/stop`, (req, res) => {
        const id = req.query.id
        res.send("control")
    })
    app.post(`${url}/crawls`, (req, res) => {
        const id = req.query.id
        res.send("control")
    })
    app.post(`${url}/description`, (req, res) => {
        const id = req.query.id
        res.status(200).send({
            "id": id,
            "description": crawler.getHumanReadableDescription(id)
        });
    });
}
const main = (crawler) => {
    app.use(require("body-parser").json())
    app.use(server.static("ui"))
    const url = '/app'
    app.post(`${url}/list`, (req, res) => {
        res.send("main")
    })
}
const settings = (crawler) => {
    app.post('/update', (req, res) => {
        const key = req.query.key
        const value = req.query.value
        console.log({
            key,
            value
        })
        if(crawler.updateENV(key, value)) res.send("updated")
        else res.send("error")
    })
    app.post('/db_types', (req, res) => {
        res.send(db.types)
    })  
    app.post('/environment', (req, res) => {
        res.send(crawler.readENV())
    })
}
const server_module = {
    start : (crawler) => {
        main(crawler)
        create(crawler)
        control(crawler)
        settings(crawler)
        app.listen(port, () => {
            console.log(`crawler manager interface http://localhost:${port}`)
        })
    },
}
module.exports = server_module