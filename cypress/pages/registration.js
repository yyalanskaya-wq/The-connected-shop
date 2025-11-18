export class Registration {
    loginbutton = '[data-testid="login-submit-button"]';
    registerbutton = '[data-testid="switch-to-register-button"]';
    fullNameinput = '[data-testid="register-name-input"]';
    emailInput = '[data-testid="register-email-input"]';
    password = '[ data-testid="register-password-input"]';
    password2 = '[data-testid="register-confirm-password-input"]';
    currencyButton = '[data-testid="register-currency-select"]';
    currencyUah = '[data-testid="currency-option-UAH"]';
    currencyUSD = '[data-testid="currency-option-USD"]';
    registerbutton2 = '[data-testid="register-submit-button"]'

    open() {
        cy.log('Відкрити сайт')
        cy.visit('https://finmore.netlify.app/');
    }

    checkUrl() {
        cy.log('Перевірка лінку')
        cy.url().should('eq', 'https://finmore.netlify.app/');
    }

    verifyTitle() {
        cy.log('Перевірка тайтлу')
        cy.title().should('include','Повнофункціональний фінансовий менеджер')
    }

    checkLogin() {
        cy.log('Перевірка логін кнопки')
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
        cy.get(this.fullNameinput)
        .should('be.visible')
        .and('have.attr','placeholder','Іван Петренко');
        cy.get(this.fullNameinput)
        .type(userFullName)
        .should('have.value', userFullName)

    }

    checkEmail(userEmail){
        cy.get(this.emailInput)
        .should('be.visible')
        .and('have.attr','placeholder','your@email.com');
        cy.get(this.emailInput)
        .type(userEmail)
        .should('have.value', userEmail)
    }

    checkPassword(userPassword){
        cy.get(this.password)
        .should('be.visible')
        .and('have.attr','placeholder','Мінімум 6 символів');
        cy.get(this.password)
        .type(userPassword)
        .should('have.value', userPassword)
    }

    checkPassword2(userPassword){
        cy.get(this.password2)
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Повторіть пароль');
        cy.get(this.password2)
        .type(userPassword)
        .should('have.value', userPassword)

    }
    
    checkCurrency(){
        cy.get(this.currencyButton).select('USD')
        .should ('have.value', 'USD')
        .and('contain', 'Долар США (USD)')

        // .should('.dropdown-menu-item', this.currencyUah)
        // (this.currencyButton).click();
        // cy.contains('.dropdown-menu-item', currencyUah)

    }

    checkRegister2(){
        cy.get(this.registerbutton2)
        .should ('be.visible')
        .and('contain','Зареєструватися')
        .click()
    }

}