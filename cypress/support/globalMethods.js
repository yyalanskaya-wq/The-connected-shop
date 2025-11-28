export class GlobalMethods{
    click(selector){
        cy.get(selector)
            .should('be.visible')
            .click()
    }

    typeValue(selector,value){
        cy.get(selector)
            .should('be.visible')
            .type(value)
            .should('have.value',value);
    }

    checkAttribute(selector, nameAttribute, value) {
        cy.get(selector)
            .should('be.visible')
            .and('have.attr', nameAttribute, value);
    }
 
    select(selector, value) {
        cy.get(selector)
            .should('be.visible')
            .select(value)
            .should('have.value', value);
    }
 
    checkText(selector, text) {
        cy.get(selector)
            .should('be.visible')
            .and('contain', text);
    }
 
    checkUrl(url) {
        cy.url()
            .should('eq', url);
    }
 
    visit(url) {
        cy.visit(url);
    }
 
    typeDate(selector, date) {
        cy.get(selector)
            .clear()
            .type(date)
            .should('have.value', date);

    }
 
    log(message) {
        cy.log(` ${message}`);
    }

}