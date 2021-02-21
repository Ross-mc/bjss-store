const expect = require('chai').expect
const fetch = require('node-fetch')

const apiBase = `http://localhost:4001/api`

describe('Integration testing the API', () => {

    // Note: Good practice is to not make any assumption about the data in the database
    // However, we don't have any endpoints for adding products, etc, so we're going to
    // rely on what our database population script puts in.  This means these tests
    // may fail if you change the apparently unrelated DB scripts.  Oh well. 

    // Note: These are integration tests, they assume they're run in a specific sequence.

    it('lists products', async () => {
        const products = await getFromApiExpectingJson('/products')

        expectListOfProducts(products)
    })

    xit('lists deals', async () => {
        const deals = await getFromApiExpectingJson('/deals')

        expectListOfProducts(deals)

        const allProducts = await listProducts()
        expect(deals.length).to.be.lessThan(allProducts.length)
    })

    xit('gets categories', async () => {
        const categories = await getFromApiExpectingJson('/categories')

        expect(categories.length).to.be.greaterThan(1) // more than one category

        // Roughly the right shape
        expect(categories[0]).to.include.keys('id', 'name')
    })

    it('lists products in a single category', async () => {
        const products = await getFromApiExpectingJson('/categories/1')

        expectListOfProducts(products)

        const allProducts = await listProducts()
        expect(products.length).to.be.lessThan(allProducts.length)
    })


    it('creates an order and checks it exists', async () => {

        const requestBody = {
            address: "Some address",
            orderItems: [{ ProductId: 2, quantity: 1 }]
        }

        const response = await fetch(apiBase + '/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        })

        expect(response.status).to.equal(200)
        const responseBody = await response.json()
        expect(responseBody).to.include.keys('id')

        const orderId = responseBody.id

        // Check we can fetch it by ID
        const createdOrder = await getFromApiExpectingJson(`/orders/${orderId}`)
        expect(createdOrder.orderItems[0]).to.include({ ProductId: 2 })

        // Check the new order is in the list of all orders
        const orders = await getFromApiExpectingJson('/orders')
        const foundOrder = orders.find(order => order.id === orderId)
        expect(foundOrder).to.not.be.null
    })


    async function getFromApiExpectingJson(path) {
        const response = await fetch(apiBase + path);
        const body = await response.json()

        expect(response.status).to.equal(200)
        return body
    }

    function expectListOfProducts(jsonBody) {
        // more than one product
        expect(jsonBody.length).to.be.greaterThan(1)

        // Roughly the right shape
        expect(jsonBody[0]).to.include.keys(
            'id', 'shortDescription', 'longDescription', 'price', 'quantity',
            'CategoryId')
    }

    async function listProducts() {
        return await getFromApiExpectingJson('/products')
    }
})

