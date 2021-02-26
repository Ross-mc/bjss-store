
function NewProductApi(productService) {

    // Because there's no input validation this all looks fairly pointless
    // but done to match the other things 
    return {
        search: async (req, res) => {
            const products = await productService.searchProducts(req.query)
            res.json(products)
        },
        categories: async (_, res) => {
            const products = await productService.getProductCategories()
            res.json(products)
        },
        deals: async (_, res) => {
            const products = await productService.searchProducts({dealDate: new Date()})
            res.json(products)
        },
    }
}

module.exports = {
    NewProductApi
}