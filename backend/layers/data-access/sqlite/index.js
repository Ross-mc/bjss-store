const Database = require('better-sqlite3')

const account = require('./account')
const product = require('./product')
const order = require('../memory/order')

async function NewDatabase(connection) {

    const db = new Database(connection)

    return {
        account: await account.NewAccountDatabase(db),
        product: await product.NewProductDatabase(db),
        order: await order.NewOrderDatabase()
    }
}

module.exports = {
    NewDatabase
}