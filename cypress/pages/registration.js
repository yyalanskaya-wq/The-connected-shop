export class Registration {
    loginbutton = 'button.bg-green-600';
    registerbutton = 'button.text-green-600'
    fullNameinput = 'input.w-full'
    emailInput = 'input.w-full'
    password = 'input.w-full'
    password2 = 'input.w-full'
    currencyButton = ''

    open() {
        cy.visit('https://finmore.netlify.app/');
    }

    checkUrl() {
        cy.url().should('eq', 'https://finmore.netlify.app/');
    }

    verifyTitle() {
        cy.title().should('include','Повнофункціональний фінансовий менеджер')
    }

    checkLogin() {
        cy.get(this.loginbutton)
        .should('be.visible')
        .and('contain','Увійти')
        .click()
    }
    checkRegister() {
        cy.get(this.registerbutton)
        .should ('be.visible')
        .and('contain','Зареєструватися')
        .click()
    }

    checkFullname(userFullName) {
        cy.get(this.fullNameinput).eq(0)
        .should('be.visible')
        .and('have.attr','placeholder','Іван Петренко');
        cy.get(this.fullNameinput).eq(0)
        .type(userFullName)
        .should('have.value', userFullName)

    }

    checkEmail(userEmail){
        cy.get(this.emailInput).eq(1)
        .should('be.visible')
        .and('have.attr','placeholder','your@email.com');
        cy.get(this.emailInput).eq(1)
        .type(userEmail)
        .should('have.value', userEmail)
    }

    checkPassword(userPassword){
        cy.get(this.password).eq(2)
        .should('be.visible')
        .and('have.attr','placeholder','Мінімум 6 символів');
        cy.get(this.password).eq(2)
        .type(userPassword)
        .should('have.value', userPassword)
    }

    checkPassword2(userPassword){
        cy.get(this.password2).eq(3)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Повторіть пароль');
        cy.get(this.password2).eq(3)
        .type(userPassword)
        .should('have.value', userPassword)

    }
    // checkCurrency(){
    //     cy.get('[data-test-id="currency-option-GB"]').click();

    // }

}