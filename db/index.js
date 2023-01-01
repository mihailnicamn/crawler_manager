const types = [
    'mysql',
    'postgres',
    'sqlite',
    'mongodb',
    'filesystem',
]
const collections = [
    'scrapers',
    'workers',
]
require('dotenv').config()
var database_manager = {}
types.forEach((type) => {
    database_manager[type] = require(`./${type}.js`)
    database_manager[type].init(collections)
})
const migrate = (source, target) => {
    database_manager[target].init(collections)
    collections.map((collection) => {
        database_manager[target].clear(collection)
        database_manager[source].find(collection, {}).then((data) => {
            data.map((item) => {
                database_manager[target].add(collection, item)
            })
        });
    })
}
const module_ = {
    ...database_manager[process.env.database_type],
    types,
    migrate,
}
module.exports = module_