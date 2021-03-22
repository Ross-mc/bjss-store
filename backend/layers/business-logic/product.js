
function NewProductService(productDb) {

    async function searchProducts(query) {

        if (query) {
            if (query.dealDate)
                return productDb.getProductsWithCurrentDeals(query.dealDate)
            else if (query.category !== undefined)
                return productDb.getProductsByCategory(query.category)
            else if (query.search)
                return productDb.getProductsByText(query.search)
        }

        return productDb.getAllProducts()
    }

    async function getProductCategories() {
        return productDb.getProductCategories()
    }

    // Takes {id: quantity} and returns total price (as if there were enought stock)
    // and any items where there is not enough stock as an object of the form:
    // {
    //   total: number, 
    //   notEnoughStock: [{id: number, quantityRemaining: number}]
    // }
    async function checkStock(productQuantities) {
        const idsToCheck = Object.keys(productQuantities).map(Number)
        const orderedProducts = await productDb.getProductsByIds(idsToCheck)

        const accumulator = (total, product) => total += product.price * productQuantities[product.id]
        const total = orderedProducts.reduce(accumulator, 0)

        const notEnoughStock = orderedProducts.filter(
            product => product.quantityRemaining < productQuantities[product.id]
        ).map(product => ({id: product.id, quantityRemaining: product.quantityRemaining}))

        return {notEnoughStock, total}
    }

    async function decreaseStock(productQuantities) {

        // There's a race condition here. Solutions to this in real systems not what you might think. 
        if ((await checkStock(productQuantities)).notEnoughStock.length > 0)
            throw new Error(`Trying to descrese stock below zero`)

        return productDb.decreaseStock(productQuantities)
    }

    return {
        searchProducts,
        getProductCategories,
        checkStock,
        decreaseStock
    }
}

module.exports = {
    NewProductService
}