# BJSS Store 

Academy 2021 TODO
- Consider serving frontend on / or moving to a different repo

This is a Javascript backend using Node.JS to run the Javascript and a framework called Express to help implement the APIs. 

# Getting started
Assumes you are running on 
* WSL2/Ubuntu 20 (Windows). If you want file watching to work setup the repo in Ubuntu /home
* Visual Studio Code
* node  `apt-get install node`

```
cd backend
npm install
code .
```
Things to try:
* Start the server `npm start`, poke around here: http://localhost:4001/api-docs
* Run the unit tests `npm test`
* Run the integration tests `npm run integration-test` or all `npm run test-all`

# Debugging

In VS Code, go to the debug tab. In the drop down select what you want to debug. 
If you choose to debug the server you'll have to make requests to it somehow.

# Databases
By default it runs with a simple in-memory data store. To use SQLite set the
`DB_CONNECTION` environment variable to `sql`, for example:
```
DB_CONNECTION=sql npm run test-all
```
or 
```
DB_CONNECTION=sql npm start
```
At the moment it deletes the database at the start of every run to make life simpler and nudge us towards automated rather than manual testing.  You can examine the contents of the SQL database by loading it into a tool such as this: https://chrome.google.com/webstore/detail/sqlite-manager or on the command line:
* Install `sudo apt-get install sqlite3`
* Run a query `sqlite3 sqlite.db "select * from categories"`

You can open an interactive session with `sqlite3 sqlite.db`, but *beware* its a static view of the database at the point in timee you started the session. You won't see any upates after. Example session
```
sqlite> .tables
accounts    categories  deals       productssele
sqlite> select * from categories;
--- data ---
sqlite> .quit
```

# Design Notes (WIP)
Useful types
```typescript
type ShippingDetails = {
    email: string, name: string, address: string, postcode: string
}
type Account = { id: string, passwordHash: string } & ShippingDetails
type AccountApiResponse = {id: string} & ShippingDetails

type Product = {
    id: number, 
    quantityRemaining: number
    categoryId: number, 
    price: number,
    shortDescription: string, 
    longDescription: string
}
type ProductCategory = { id: number, name: string }
type ProductDeal = { productId: number, startDate: Date, endDate: Date }

type OrderItem = { productId: number, quantity: number }
type OrderSummary = { id: string, total: number, updatedDate: Date}
type Order = OrderSummary & {
    customerId?: string, // not present on guest checkout
    shippingDetails: ShippingDetails, 
    items: [OrderItem],
}
type OrderApiRequest = {
    paymentToken: string, 
    shippingDetails: ShippingDetails, 
    items: [OrderItem]
}
type OrderApiResponse = Order | {
    error: string, 
    items: [{productId: number, quantityRemaining: number}]
}
type Basket = {total: number, items: [OrderItem]}

type Session = {basket?: Basket, customerId: string}
```

API Model Summary.  See the OpenAPI spec for details
```
POST /account/sign-in {email: string, password: string} => AccountApiResponse, starts session
POST /account/sign-up ShippingDetails => AccountApiResponse, starts session
GET  /account ShippingDetails => AccountApiResponse, must be signed in
POST /account ShippingDetails => AccountApiResponse, must be signed in
GET  /product/catalogue?search|category GET [Product]
GET  /product/categories [ProductCategory]
GET  /product/deals [Product]
GET  /order/basket Basket
POST /order/basket Basket => Basket, starts session
GET  /order/history [OrderSummary], must be signed in
POST /order/checkout OrderRequest => OrderResponse, starts session
```

Desired user behaviour is
- Guest user can view products, deals categories, create/view basket, place order
- Guest user signing up should not empty basket 
- Customer (a signed in user) can see basket across devices.
- Guest or Customer can following link in email sent after order to see it without signing in

Other design notes
- Using Node 10 as it was the default for WSL2/Ubuntu 20. More recent would make setup harder and we'd need to figure out what each cloud provider supported as a max.
- So, using CommonJS modules to avoid extra complexity from transpilation.
- Not Typescript for simplicity of setup. Also it's a more complex lanaguage to learn. However, you can see by the Typescript model above that I need some type defintions to help me reason about the code, so I'm on the fence about if JS is actually any easier.
- Express rather than Azure Functions. Mainly because it is easier to Google for Express solutions, but also because sessions/authorisation would need a re-think.
- No 'code first' OpenAPI spec despite the tediousness of OpenAPI to write. Mainly for simplicity, but also because the spec might be useful a useful artefact to test other implementations against. 
