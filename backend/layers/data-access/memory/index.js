const accountMem = require('./account')
const productMem = require('./product')
const orderMem = require('./order')

async function NewDatabase() {
    return {
        account: await accountMem.NewAccountDatabase(),
        product: await productMem.NewProductDatabase(),
        order: await orderMem.NewOrderDatabase()
    }
}

module.exports = {
    NewDatabase
}