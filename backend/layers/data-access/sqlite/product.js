const productTestData = require('../test-products')

const schemaDdl = `
create table categories (
    id integer primary key, 
    name text not null
);

create table products (
    id integer primary key,
    quantityRemaining integer not null,
    categoryId integer not null, 
    price integer not null,
    shortDescription text not null, 
    longDescription text not null,
    foreign key(categoryId) references categories(id)
);
create index idxProductsCategoryId on products(categoryId);

create table deals (
    productId integer not null, 
    startDate date not null, 
    endDate date not null,
    foreign key(productId) references products(id)
);
`

function populateData(db, data) {

    const populate = (dataArray, sql, columnOrder) => {
        const statement = db.prepare(sql)
        dataArray.forEach(row => statement.run(columnOrder.map(column => row[column])))
    }

    populate(data.categories, `insert into categories (id, name) values(?, ?)`, ['id', 'name'])
    populate(data.products,
        `insert into products 
         (id, quantityRemaining, categoryId, price, shortDescription, longDescription) 
         values(?, ?, ?, ?, ?, ?)`,
        ['id', 'quantityRemaining', 'categoryId', 'price', 'shortDescription', 'longDescription']
    )
    populate(data.deals,
        `insert into deals (productId, startDate, endDate) values(?, ?, ?)`,
        ['productId', 'startDate', 'endDate']
    )
}


async function NewProductDatabase(db) {
    const inititalData = productTestData.getTestData()

    db.exec(schemaDdl)
    populateData(db, inititalData)

    async function getAllProducts() {
        return db.prepare('select * from products').all()
    }

    async function getProductsByIds(ids) {
        const sql = `select * from products where id in(${ids.map(_ => '?')})`
        return db.prepare(sql).all(ids)
    }

    async function getProductCategories() {
        return db.prepare('select * from categories').all()
    }

    async function getProductsByCategory(categoryId) {
        return db.prepare('select * from products where categoryId = ?')
            .all(Number(categoryId))
    }

    async function getProductsByText(searchTerm) {
        const trimmedSearch = searchTerm.trim()

        return db.prepare(
            `select * from products 
             where shortDescription like ? or longDescription like ?`
            // What happens if the search string contains a % sign?
        ).all(`%${trimmedSearch}%`, `%${trimmedSearch}%`)
    }

    async function getProductsWithCurrentDeals(date) {
        // sqlite doesn't do dates!
        const toCompare = new Date(date).toISOString()
        return db.prepare(
            `select products.* from products
             inner join deals on deals.productId = products.id
             and ? >= deals.startDate and ? < deals.endDate`
        ).all(toCompare, toCompare)
    }

    async function decreaseStock(productQuantities) {
        // There's no check for going to negative stock levels. Should there be?
        const ids = Object.keys(productQuantities)
        const update = db.prepare(
            `update products
             set quantityRemaining = quantityRemaining - ?
             where id = ?`
        )
        Object.entries(productQuantities)
            .forEach(([id, quantity]) => update.run(quantity, id))
    }


    return {
        getAllProducts,
        getProductsByIds,
        getProductCategories,
        getProductsByCategory,
        getProductsByText,
        getProductsWithCurrentDeals,
        decreaseStock,
    }
}

module.exports = {
    NewProductDatabase,
}
