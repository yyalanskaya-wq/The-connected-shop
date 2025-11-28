import { GlobalMethods } from "../support/globalMethods";
export class Registration extends GlobalMethods{
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
    tagField = '[data-testid="new-tag-input"]';
    addTagButton = '[data-testid="add-tag-button"]';
    cancel = '[data-testid="transaction-form-cancel"]';
    submit = '[data-testid="transaction-form-submit"]';

    open() {
        this.log('Відкрити сайт');
        this.visit('https://finmore.netlify.app/');
    }

    checkRegUrl() {
        this.log('Перевірка лінку');
        this.checkUrl('https://finmore.netlify.app/');
    }

    verifyTitle() {
        this.log('Перевірка тайтлу')
        cy.title()
            .should('include','Повнофункціональний фінансовий менеджер');
    }

    checkLogin() {
        this.log('Перевірка логін кнопки');
        this.checkText(this.loginbutton, 'Увійти')
        this.click(this.loginbutton);
    }
    checkRegister() {
        this.log('Перевірка кнопки реєстрації');
        this.checkText(this.registerbutton, 'Зареєструватися')
        this.click(this.registerbutton);
        
    }

    checkFullname(value) {
        this.log('Перевірка повного імя');
        this.checkAttribute(this.fullNameinput, 'placeholder','Іван Петренко');
        this.typeValue(this.fullNameinput, value);

    }

    checkEmail(userEmail){
        this.log('Перевірка імейлу')
        this.checkAttribute(this.emailInput, 'placeholder','your@email.com')
        this.typeValue(this.emailInput, userEmail)
    }

    checkPassword(userPassword){
        this.log('Перевірка паролю')
        this.checkAttribute(this.password, 'placeholder','Мінімум 6 символів')
        this.typeValue(this.password, userPassword)
    }

    checkPassword2(userPassword){
        this.log ('Підтвердження паролю')
        this.checkAttribute(this.password2, 'placeholder','Повторіть пароль')
        this.typeValue(this.password2, userPassword)

    }
    
    checkCurrency(){
        this.log ('Перевірка валюти')
        cy.get(this.currencyButton)
            .select('USD')
            .should ('have.value', 'USD')
            .and('contain', 'Долар США (USD)')

    }

    checkRegister2(){
        this.log('Кнопка реєстрації')
        this.checkText(this.registerbutton2, 'Зареєструватися')
        this.click(this.registerbutton2)
    }
    checkTransactionButton(){
        this.log('Кнопка транзакцій')
        this.checkText(this.transactionButton, 'Додати транзакцію')
        this.click(this.transactionButton);
    }
    checkExpensesButton(){
        this.log('Вид транзакції');
        this.checkText(this.expenseButton, 'Витрата' )
        this.checkText(this.incomeButton, 'Дохід')
        this.click(this.incomeButton);
    }

    checkSumInput(){
        this.log('Перевірка суми');
        cy.get(this.sumInput)
        .clear()
        .type('1020.3')
        .should('have.value', '1020.30');
    }

    checkCategory(){
        this.log('Перевірка категорії')
        this.checkText(this.transCategory, 'Оберіть категорію')
        this.select(this.transCategory, 'Фриланс')
        // cy.get(this.transCategory)
        // .should ('contain','Оберіть категорію')
        // .select('Фриланс')
        // .should ('have.value', 'Фриланс')
        // .and('contain', 'Фриланс')
    }

    checkDescription(){
        this.log('Перевірка опису')
        this.typeValue(this.transDescription, 'Розробка')
    }

    checkDate(){
        this.log('Перевірка дати')
        this.typeDate(this.date,'2025-10-19' )
    }

    checkAccount(){
        this.log('Перевірка рахунку')
        this.checkText(this.account, 'Оберіть рахунок' )
        this.select(this.account, 'Картка ПриватБанку')
        // cy.get(this.account)
        // .should('contain','Оберіть рахунок')
        // .select('Картка ПриватБанку')
        // .should('have.value','Картка ПриватБанку')
        // .and('contain','Картка ПриватБанку')
    }

    checkTag(){
        this.log('Перевірка тегу')
        this.checkAttribute(this.tagField, 'placeholder','Додати тег' )
        this.typeValue (this.tagField, 'Дохід за жовтень')
        this.click(this.addTagButton)
    }
    checkEndButtons(){
        this.log('Перевірка кнопок скасувати/створити')
        this.checkText(this.cancel, 'Скасувати')
        this.checkText(this.submit, 'Створити')
        this.click(this.submit)
    }



}