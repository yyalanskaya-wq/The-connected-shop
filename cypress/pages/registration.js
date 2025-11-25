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
    registerbutton2 = '[data-testid="register-submit-button"]';
    transactionButton = '[data-testid="add-transaction-button"]';
    expenseButton = '[data-testid="expense-type-button"]';
    incomeButton = '[data-testid="income-type-button"]';
    sumInput = '[data-testid="transaction-amount-input"][step="0.01"]';
    transCategory = '[data-testid="transaction-category-select"]';
    transDescription = '[data-testid="transaction-description-input"]';
    date = '[data-testid="transaction-date-input"]';
    account = '[data-testid="transaction-account-select"]';
    tag = '[data-testid="new-tag-input"]';
    addTag = '[data-testid="add-tag-button"]';
    cancel = '[data-testid="transaction-form-cancel"]';
    submit = '[data-testid="transaction-form-submit"]'

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

    }

    checkRegister2(){
        cy.get(this.registerbutton2)
        .should ('be.visible')
        .and('contain','Зареєструватися')
        .click()
    }
    checkTransactionButton(){
        cy.get(this.transactionButton)
        .should('be.visible')
        .and('contain','Додати транзакцію')
        .click()
    }
    checkExpensesButton(){
        cy.get(this.expenseButton)
        .should('be.visible')
        .and('contain','Витрата');
        cy.get(this.incomeButton)
        .should('be.visible')
        .and('contain','Дохід')
        .click()
    }

    checkSumInput(){
        cy.get(this.sumInput)
        .clear()
        .type('1020.3')
        .should('have.value', '1020.30')
    }

    checkCategory(){
        cy.get(this.transCategory)
        .should ('contain','Оберіть категорію')
        .select('Фриланс')
        .should ('have.value', 'Фриланс')
        .and('contain', 'Фриланс')
    }

    checkDescription(){
        cy.get(this.transDescription)
        .type('Розробка')
        .should('have.value','Розробка')
    }

    checkDate(){
        cy.get(this.date)
        .type('2025-10-19')
        .should('have.value','2025-10-19')
    }

    checkAccount(){
        cy.get(this.account)
        .should('contain','Оберіть рахунок')
        .select('Картка ПриватБанку')
        .should('have.value','Картка ПриватБанку')
        .and('contain','Картка ПриватБанку')
    }

    checkTag(){
        cy.get(this.tag)
        .should('have.attr', 'placeholder','Додати тег')
        .type ('Дохід за жовтень')
        .should('have.value','Дохід за жовтень');
        cy.get(this.addTag)
        .click()
    }
    checkEndButtons(){
        cy.get(this.cancel)
        .should('contain','Скасувати');
        cy.get(this.submit)
        .should('contain','Створити')
        .click({force: true})
    }



}