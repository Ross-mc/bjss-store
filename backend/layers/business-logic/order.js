
// productService.checkStock() takes an object of the form {id: quantity}
// but we get given Orders or baskets of the form [{productId, quantity}]
// This function converts between the two. e.g.
//
// From                                    To
//      [                                      {
//         { productId: 13, quantity: 3 },        13: 3,   
//         { productId: 42, quantity: 9 }         42: 9
//      ]                                      }
const orderItemsToStock = items =>
    items.reduce((obj, item) => Object.assign(obj, { [item.productId]: item.quantity }), {});

function NewOrderService(orderDb, productService) {

    async function updateBasket(basket) {
        // To implement
    }

    async function createOrder(customerId, orderRequest) {
       // To Implement
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