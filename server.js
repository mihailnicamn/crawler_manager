const server = require("express")
const app = server()
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
    app.use(require("body-parser").text())
    app.use(server.static("ui"))
    const url = '/app'
    app.post(`${url}/list`, (req, res) => {
        res.send("main")
    })
}
const server_module = {
    start : (crawler) => {
        main(crawler)
        create(crawler)
        control(crawler)
        app.listen(port, () => {
            console.log(`crawler manager interface http://localhost:${port}`)
        })
    },
}
module.exports = server_module