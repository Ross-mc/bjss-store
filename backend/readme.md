# BJSS Store 

Academy 2021 TODO
- Add SQL data store
- Fix swagger or remove
- Consider serving frontend on /

This is a Javascript backend using Node.JS to run the Javascript and a framework called Express to help implement the APIs. 

# Getting started

```
cd backend
npm install
code .
```

Start the server `npm start`
Run the unit tests `npm test`
Run the integration tests `npm run integration-test` or all `npm run test-all`

# Debugging

In VS Code, go to the debug tab. In the drop down select what you want to debug. 
If you choose to debug the server you'll have to make requests to it somehow.

# Design Notes (WIP)
Useful types
```typescript
type ShippingDetails = {
    email: string, name: string, address: string, postcode: string
}
type Account = { id: string, passwordHash: string } & ShippingDetails
type AccountApiResponse = {id: string} & ShippingDetails

type ProductQuantity = {id: number, quantityRemaining: number}
type Product = ProductQuantity & {
    categoryId: number, 
    price: number,
    shortDescription: string, 
    longDescription: string
}
type ProductCategory = { id: number, name: string }
type ProductDeal = { productId: number, startDate: Date, endDate: Date }

type OrderItem = { productId: number, quantity: number }
type OrderSummary = { id: string, total: string, updatedDate: string}
type Order = OrderSummary & {
    customerId?: string, // not present on guest checkout
    shippingDetails?: ShippingDetails, // not present until ordered
    items: [OrderItem],
}
type OrderApiRequest = {
    paymentToken: string, 
    shippingDetails: ShippingDetails, 
    items: [OrderItem]
}
type OrderApiResponse = Order | {error: string, items: [ProductQuantity]}
type Basket = {total: number, items: [OrderItem]}

type Session = {basket?: Basket, customerId: string}
```

API Model
```
POST /account/sign-in {email: string, password: string} => AccountApiResponse, starts session
POST /account/sign-up ShippingDetails => AccountApiResponse, starts session
GET  /account ShippingDetails => AccountApiResponse, must be signed in
POST /account ShippingDetails => AccountApiResponse, must be signed in
GET  /product/catalogue?search|category GET [Product]
GET  /product/categories [ProductCategory]
GET  /product/deals [Product]
GET  /order/basket Basket
POST /order/basketBasket => Basket, starts session
GET  /order/history [OrderSummary], must be signed in
POST /order/checkout OrderRequest => OrderResponse, starts session
```

Desired user behaviour is
- Guest user can view products, deals categories, create/view basket, place order
- Guest user signing up should not empty basket 
- Customer (a signed in user) can see basket across devices.
- Guest or Customer can following link in email sent after order to see it without signing in




INSERT INTO product (id,product_Category_Id,price,QUANTITY_REMAINING,short_Description,long_Description) VALUES
	(0,0,1,2,'Dog','The dog (Canis familiaris when considered a distinct species or Canis lupus familiaris when considered a subspecies of the wolf) is a domesticated carnivore of the family Canidae...'),
	(1,0,1,2,'Giraffe','The giraffe (Giraffa) is an African artiodactyl mammal, the tallest living terrestrial animal and the largest ruminant. It is traditionally considered to be one species, Giraffa...'),
	(2,0,1,2,'Koala','The koala or, inaccurately, koala bear[a] (Phascolarctos cinereus) is an arboreal herbivorous marsupial native to Australia. It is the only extant representative of the family Phascolarctidae...'),
	(3,1,1,2,'Brazil Nut','The Brazil nut (Bertholletia excelsa) is a South American tree in the family Lecythidaceae, and it is also the name of the trees commercially harvested edible seeds. It is one of the largest...'),
	(4,1,1,2,'Apricot','An apricot is a fruit, or the tree that bears the fruit, of several species in the genus Prunus (stone fruits).'),
	(5,1,1,2,'Orange','The orange is the fruit of various citrus species in the family Rutaceae (see list of plants known as orange); it primarily refers to Citrus × sinensis, which is also called sweet orange...');
	
INSERT INTO product_category (id,name) VALUES
	(0,'Animals'),
	(1,'Fruits');