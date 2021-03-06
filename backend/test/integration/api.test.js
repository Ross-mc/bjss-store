const expect = require('chai').expect
const fetch = require('node-fetch')
const express = require('express')
const api = require('../../layers/api/wiring')




describe('Integration testing the API', () => {

    // Note: Good practice is to not make any assumption about the data in the database
    // However, we don't have any endpoints for adding products, etc, so we're going to
    // rely on what our database population script puts in.  This means these tests
    // may fail if you change the apparently unrelated DB scripts.  Oh well. 

    // Note: These are integration tests, they'll have effects on the database that
    // may impact other tests.

    // For expediency, these are happy path tests. 

    let server
    let session
    const apiBase = `http://localhost:4001`

    // Run the actuall server at the start of this set of tests...
    before(async () => {
        const app = await api.wire(express)
        server = app.listen(4001)
    })

    // .. and shut it down at the end so the suite doesn't hang forever.
    after(done => server.close(done))

    afterEach(() => session = undefined) // clear the client side session between tests

    it('lists products', async () => {
        const products = await makeGetRequestToApiThatReturnsJson('/api/product/catalogue')

        expectListOfProducts(products)
    })

    it('lists deals', async () => {
        const deals = await makeGetRequestToApiThatReturnsJson('/api/product/deals')

        expectListOfProducts(deals)

        const allProducts = await listProducts()
        expect(deals.length).to.be.lessThan(allProducts.length)
    })

    it('gets categories', async () => {
        const categories = await makeGetRequestToApiThatReturnsJson('/api/product/categories')

        expect(categories.length).to.be.greaterThan(1) // more than one category

        // Roughly the right shape
        expect(categories[0]).to.include.keys('id', 'name')
    })

    it('lists products in a single category', async () => {
        const products = await makeGetRequestToApiThatReturnsJson('/api/product/catalogue?category=1')

        expectListOfProducts(products)

        const allProducts = await listProducts()
        expect(products.length).to.be.lessThan(allProducts.length)
    })


    xit('creates an order and checks it exists', async () => {
        const orderRequest = makeOrderRequest()

        const response = await makePostRequestToApiThatReturnsJson('/api/order/checkout', orderRequest)
        expect(response).to.include.keys('id', 'shippingDetails', 'items', 'total')

        const orderId = response.id

        // Check we can fetch it by ID
        const createdOrder = await makeGetRequestToApiThatReturnsJson(`/api/order/${orderId}`)
        expect(createdOrder.items[0]).to.eql(orderRequest.items[0])

        // Check the new order is in the list of all orders
        //const orders = await getFromApiExpectingJson('/api/order/history')
        //const foundOrder = orders.find(order => order.id === orderId)
        //expect(foundOrder).to.not.be.null
    })

    xit('gets and sets a basket', async () => {
        // A basket update is the same as the items part of an order. 
        const basket = { items: makeOrderRequest().items }

        const addResponse = await makePostRequestToApiThatReturnsJson('/api/order/basket', basket)
        expect(addResponse.total).to.equal(2090) // Giraffes are expensive
        expect(addResponse.items).to.eql(basket.items)

        const getResponse = await makeGetRequestToApiThatReturnsJson('/api/order/basket')
        expect(getResponse.total).to.equal(2090) // Giraffes are expensive
        expect(getResponse.items).to.eql(basket.items)
    })

    const checkNotSignedIn = async () =>
        await makeGetRequestToApiThatReturnsJson('/api/order/history', 401)

    // We use this later to check sign-in.
    // At the top we said mainly happy path testing, but negative security testing
    // is sooo important, we're including it here. 
    it('API that requires sign in rejects non-signed in user', async () =>
        await checkNotSignedIn()
    )

    const checkSignedIn = async () =>
        await makeGetRequestToApiThatReturnsJson('/api/order/history')


    // A single test for all signed in behaviour is poor.  
    xit('signs up, is signed in', async () => {
        await makePostRequestToApiThatReturnsJson(
            '/api/account/sign-up', makeTestUser('signup@example.com')
        )
        await checkSignedIn()
    })

    xit('Signs in', async () => {
        const user = makeTestUser('signin@example.com')
        await makePostRequestToApiThatReturnsJson('/api/account/sign-up', user)

        const { email, password } = user
        const account = await makePostRequestToApiThatReturnsJson('/api/account/sign-in', { email, password })

        expect(account.id).to.not.be.undefined
        // We expect two differences between what we sent and what we got, remove them:
        delete account.id
        delete user.password
        expect(account).to.eql(user)

        await checkSignedIn()
    })

    const signIn = async () => {
        // Uses user created in 'sign in' test, above
        // This is naughty because if it fails, all other tests using this will fail, but then
        // if sign-in isn't working, all tests that need it should fail!
        const { email, password } = makeTestUser('signin@example.com')
        return await makePostRequestToApiThatReturnsJson(
            '/api/account/sign-in',
            { email, password }
        )
    }

    // This test run after we've established that valid credentials do work!
    xit('Invalid credentials rejected', async () => {
        const invalidCredentials = {
            email: 'nosuch@example.com',
            password: 'password'
        }
        const response = await makePostRequestToApiThatReturnsJson(
            '/api/account/sign-in',
            invalidCredentials,
            401
        )
        await checkNotSignedIn()
    })

    xit('Gets/sets account', async () => {
        const original = await signIn()
        const modified = await makePostRequestToApiThatReturnsJson('/api/account', { name: 'changed' })

        original.name = 'changed'
        expect(modified).to.eql(original)

        const fetched = await makeGetRequestToApiThatReturnsJson('/api/account')
        expect(fetched).to.eql(modified)
    })

    xit('Handles password change', async () => {
        const email = 'passwordchange@example.com'
        const user = makeTestUser(email)
        await makePostRequestToApiThatReturnsJson('/api/account/sign-up', user)
        await makePostRequestToApiThatReturnsJson('/api/account', { password: 'changed-password' })

        // check old password fails
        await makePostRequestToApiThatReturnsJson('/api/account/sign-in',
            { email, password: user.password },
            401
        )

        // check new password works
        await makePostRequestToApiThatReturnsJson('/api/account/sign-in',
            { email, password: 'changed-password' }
        )
    })

    xit('Lists order history', async () => {
        await signIn()

        const orderRequest = makeOrderRequest()
        const order1 = await makePostRequestToApiThatReturnsJson('/api/order/checkout', orderRequest)
        const order2 = await makePostRequestToApiThatReturnsJson('/api/order/checkout', orderRequest)

        const orders = await makeGetRequestToApiThatReturnsJson('/api/order/history')
        expect(orders.length).to.equal(2)

        const returnedIds = orders.map(o => o.id)
        expect(returnedIds).to.include.members([order1.id, order2.id])
    })

    xit('Lists only order history for signed in user', async () => {
        await signIn()

        // Make an order as the default user
        const orderRequest = makeOrderRequest()
        await makePostRequestToApiThatReturnsJson('/api/order/checkout', orderRequest)

        // Sign in as a different user and make an order
        const user = makeTestUser('orderhistoryaccesscontrol@example.com')
        await makePostRequestToApiThatReturnsJson('/api/account/sign-up', user)
        const order2 = await makePostRequestToApiThatReturnsJson('/api/order/checkout', orderRequest)

        // Expect only one order with the right ID
        const orders = await makeGetRequestToApiThatReturnsJson('/api/order/history')
        expect(orders.length).to.equal(1)
        expect(orders[0].id).to.equal(order2.id)
    })

    async function makePostRequestToApiThatReturnsJson(path, jsonRequest, expectedStatus) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonRequest),
        }
        if (session)
            options.headers['Cookie'] = session
        const response = await fetch(apiBase + path, options)
        const body = await response.json()

        // GET requests currently don't change our session. POST request might
        // create a new one, so fish out the session cookie after a post and
        // store it for subsequent GET requests. For ease, we echo all cookies back.
        const cookie = response.headers.get('set-cookie')
        if (cookie)
            session = cookie

        expect(response.status, JSON.stringify(body)).to.equal(expectedStatus || 200)
        return body
    }

    async function makeGetRequestToApiThatReturnsJson(path, expectedStatus) {
        const options = session !== undefined ? {
            credentials: 'include',
            headers: { 'Cookie': session }
        } : {}
        const response = await fetch(apiBase + path, options)
        const body = await response.json()

        expect(response.status, JSON.stringify(body)).to.equal(expectedStatus || 200)
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
        return await makeGetRequestToApiThatReturnsJson('/api/product/catalogue')
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

function makeTestUser(email) {
    return {
        email, name: 'a', address: 'b', postcode: 'abc123', password: 'secret'
    }
}

