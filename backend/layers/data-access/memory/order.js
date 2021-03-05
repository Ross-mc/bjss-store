const utils = require('../../../utils/utils')

// We clone (deep copy) everything we put in and take out of our in memory
// data store. This prevents calling code that has retained a refence to it
// from being able to acidentally manipulate data that is now inside our
// fake database. 
const clone = utils.clone


async function NewOrderDatabase() {
    const orders = []

    async function getOrderSummariesByCustomerId(customerId) {
        const matched = orders.filter(order => order.customerId === customerId)

        // The contract for this function is that we return orders without items
        // and shipping details. In this data store we've chose to store thise
        // within the order so strip them out
        return matched.map(order => {
            const {id, total, updatedDate} = order
            return {id, total, updatedDate}
        })
    }

    async function getOrderByToken(orderToken) {
        // In our simple database the id and the token might as well be the same.
        // Token is suitable for sending in a 'track my order' email. So needs to be 
        // unguessable. In practice we'd have an internal order id and separate token
        // so we can reset the token if it gets stolen.   
        const found = orders.find(order => order.id === orderToken)
        return found ? clone(found) : undefined
    }

    async function addOrder(customerId, order) {
        const toAdd = clone({
            id: utils.urlSafeUniqueId(),
            ...order,
            customerId,
            updatedDate: new Date()
        })

        orders.push(toAdd)
        return toAdd
    }

    return {
        getOrderSummariesByCustomerId,
        getOrderByToken,
        addOrder
    }
}

module.exports = {
    NewOrderDatabase
}
