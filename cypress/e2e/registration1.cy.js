import { Registration } from '../pages/registration';
import { faker } from '@faker-js/faker';

describe('Finmore - перевірка головноъ сторінки та регстрація ', () => {

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

        const userFullName = 'Олег Ляшко';
        // const userEmail = 'olega359@ukr.net'
        const userEmail = faker.internet.email();
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
