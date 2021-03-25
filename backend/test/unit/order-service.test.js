const expect = require('chai').expect
const database = require('../../layers/data-access')
const NewOrderService = require('../../layers/business-logic/order').NewOrderService

xdescribe('Order Service', () => {

    // Mainly happy path regression testing for this toy app. 
    // The error / edge case handling isn't that good anyway. 
    // Note: the default (in memory) data access layer makes for a good testing
    // fake, so we don't really need a mock database.

    let service
    let productService

    const makeProductService = () => {
        let decreaseStockCalls = 0
        return {
            checkStock: stock => {
                // Stupid simple test behaviour. Total is 10x the number of items
                const response = {
                    total: 10 * Object.keys(stock).length,
                    notEnoughStock: []
                }
                // Stupid simple test behaviour. If you order 10 items of id 3 you get an error
                if (stock[3] && stock[3] === 10)
                    response.notEnoughStock.push({ id: 3, quantityRemaining: 9 })

                return response
            },
            decreaseStock: () => decreaseStockCalls++,
            decreaseStockCalled: () => decreaseStockCalls
        }
    }

    const makeTestOrderRequest = () => ({
        shippingDetails: {
            email: 'a@example.com', name: 'a', address: 'b', postcode: 'abc123'
        },
        items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 3 }
        ]
    })


    beforeEach(async () => {
        productService = makeProductService()
        service = NewOrderService((await database.init()).order, productService)
    })

    it('updates basket', async () => {
        const basket = await service.updateBasket({
            items: makeTestOrderRequest().items
        })
        expect(basket.total).to.equal(20)
    })

    it('creates an order', async () => {
        const request = makeTestOrderRequest()
        const response = await service.createOrder('testCustomerId', request)

        expect(response.id.length).to.be.greaterThan(1)
        expect(response.customerId).to.equal('testCustomerId')
        expect(response.shippingDetails).to.eql(request.shippingDetails)
        expect(response.items).to.eql(request.items)
        expect(response.total).to.eql(20)
        expect(Date.parse(response.updatedDate)).to.be.lessThan(Date.now()+10)

        expect(productService.decreaseStockCalled()).to.equal(1)
    })

    it('rejects an order if not enough stock', async () => {
        const request = makeTestOrderRequest()
        request.items.push({ productId: 3, quantity: 10 })
        const response = await service.createOrder('testCustomerId', request)

        expect(response).to.eql({
            error: 'stock-level',
            items: [{ id: 3, quantityRemaining: 9 }]
        })
        expect(productService.decreaseStockCalled()).to.equal(0)
    })

    it('fetches orders', async () => {
        const request1 = makeTestOrderRequest()
        request1.items = [{ productId: 1, quantity: 1 }]

        const request2 = makeTestOrderRequest()
        request2.items = [{ productId: 2, quantity: 1 }]

        const request3 = makeTestOrderRequest()
        request3.items = [{ productId: 3, quantity: 1 }]

        const response1 = await service.createOrder('testCustomerId', request1)
        const response2 = await service.createOrder('otherCustomerId', request2)
        const response3 = await service.createOrder('testCustomerId', request3)

        const orders = await service.getOrdersByCustomerId('testCustomerId')
        expect(orders.length).to.equal(2)

        const order1 = orders.find(s=>s.id===response1.id)
        expect(order1.id).to.equal(response1.id)

        const order3 = orders.find(s=>s.id===response3.id)
        expect(order3.id).to.equal(response3.id)
        expect(order3.total).to.equal(response3.total)
        expect(Date.parse(order3.updatedDate)).to.be.lessThan(Date.now()+1)
        expect(order3.items.length).to.be.greaterThan(0)

        const byToken = await service.getOrderByToken(response2.id)
        expect(byToken).to.eql(response2)
    })
})

