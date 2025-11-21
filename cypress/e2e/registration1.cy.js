import { Registration } from '../pages/registration';
import { faker } from '@faker-js/faker';
import {generateUniqueEmail} from '../support/Utils';
import {generateUkrainianFullName} from '../support/Utils'

 
//     function generateUniqueEmail() {
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 8);
//     return `yuliatester+${timestamp}${randomString}@gmail.com`;
// }

describe('Finmore - перевірка головної сторінки та регістрація ', () => {

    const registration = new Registration()

    beforeEach(() =>{
        registration.open();
    })

    it('Перевірка посилання та тайтлу', ()=> {
        registration.checkUrl();
        registration.verifyTitle();
    })

    it('Перевірка логіну',() =>{
        registration.checkLogin()
    })

    it('Перевірка кнопки регістрації та реєстрації', () =>{

        // const userFullName = 'Олег Ляшко';
        const userFullName = generateUkrainianFullName();
        // const userEmail = 'olega359@ukr.net'
        // const userEmail = faker.internet.email();
        const userEmail = generateUniqueEmail();
        const userPassword = 'tututu359!'
        

        registration.checkRegister();
        registration.checkFullname(userFullName);
        registration.checkEmail(userEmail);
        registration.checkPassword(userPassword);
        registration.checkPassword2(userPassword);
        registration.checkCurrency();
        registration.checkRegister2();
    })


    
})


