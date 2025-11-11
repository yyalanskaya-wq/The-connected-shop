export class HomePage {

  open() {
    cy.visit('https://theconnectedshop.com/');
  }
 
  checkUrl() {
    cy.url().should('eq', 'https://theconnectedshop.com/');
  }

  verifyTitle() {
    cy.title().should('include', 'The Connected Shop - Smart Locks, Smart Sensors, Smart Home & Office');
  }
}