describe('The connected shop- Opening the site', () => {
    it('Open the site and check URL', () => {
        cy.visit('https://theconnectedshop.com/')
        cy.url().should('eq','https://theconnectedshop.com/')
        cy.title().should('include','The Connected Shop - Smart Locks, Smart Sensors, Smart Home & Office')
    })
})