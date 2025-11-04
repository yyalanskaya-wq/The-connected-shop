describe ('The Connected Shop - Перевірка відкриття сайту', () => {
//     it('Повинен відкрити головну сторінку і перевірити URL', () => {
//         cy.visit('https://theconnectedshop.com/');
//         cy.url().should('eq','https://theconnectedshop.com/');
//         cy.title().should('include','The Connected Shop - Smart Locks, Smart Sensors, Smart Home & Office');
// })
// it('Перевірка логотипу', () =>{
//     cy.visit ('https://theconnectedshop.com/');
//     cy.get('a.header__heading-link')
//         .should('be.visible')
//         .and('have.attr','href','/')
//         .click();
//     cy.url().should('eq','https://theconnectedshop.com/');
//     cy.get('img.header__heading-logo')
//         .should('be.visible')
//         .and('have.attr','width','180')
//         .and('have.attr', 'height','90.0');
// })
// it('Перевірка корзини', ()=>{
//     cy.visit('https://theconnectedshop.com/cart');
//     cy.get('a.header__icon--cart')
//         .should('be.visible')
//         .and('have.attr','href','/cart')
//         .click();
//     cy.url().should('eq','https://theconnectedshop.com/cart');
//     cy.get('svg.icon-cart')
//         .should('be.visible')
//         .and('have.attr','width','24')
//         .and('have.attr','height','24');
// })
it('Перевірка аккаунту', ()=>{
    cy.visit('https://theconnectedshop.com/');
    cy.get('div.header__icons > a').eq(1)
        .should('be.visible')
        .and('have.attr','href','https://theconnectedshop.com/customer_authentication/redirect?locale=en&region_country=US');
    cy.get('div.header__icons svg.icon-account')
        .should('be.visible')
        .and('have.attr','width','24')
        .and('have.attr','height','24');
})
// it('Перевірка номера', () =>{
//     cy.visit('https://theconnectedshop.com/');
//     cy.get('div.header__icons > a.header__customer-support-region')
//         .should('be.visible')
//         .and('have.attr','href','tel:(305) 330-3424');
//     cy.get('div.header__icons svg.icon-support-region')
//         .should('be.visible')
//         .and('have.attr','width','24')
//         .and('have.attr','height','24')
//         .and('have.attr','fill','none');
//     cy.get('div.header__icons > a').first()
//         .should('be.visible')
//         .and('contain', '(305) 330-3424');
// })    
})