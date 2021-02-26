const expect = require('chai').expect
const fetch = require('node-fetch')
const express = require('express')
const api = require('../../layers/api/wiring')



const apiBase = `http://localhost:4001`

describe('Integration testing the API', () => {

    // Note: Good practice is to not make any assumption about the data in the database
    // However, we don't have any endpoints for adding products, etc, so we're going to
    // rely on what our database population script puts in.  This means these tests
    // may fail if you change the apparently unrelated DB scripts.  Oh well. 

    // Note: These are integration tests, they assume they're run in a specific sequence.

    let server

    before(async () => {
        const app = await api.wire(express)
        server = app.listen(4001)
    })

    after(done => {
        server.close(done)
    })

    it('lists products', async () => {
        const products = await getFromApiExpectingJson('/api/product/catalogue')

        expectListOfProducts(products)
    })

    it('lists deals', async () => {
        const deals = await getFromApiExpectingJson('/api/product/deals')

        expectListOfProducts(deals)

        const allProducts = await listProducts()
        expect(deals.length).to.be.lessThan(allProducts.length)
    })

    it('gets categories', async () => {
        const categories = await getFromApiExpectingJson('/api/product/categories')

        expect(categories.length).to.be.greaterThan(1) // more than one category

        // Roughly the right shape
        expect(categories[0]).to.include.keys('id', 'name')
    })

    it('lists products in a single category', async () => {
        const products = await getFromApiExpectingJson('/api/product/catalogue?category=1')

        expectListOfProducts(products)

        const allProducts = await listProducts()
        expect(products.length).to.be.lessThan(allProducts.length)
    })


    it('creates an order and checks it exists', async () => {
        const orderRequest = makeOrderRequest()
        const response = await fetch(apiBase + '/api/order/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderRequest),
        })

        expect(response.status).to.equal(200)
        const responseBody = await response.json()
        expect(responseBody).to.include.keys('id', 'shippingDetails', 'items', 'total')

        const orderId = responseBody.id

        // Check we can fetch it by ID
        const createdOrder = await getFromApiExpectingJson(`/api/order/${orderId}`)
        expect(createdOrder.items[0]).to.eql(orderRequest.items[0])

        // Check the new order is in the list of all orders
        //const orders = await getFromApiExpectingJson('/api/order/history')
        //const foundOrder = orders.find(order => order.id === orderId)
        //expect(foundOrder).to.not.be.null
    })


    async function getFromApiExpectingJson(path) {
        const response = await fetch(apiBase + path);
        const body = await response.json()

        expect(response.status, JSON.stringify(body)).to.equal(200)
        return body
    }

    function expectListOfProducts(jsonBody) {
        // more than one product
        expect(jsonBody.length).to.be.greaterThan(1)

        // Roughly the right shape
        expect(jsonBody[0]).to.include.keys(
            'id', 'shortDescription', 'longDescription', 'price', 'quantityRemaining',
            'categoryId')
    }

    async function listProducts() {
        return await getFromApiExpectingJson('/api/product/catalogue')
    }
})

function makeOrderRequest() {
    return {
        paymentToken: 'someTokenToCheckWithPaymentGateway',
        shippingDetails: {
            email: 'a@example.com', name: 'a', address: 'b', postcode: 'abc123'
        },
        items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
        ]
    }
}

