describe('Opening the site - the connected shop', () => {
    it('Opening the site and check URL', () => {
        cy.visit('https://theconnectedshop.com/')
        cy.url().should('eq','https://theconnectedshop.com/')
        cy.title().should('include','The Connected Shop - Smart Locks, Smart Sensors, Smart Home & Office')
    })
})