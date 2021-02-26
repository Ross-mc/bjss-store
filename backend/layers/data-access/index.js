const accountMem = require('./memory/account')
const productMem = require('./memory/product')
const orderMem = require('./memory/order')

module.exports = {
    init: async () => {
        return {
            account: await accountMem.NewAccountDatabase(),
            product: await productMem.NewProductDatabase(),
            order: await orderMem.NewOrderDatabase()
        }
    }
}