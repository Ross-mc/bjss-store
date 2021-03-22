context('Actions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })

    it('should check the title contains the brand name', () => {
        // Just checks the H1 and the first item in the product list
        cy.get('h1').should('have.text', 'ACME Stores')
    })

    it('should search for Raindrops on Roses and then add it to the basket', () => {
        // Uses the search feature to search for 
        cy.get('#search').type('Raindrops on Roses')
        cy.get('[href="/search/query/Raindrops on Roses"] > .svg-inline--fa').click()

        // Checks the results are correct
        cy.get('h3').should('have.text', 'Raindrops on Roses')

        // Adds one to the basket
        cy.get('.productTile_cta__3e3EJ').click()

        // Checks the basket count is updated
        cy.get('.roundel_roundel__2JZ6H').should('have.text', '1')
    })

    it('should search for Raindrops on doggies and not find anything', () => {
        // Uses the search feature to search for 
        cy.get('#search').type('Raindrops on doggies')
        cy.get('[href="/search/query/Raindrops on doggies"] > .svg-inline--fa').click()

        // In the future when code returns "No results found" - add assertion to test this
    })
})