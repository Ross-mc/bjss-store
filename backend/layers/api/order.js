
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
        const orders = await orderService.getOrdersByCustomerId(req.session.customerId)
        res.json(orders)
    }

    async function getOrder(req, res) {
        const orders = await orderService.getOrderByToken(req.params.id)
        res.json(orders)
    }

    // There's some key API design decisions here.  In theory all we need for an order
    // is the paymentToken so that we can check the user has paid.  The shipping
    // details we could fetch from the user's account, however:
    // - Guest checkout means we'd need shipping details for some requests
    // - Customers will want to use adddresses other than their default. 
    // So pushing the decision on where the shipping details come from back to the UI
    // seems sensible. The items we know from the basket they gave us earlier, however:
    // - Design for the API user: It doesn't seem obvious that you need to update
    //   a basket before placing an order. Two API requests where one make sense.
    // - The basket could be held entirely in the front end in some designs. 
    // - 'Save for later' could mean there is more than one 'basket'
    // There's no guarentee these trade offs are right, but it leaves us with a 
    // self contained OrderRequest that makes few assumptions about the rest of the design.
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