
const validateItems = items =>
    items && items.every( 
        item => item.productId !== undefined && item.quantity !== undefined)


function NewOrderApi(orderService) {

    async function getBasket(req, res) {
        // To implement
    }

    async function postBasket(req, res) {
        // To implement
    }

    async function getHistory(req, res) {
       // To implement. Only works for a signed in user, so we need to implement that first
    }

    async function getOrder(req, res) {
        // To implement
    }

    async function postCheckout(req, res) {
        // To implement
    }

    return {
        getBasket,
        postBasket,
        getHistory,
        getOrder,
        postCheckout
    }
}

module.exports = {
    NewOrderApi
}