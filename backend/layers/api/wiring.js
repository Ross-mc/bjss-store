const YAML = require('yamljs');
const cors = require("cors")
const session = require('express-session')
const openApiUi = require("swagger-ui-express")
const cookieParser = require("cookie-parser")

const NewAccountApi = require('./account').NewAccountApi
const NewProductApi = require('./product').NewProductApi
const NewOrderApi = require('./order').NewOrderApi

const NewAccountService = require('../business-logic/account').NewAccountService
const NewProductService = require('../business-logic/product').NewProductService
const NewOrderService = require('../business-logic/order').NewOrderService

const dataAccessLayer = require('../data-access')

async function wire(express) {
    const corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true,
    
    }

    const app = express()
    app.use(express.json()) // Parse JSON request bodies automagically
    app.use(cors()) // Allow a UI laoded from any server to call us, but note OWASP Top 10 #6
    app.use(cookieParser());

    // Adds a session object to the request. As configured this won't get stored
    // in a database, so all session info is lost when we restart the server. 
    app.use(session({
        saveUninitialized: false,
        resave: true,
        secret: 'my session encryption secret'
    }))

    // Serve up a web user interface that allows us to explore the APi
    // This is really nice in development, but note OWASP Top 10 #6
    const openApiSpec = YAML.load('./openapi-spec.yaml')
    app.use("/api-docs", openApiUi.serve, openApiUi.setup(openApiSpec))

    await setupApiRoutes(app)

    // Generic error handler triggered if anything throws
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send({ error: 'unknown', msg: 'check server logs' })
    })

    return app
}

// Express wasn't built for async/await. We need this to catch errors properly
const asyncWrap = fn =>
    (...args) => {
        const fnReturnPromise = fn(...args)
        const next = args[args.length - 1]
        return Promise.resolve(fnReturnPromise).catch(next)
    }

const mustBeSignedIn = (req, res, next) => {
    // Signed in users have a customerId in the session.  If present, call the
    // next function in the list of functions attached to this path
    if (req.session.customerId !== undefined)
        return next()

    res.status(401).send({ error: 'forbidden', msg: 'user is not signed in' })
}

const invalidateSession = (req, res, next) => req.session.regenerate(next)

async function setupApiRoutes(app) {
    // Create all the components we need. 
    const db = await dataAccessLayer.init()
    const productService = NewProductService(db.product)
    const accountApi = NewAccountApi(NewAccountService(db.account))
    const productApi = NewProductApi(productService)
    const orderApi = NewOrderApi(NewOrderService(db.order, productService))

    app.post('/api/account/sign-in', invalidateSession, asyncWrap(accountApi.postSignIn))
    app.post('/api/account/sign-up', invalidateSession, asyncWrap(accountApi.postSignUp))
    app.get('/api/account', mustBeSignedIn, asyncWrap(accountApi.getAccount))
    app.post('/api/account', mustBeSignedIn, asyncWrap(accountApi.postAccount))

    app.get('/api/product/catalogue', asyncWrap(productApi.search))
    app.get('/api/product/categories', asyncWrap(productApi.categories))
    app.get('/api/product/deals', asyncWrap(productApi.deals))

    app.get('/api/order/basket', asyncWrap(orderApi.getBasket))
    app.post('/api/order/basket', asyncWrap(orderApi.postBasket))
    app.post('/api/order/checkout', asyncWrap(orderApi.postCheckout))
    app.get('/api/order/history', mustBeSignedIn, asyncWrap(orderApi.getHistory))
    // We don't use mustBeSignedIn here.
    // This allows guest customers with an order ID from a 'track my order'
    // email to fetch the order. What problems could there be with this? 
    // What properties does order ID need to be secure. OWASP Top 10 #3 and #5
    app.get('/api/order/:id', asyncWrap(orderApi.getOrder))

    app.use('/api', (req, res, __) =>
        res.status(404).send({ error: 'apiEndpointNotFound', msg: '/api' + req.path })
    )
}

module.exports = {
    wire
}


