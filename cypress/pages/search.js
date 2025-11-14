export class Search {

  searchForm = 'form.search--header';
  searchInput = 'input#Search-In-Inline';
  searchHeaderLink = 'a.predictive-search__header';
  productCount = 'span#ProductCount';
  noResultMessage = 'p.alert--warning';
  exactProduct = 'a#CardLink-template--19508649459953__main-7022126858412';
  exactProductName = 'span.card__heading__product-title'
 
 
  verifySearchField() {
    cy.get(this.searchForm).should('exist').and('be.visible');
    cy.get(this.searchInput).should('have.attr', 'placeholder', 'Search');
  }
 
  searchProduct(searchText) {
    cy.get(this.searchInput)
      .type(searchText)
      .should('have.value', searchText);
    cy.get(this.searchHeaderLink).click();
  }
 
  verifySearchResult(searchText) {
    // cy.url().should('include', `/search?q=${searchText}`);
    // cy.get(this.productCount)
    //   .should('be.visible')
    //   .and('contain', 'result');
    cy.url({ timeout: 10000 }).should((url) => {
    const parsedUrl = new URL(url);
    const query = parsedUrl.searchParams.get('q');
    expect(query.replace(/\+/g, ' ')).to.eq(searchText);
  })
}

  verifyExactResult(searchText) {
    cy.get(this.exactProduct)
      .should('be.visible');
    cy.get(this.exactProductName).eq(0)
      .should('be.visible')
      .and('contain', searchText);

  }
 
  verifyNoSearchResult(searchText) {
    cy.url().should('include', `/search?q=${searchText}`);
    cy.get(this.noResultMessage)
      .should('be.visible')
      .and('contain', `No results found for “${searchText}”.`);
  }
}