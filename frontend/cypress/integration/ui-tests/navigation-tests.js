/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })

    it('should check the title contains the brand name', () => {
        // Just checks the H1 and the first item in the product list
        cy.get('h1').should('have.text', 'ACME Stores')
    })

    it('should click on the navigation button and go to the Shoes page ', () => {
        // Clicks the navigation item and goes to Shoes section
        cy.get('.header_header__2SBwN > :nth-child(1) > .iconElement_iconButton__3sE8b > .svg-inline--fa > path').click().get('ul > :nth-child(1) > a').click()

        cy.get(':nth-child(1) > .productTile_tileGrid__1cgS8 > h3').should('have.text', 'Raindrops on Roses')
        cy.get(':nth-child(2) > .productTile_tileGrid__1cgS8 > h3').should('have.text', 'Whiskers on Kittens')
        cy.get(':nth-child(1) > .productTile_tileGrid__1cgS8 > p').should('have.text', '£9.99')
        cy.get(':nth-child(2) > .productTile_tileGrid__1cgS8 > p').should('have.text', '£3.79')

    })

    it('should click on the navigation button and go to the Ships page ', () => {
    
        // Clicks the navigation item and goes to Ships section
        cy.get('.header_header__2SBwN > :nth-child(1) > .iconElement_iconButton__3sE8b > .svg-inline--fa > path').click().get('ul > :nth-child(2) > a').click()

        cy.get(':nth-child(1) > .productTile_tileGrid__1cgS8 > h3').should('have.text', 'Warm Woollen Mittens')
        cy.get(':nth-child(1) > .productTile_tileGrid__1cgS8 > p').should('have.text', '£7.99')
    })

    it('should click on the navigation button and go to the Sealing Wax page ', () => {
    
        // Clicks the navigation item and goes to Sealing Wax section
        cy.get('.header_header__2SBwN > :nth-child(1) > .iconElement_iconButton__3sE8b > .svg-inline--fa > path').click().get('ul > :nth-child(3) > a').click()

        cy.get(':nth-child(1) > .productTile_tileGrid__1cgS8 > h3').should('have.text', 'Bright Copper Kettle')
        cy.get(':nth-child(1) > .productTile_tileGrid__1cgS8 > p').should('have.text', '£19.99')
    })
})