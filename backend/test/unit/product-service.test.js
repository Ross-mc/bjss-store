const expect = require('chai').expect
const database = require('../../layers/data-access')
const productTestData = require('../../layers/data-access/test-products')
const NewProductService = require('../../layers/business-logic/product').NewProductService

const findById = (products, id) => products.find(p => p.id === id)

describe('Product Service', () => {

    // Mainly happy path regression testing for this toy app. 
    // The error / edge case handling isn't that good anyway. 
    // Note: the default (in memory) data access layer makes for a good testing
    // fake, so we don't really need a mock database.

    let service
    const testData = productTestData.getTestData()

    beforeEach(async () => {
        service = NewProductService((await database.init()).product)
    })

    it('gets all', async () => {
        const products = await service.searchProducts()
        expect(products).to.eql(testData.products)
    })

    it('finds by category', async () => {
        const products = await service.searchProducts({ category: 1 })
        compareProducts(testData.products, [3, 4, 5], products)
    })

    it('finds by text', async () => {
        const foundbyShortDesc = await service.searchProducts({ search: 'Apricot' })
        compareProducts(testData.products, [4], foundbyShortDesc)

        const foundbyLongDesc = await service.searchProducts({ search: 'fruit' })
        compareProducts(testData.products, [4, 5], foundbyLongDesc)
    })

    it('gets in date deals', async () => {
        const products = await service.searchProducts({ dealDate: Date.parse('2021-02-14') })
        compareProducts(testData.products, [1, 3], products)
    })

    it('gets no deals if none in date', async () => {
        const products = await service.searchProducts({ dealDate: Date.parse('2000-02-21') })
        expect(products.length).to.equal(0)
    })

    it('gets categories', async () => {
        const categories = await service.getProductCategories()
        expect(categories).to.eql(testData.categories)
    })

    it('Calcs totals and stock shortages', async () => {
        const quantity = await service.checkStock({
            0: 1,  // one dog at 100
            2: 1, // one koala at 90
            4: 4  // four apricots at 2
        })
        expect(quantity.total).to.equal(198)
        expect(quantity.notEnoughStock).to.eql([{ id: 4, quantityRemaining: 2 }]) // only two apricots remain
    })

    it('Decreases stock', async () => {
        await service.decreaseStock({
            0: 1,
            2: 2,
        })
        const products = await service.searchProducts()
        expect(findById(products, 0).quantityRemaining).to.equal(1)
        expect(findById(products, 2).quantityRemaining).to.equal(998)
        expect(findById(products, 1).quantityRemaining).to.equal(1000) // unchanged
    })

    it('Does not decrease stock below 0', async () => {
        try {
            expect(await service.decreaseStock({1: 10000})).to.throw(Error)
            expect.fail()
        } catch(e) {
        }
    })
})

// It is likely test data will have props not in query response in future.
// but right now they are identical
function compareProduct(expected, actual) {
    expect(actual).to.eql(expected)
}

function compareProducts(data, ids, actual) {

    const actualIds = actual.map(product => product.id)
    expect(actualIds).to.eql(ids)

    ids.forEach(id => compareProduct(findById(data, id), findById(actual, id)))
}