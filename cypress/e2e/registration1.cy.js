import { Registration } from '../pages/registration';
import { faker } from '@faker-js/faker';
import {generateUniqueEmail} from '../support/utils';
import {generateUkrainianFullName} from '../support/utils'



const testData = require('../fixtures/registrationData'); 


describe('Finmore - перевірка головної сторінки та регістрація ', () => {

    const registration = new Registration();


    beforeEach(() =>{
        cy.viewport(1980,1080);
        registration.open();
    });

    it('Перевірка посилання та тайтлу', ()=> {
        registration.checkRegUrl();
        registration.verifyTitle();
    });

    it('Перевірка логіну і кнопки реєстрації',() =>{
        registration.checkLogin();
        
    });

    it('Перевірка нового облікового запису',() =>{
        registration.checkRegister();
        registration.checkFullname(testData.userFullName);
        registration.checkEmail(testData.userEmail);
        registration.checkPassword(testData.userPassword);
        registration.checkPassword2(testData.userPassword);
        registration.checkCurrency();
        registration.checkRegister2();
        registration.checkTransactionButton();
        registration.checkExpensesButton();
        registration.checkSumInput();
        registration.checkCategory();
        registration.checkDescription();
        registration.checkDate();
        registration.checkAccount();
        registration.checkTag();
        registration.checkEndButtons()
    });
    
});


