
// array of order items to object of {id: quantity}
const orderItemsToStock = items =>
    items.reduce((obj, item) => Object.assign(obj, { [item.productId]: item.quantity }), {});

function NewOrderService(orderDb, productService) {

    async function updateBasket(basket) {
        const { total } = await productService.checkStock(orderItemsToStock(basket.items))
        basket.total = total
        return basket
    }



    async function createOrder(customerId, orderRequest) {
        const stockToCheck = orderItemsToStock(orderRequest.items)

        const { total, notEnoughStock } = await productService.checkStock(stockToCheck)

        if (notEnoughStock.length > 0)
            return { error: 'stock-level', items: notEnoughStock }

        productService.decreaseStock(stockToCheck)

        orderRequest.total = total
        return orderDb.addOrder(customerId, orderRequest)
    }

    return {
        // The service layer adds little for viewing orders and baskets.
        // so pass straight through for now. 
        getOrdersByCustomerId: orderDb.getOrdersByCustomerId,
        getOrderByToken: orderDb.getOrderByToken,

        updateBasket,
        createOrder
    }
}

module.exports = {
    NewOrderService
}