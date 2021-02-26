const utils = require('../../../utils/utils')


function getTestData() {
    return {
        products: [
            {
                id: 0,
                categoryId: 0,
                price: 100,
                quantityRemaining: 2,
                shortDescription: 'Dog',
                longDescription: 'The dog (Canis familiaris when considered a distinct species or Canis lupus familiaris when considered a subspecies of the wolf) is a domesticated carnivore of the family Canidae...',
            },
            {
                id: 1,
                categoryId: 0,
                price: 1000,
                quantityRemaining: 2,
                shortDescription: 'Giraffe',
                longDescription: 'The giraffe (Giraffa) is an African artiodactyl mammal, the tallest living terrestrial animal and the largest ruminant. It is traditionally considered to be one species, Giraffa...',
            },
            {
                id: 2,
                categoryId: 0,
                price: 90,
                quantityRemaining: 2,
                shortDescription: 'Koala',
                longDescription: 'The koala or, inaccurately, koala bear[a] (Phascolarctos cinereus) is an arboreal herbivorous marsupial native to Australia. It is the only extant representative of the family Phascolarctidae...',
            },
            {
                id: 3,
                categoryId: 1,
                price: 1,
                quantityRemaining: 2,
                shortDescription: 'Brazil Nut',
                longDescription: 'The Brazil nut (Bertholletia excelsa) is a South American tree in the family Lecythidaceae, and it is also the name of the trees commercially harvested edible seeds. It is one of the largest...',
            },
            {
                id: 4,
                categoryId: 1,
                price: 2,
                quantityRemaining: 2,
                shortDescription: 'Apricot',
                longDescription: 'An apricot is a fruit, or the tree that bears the fruit, of several species in the genus Prunus (stone fruits).',
            },
            {
                id: 5,
                categoryId: 1,
                price: 3,
                quantityRemaining: 2,
                shortDescription: 'Orange',
                longDescription: 'The orange is the fruit of various citrus species in the family Rutaceae (see list of plants known as orange); it primarily refers to Citrus × sinensis, which is also called sweet orange...',
            }
        ],
        categories: [
            { id: 0, name: 'Animals' },
            { id: 1, name: 'Fruits' }
        ],
        deals: [
            { productId: 1, startDate: '2021-02-13', endDate: '2030-02-13' },
            { productId: 3, startDate: '2021-02-13', endDate: '2030-02-13' },
            { productId: 4, startDate: '1970-01-13', endDate: '1970-01-13' },
        ]
    }
}

// We clone (deep copy) everything we put in and take out of our in memory
// data store. This prevents calling code that has retained a refence to it
// from being able to acidentally manipulate data that is now inside our
// fake database. 
const clone = utils.clone

async function NewProductDatabase() {
    const database = getTestData()

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

    test: {
        getTestData
    }
}
