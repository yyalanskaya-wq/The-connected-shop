export class Header {

  logo = 'a.header__heading-link';
  logoImg = 'img.header__heading-logo';
  cartIcon = 'a.header__icon--cart';
  cartSvg = 'svg.icon-cart';
  accountLink = 'div.header__icons > a.header__icon--account';
  accountSvg = 'div.header__icons > a.header__icon--account > svg.icon-account';
  phoneLink = 'div.header__icons > a.header__customer-support-region';
  phoneSvg = 'div.header__icons > a.header__customer-support-region > svg.icon-support-region';
  phoneNumber = 'div.header__icons > a.header__customer-support-region > span > span';
 
 
  verifyLogo() {
    cy.get(this.logo)
      .should('be.visible')
      .and('have.attr', 'href', '/')
      .click();
    cy.get(this.logoImg)
      .should('be.visible')
      .and('have.attr', 'width', '180')
      .and('have.attr', 'height', '90.0');
  }
 
  verifyCart() {
    cy.get(this.cartIcon)
      .should('be.visible')
      .and('have.attr', 'href', '/cart')
      .click();
    cy.url().should('eq', 'https://theconnectedshop.com/');
    cy.get(this.cartSvg)
      .should('be.visible')
      .and('have.attr', 'width', '24')
      .and('have.attr', 'height', '24');
  }
 
  verifyAccount() {
    cy.get(this.accountLink)
      .should('be.visible')
      .and('have.attr', 'href', 'https://theconnectedshop.com/customer_authentication/redirect?locale=en&region_country=US');
    cy.get(this.accountSvg)
      .should('be.visible')
      .and('have.attr', 'width', '24')
      .and('have.attr', 'height', '24');
  }
 
  verifyPhone() {
    cy.get(this.phoneLink)
      .should('be.visible')
      .and('have.attr', 'href', 'tel:(305) 330-3424');
    cy.get(this.phoneSvg)
      .should('be.visible')
      .and('have.attr', 'width', '24')
      .and('have.attr', 'height', '24');
    cy.get(this.phoneNumber)
      .should('contain', '(305) 330-3424');
  }

}