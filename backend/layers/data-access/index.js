const fs = require('fs')
const memory = require('./memory')
const sqlite = require('./sqlite')

module.exports = {
    init: async () => {
        if (process.env.DB_CONNECTION === 'sql') {
            const file = './sqlite.db'
            // For now wipe the database each time we start to make sure
            // we don't trip over old records. This also forces us towards
            // test automation.
            fs.existsSync(file) && fs.unlinkSync(file)
            return sqlite.NewDatabase(file)
        }
        return memory.NewDatabase()
    }
}