/// <reference types="cypress" />

context('Basket Tests, these tests are for checking the basket is correctly updated when adding or removing items', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })

    it('should check the title contains the brand name', () => {
        // Just checks the H1 and the first item in the product list
        cy.get('h1').should('have.text', 'ACME Stores')
        cy.contains('Raindrops on Roses')
    });

    it('should then click on Raindrops and Roses and add one of those items into the basket', () => {
        // Adds items to basket
        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get('.roundel_roundel__IjmuG').should('have.text', '1')

        // Clicks on the basket and checks there is one item in the basket
        cy.get('.roundel_container__x3QCt > .iconElement_iconButton__3hg85 > .svg-inline--fa > path').click()
        cy.get('.productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 1')
    });

    it('this time it will add two items', () => {
        // Adds items to basket
        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get('.roundel_roundel__IjmuG').should('have.text', '2')

        // Clicks on the basket and checks there is one item in the basket
        cy.get('.roundel_container__x3QCt > .iconElement_iconButton__3hg85 > .svg-inline--fa > path').click()
        cy.get('.productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 2')
    });
})

describe('Basket test, this tests add some bits into the basket and then goes back and adds more into it', () => {
    it('should add an item and then check the basket and then go back and add another item', () => {
        cy.visit('http://localhost:3000')

        // Just checks the H1 and the first item in the product list
        cy.get('h1').should('have.text', 'ACME Stores')
        cy.contains('Raindrops on Roses')

        // Adds items to basket
        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get('.roundel_roundel__IjmuG').should('have.text', '1')

        // Clicks on the basket and checks there is one item in the basket
        cy.get('.roundel_container__x3QCt > .iconElement_iconButton__3hg85 > .svg-inline--fa > path').click()
        cy.get('.productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 1')

        // Goes back to the homepage
        cy.get('.header_brandname__2LlPh').click()

        // Adds items to basket
        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get('.roundel_roundel__IjmuG').should('have.text', '3')

        // Clicks on the basket and checks there is one item in the basket
        cy.get('.roundel_container__x3QCt > .iconElement_iconButton__3hg85 > .svg-inline--fa > path').click()
        cy.get('.productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 3')
    });
})

describe('Basket test, this tests add some bits into the basket and then removes them and checks they are empty', () => {
    it('should add items and then remove them', () => {
        cy.visit('http://localhost:3000')

        // Just checks the H1 and the first item in the product list
        cy.get('h1').should('have.text', 'ACME Stores')
        cy.contains('Raindrops on Roses')

        // Adds items to basket
        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get(':nth-child(2) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get(':nth-child(3) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()
        cy.get(':nth-child(4) > .productTile_tileGrid__3g8r3 > .productTile_cta__5FLhs').click()

        // Checks the items in the basket
        cy.get('.roundel_roundel__IjmuG').should('have.text', '4')

        // Clicks on the basket and checks there is one item in the basket
        cy.get('.roundel_container__x3QCt > .iconElement_iconButton__3hg85 > .svg-inline--fa > path').click()

        cy.get(':nth-child(1) > .productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 1')
        cy.get(':nth-child(2) > .productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 1')
        cy.get(':nth-child(3) > .productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 1')
        cy.get(':nth-child(4) > .productTile_tileGrid__3g8r3 > :nth-child(4)').should('have.text', 'Quantity: 1')

        // Checks the total of the page amount
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(7)').should('have.text', 'Total: 41.76 ')

        // It then removes some items from the basket
        cy.get(':nth-child(4) > .productTile_tileGrid__3g8r3 > .productTile_secondaryButton__16ZUr').click()

        // Checks the total of the page amount has now gone down
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(6)').should('have.text', 'Total: 33.769999999999996 ')
    });
})
