const utils = require('../../../utils/utils')
const productTestData = require('../test-products')

// We clone (deep copy) everything we put in and take out of our in memory
// data store. This prevents calling code that has retained a refence to it
// from being able to acidentally manipulate data that is now inside our
// fake database. 
const clone = utils.clone

async function NewProductDatabase() {
    const database = productTestData.getTestData()

    async function getAllProducts() {
        return clone(database.products)
    }

    async function getProductsByIds(ids) {
        const matching = await database.products.filter(product => ids.includes(product.id))
        return clone(matching)
    }

    async function getProductCategories() {
        return clone(database.categories)
    }

    async function getProductsByCategory(categoryId) {
        const products = database.products.filter(
            product => product.categoryId === Number(categoryId)
        )
        return clone(products)
    }

    async function getProductsByText(searchTerm) {
        const trimmedSearch = searchTerm.trim()

        const matchProductByText = product =>
            utils.caseInsensitiveIncludes(product.shortDescription, trimmedSearch) ||
            utils.caseInsensitiveIncludes(product.longDescription, trimmedSearch)

        return clone(database.products.filter(matchProductByText))
    }

    async function getProductsWithCurrentDeals(date) {
        const isDealValidForDate = deal =>
            date >= Date.parse(deal.startDate) && date < Date.parse(deal.endDate)

        const productIdsWithCurrentDeals =
            database.deals.filter(isDealValidForDate).map(deal => deal.productId)

        const deals = database.products.filter(product => productIdsWithCurrentDeals.includes(product.id))
        return clone(deals)
    }

    async function decreaseStock(productQuantities) {
        // There's no check for going to negative stock levels. Should there be?
        database.products.forEach(product => {
            if (productQuantities[product.id])
                product.quantityRemaining -= productQuantities[product.id]
        })
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
