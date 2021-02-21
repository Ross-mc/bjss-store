/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })

    it('should check the title contains the brand name', () => {
        // Just checks the H1 and the first item in the product list
        cy.get('h1').should('have.text', 'ACME Stores')
        cy.get(':nth-child(1) > .productTile_tileGrid__1cgS8 > h3').should('have.text', 'Raindrops on Roses')
    })
})