import { HomePage } from '../pages/HomePage';
import { Search } from '../pages/Search';
import { Header } from '../pages/Header';

describe('The connected shop - перевірка головної сторінки', ()=>{

    const home = new HomePage()
    const search = new Search()
    const header = new Header()

    beforeEach(() =>{
        home.open();
    });

    it('Перевірка відкриття сайту', () => {
        home.checkUrl();
        home.verifyTitle();
    })

    it('Перевірка Шапки сайту', () =>{
        header.verifyLogo();
        header.verifyCart();
        header.verifyAccount();
        header.verifyPhone();
    })

    it('Перевірка пошуку',() =>{
        search.verifySearchField();
    })

})