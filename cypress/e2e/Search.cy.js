import { HomePage } from "../pages/homepage";
import { Search } from "../pages/Search";


describe('Перевірка пошуку',()=>{

    const search = new Search()
    const home = new HomePage()

    beforeEach(() =>{
        home.open();
    })

    it('Перевірка пошуку-існуючого товару',() =>{
        const searchText = 'Laser Keyboard';
        search.searchProduct(searchText);
        search.verifySearchResult(searchText);
        search.verifyExactResult(searchText);
    })

    it('Перевірка пошуку - неіснуючий товар', () =>{
        const searchText = 'banana';
        search.searchProduct(searchText);
        search.verifyNoSearchResult(searchText);
    })
})