# BJSS Store 

Academy 2021 TODO
x Make API consistent with spec and consistent property casing.
- Flip out Sequlise for something using raw SQL
x Layers: data access (incl mock), biz, api handler/imperative shell
   - Maybe unit tests, split integration/unit
   - rename so layer is obv from file name
- Tidy deps.
x Simplify / structure code
x Implement signin/registration
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
Run the integration tests against the server `npm integration-test`

# Debugging

In VS Code, go to the debug tab. In the drop down select what you want to debug. 
If you choose to debug the server you'll have to make requests to it somehow.

# Design WIP
Useful types
```typescript
type ShippingDetails = {
    email: string, name: string, address: string, postcode: string
}
type Account = { id: string, passwordHash: string } & ShippingDetails

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
type OrderRequest = {
    paymentToken: string, 
    shippingDetails: ShippingDetails, 
    items: [OrderItem]
}
type OrderResponse = Order | {error: string, items: [ProductQuantity]}
type Basket = {total: number, items: [OrderItem]}

type Session = {basket?: Basket, customerId: string}
```

SQL Model
- product: id, category_id, price, quantity_remaining, short_description, long_description
- product_category: id, name
- deal: id: product_id, start_date, end_date
- account: id, email, name, address, postcode, password_hash
- order: id, token, customer_id, shipping_id, total, updated_date
- order_item: id, order_id, product_id, quantity
- order_shipping: id, email, name, address, postcode
- session: token, customerId, basket

/account/sign-in POST  {email: string, password: string} => SC
/account/sign-up POST {...ShippingDetails, password: string} => SC
/account SC GET ShippingDetails
                    POST ShippingDetails
/product/catalogue?search|category GET  [Product]
/product/categories [ProductCategory]
/product/deals [Product]
/order/basket SC GET Basket
                 POST Basket => Basket
/order/history SC GET [OrderSummary]
/order/checkout POST OrderRequest, returns OrderResponse


Best user behaviour is
- Guest user can create basket, order, see orders until session expires. 
- After creating a basket or order a guest user can sign in/up and still see those things plus order history. 
- A signed in user can see basket across devices.
- A guest or customer can following link in email sent after order to see it.  




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