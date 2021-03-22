const utils = require('../../../utils/utils')

// Order Id is a base64url encoded random number for reasons stated elsewhere
// We add an integer primary key to make it more efficient to link order items
// with an order.  
const schemaDdl = `
create table orders (
    pk integer primary key,
    id char(22) not null,
    customerId integer,
    total integer not null,
    updatedDate dateTime not null, 
    email text not null, 
    name text not null, 
    address text not null, 
    postcode text not null
);
create unique index idxOrdersId on orders(id);
create index idxCustomerId on orders(customerId);

create table orderItems (
    orderId integer,
    productId integer not null, 
    quantity integer not null,
    foreign key(productId) references products(id)
    foreign key(orderId) references orders(pk)
);
`


async function NewOrderDatabase(db) {
    const orders = []

    db.exec(schemaDdl)

    const externalColumns = 'id, customerId, total, updatedDate, email, name, address, postcode'

    async function getOrdersByCustomerId(customerId) {
        const ordersAndItems = db.prepare(
            `select ${externalColumns}, orderItems.productId, orderItems.quantity from orders
             inner join orderItems on orderItems.orderId = orders.pk
             and orders.customerId = ?`
        ).all(customerId)

        return mapJoinedOrdersAndItemToOrders(ordersAndItems)
    }

    async function getOrderByToken(orderToken) {
        // In our simple database the id and the token might as well be the same.
        // Token is suitable for sending in a 'track my order' email. So needs to be 
        // unguessable. In practice we'd have an internal order id for reference
        // and separate token so we can reset the token if it gets stolen.   
        const ordersAndItems = db.prepare(
            `select ${externalColumns}, orderItems.productId, orderItems.quantity from orders
             inner join orderItems on orderItems.orderId = orders.pk
             and orders.id = ?`
        ).all(orderToken)

        return mapJoinedOrdersAndItemToOrders(ordersAndItems)[0]
    }

    async function addOrder(customerId, order) {
        const { email, name, address, postcode } = order.shippingDetails
        const total = order.total
        const id = utils.urlSafeUniqueId()
        const updatedDate = (new Date()).toISOString()   // sqlite doesn't do dates!

        // SQlite specific thing: an integer primary key not given a value is automatically
        // given an incrementing value. This is returned as lastInsertRowid which we can use 
        // to insert the order items

        const orderSql = `insert into orders (${externalColumns}) values(?, ?, ?, ?, ?, ?, ?, ?)`
        const { lastInsertRowid } = db.prepare(orderSql)
            .run(id, customerId, total, updatedDate, email, name, address, postcode)

        const itemStatement = db.prepare('insert into orderItems (orderId, productId, quantity) values (?, ?, ?)')
        order.items.forEach(item => itemStatement.run(lastInsertRowid, item.productId, item.quantity))

        return await getOrderByToken(id)
    }

    return {
        getOrdersByCustomerId,
        getOrderByToken,
        addOrder
    }
}

module.exports = {
    NewOrderDatabase
}


function mapJoinedOrdersAndItemToOrders(rows) {
    const orders = rows.reduce((obj, row) => {
        let order = obj[row.id]

        if (!order) {
            const { id, customerId, total, updatedDate, email, name, address, postcode } = row
            order = {
                id,
                customerId,
                total,
                updatedDate,
                shippingDetails: { email, name, address, postcode },
                items: []
            }
            obj[row.id] = order
        }

        order.items.push({productId: row.productId, quantity: row.quantity})
        return obj
    }, {})
    return Object.values(orders)
}