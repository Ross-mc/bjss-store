
const validateItems = items =>
    items && items.every( 
        item => item.productId !== undefined && item.quantity !== undefined)


function NewOrderApi(orderService) {

    async function getBasket(req, res) {
        // Update the basket to get the total for the latest prices before returning it
        const basket = await orderService.updateBasket(req.session.basket || { items: [] })
        res.json(basket)
    }

    async function postBasket(req, res) {
        // The only thing we trust from the client is the items
        const items = req.body.items
        if (!validateItems(items))
            return res.sendStatus(400)

        // Update the session with the new items (replacing the old)
        req.session.basket = { items }

        // Use getBasket to return updated totals etc to the user
        await getBasket(req,res)
    }

    async function getHistory(req, res) {
        const orders = await orderService.getOrderSummariesByCustomerId(req.session.customerId)
        res.json(orders)
    }

    async function getOrder(req, res) {
        const orders = await orderService.getOrderByToken(req.params.id)
        res.json(orders)
    }

    async function postCheckout(req, res) {
        const { paymentToken, shippingDetails, items } = req.body

        // We should really validate the shippingDetails here, but I'm lazy
        // This hints we should consider a validation module of some sort. 
        // Should we be thinking about OWASP Top 10 #1 and #7 here or elsewhere?
        if (!paymentToken || !shippingDetails || !validateItems(items) )
            return res.sendStatus(400)

        // TODO Validate the paymentToken with the payment provider. 
        // This means we need a paymentService.  Curently we have API, Biz
        // Logic and DB layers. A paymentService would be none of these.
        // Do we need a re-think of our nice neat structure? Or a concept
        // (folder) for "integrations"?  

        const order = {shippingDetails, items} 

        const result = await orderService.createOrder(req.session.customerId, order)
        if (result.error) 
            return res.status(400).json(result.error)
        
        delete req.session.basket // The basket is now empty
        res.json(result)
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