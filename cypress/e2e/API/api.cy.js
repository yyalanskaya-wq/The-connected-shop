describe('WordPress REST API Posts Endpoint', () => {
  const BASE_URL = Cypress.env('apiBaseUrl')
  const POSTS_ENDPOINT = `${BASE_URL}/posts`
  context('GET /posts', () => {
    it('should return list of posts with status 200', () => {
      cy.request({
        method: 'GET',
        url: POSTS_ENDPOINT,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers['content-type']).to.include('application/json')
        expect(response.body).to.be.an('array')
      })
    })
 
    it('should return posts with correct structure', () => {
      cy.request('GET', POSTS_ENDPOINT)
        .then((response) => {
          const post = response.body[0]
          // Перевірка основних полів
          expect(post).to.have.property('id').and.to.be.a('number')
          expect(post).to.have.property('date').and.to.be.a('string')
          expect(post).to.have.property('title').and.to.be.an('object')
          expect(post.title).to.have.property('rendered').and.to.be.a('string')
          expect(post).to.have.property('content').and.to.be.an('object')
          expect(post.content).to.have.property('rendered').and.to.be.a('string')
          expect(post).to.have.property('excerpt').and.to.be.an('object')
          expect(post.excerpt).to.have.property('rendered').and.to.be.a('string')
          expect(post).to.have.property('status').and.to.be.a('string')
          expect(post).to.have.property('type').and.to.eq('post')
        })
    })
 
    it('should support pagination parameters', () => {
      const perPage = 5
      cy.request({
        method: 'GET',
        url: POSTS_ENDPOINT,
        qs: {
          per_page: perPage,
          page: 1
        }
      }).then((response) => {
        expect(response.body).to.have.length.of.at.most(perPage)

        expect(response.headers).to.have.property('x-wp-total')
        expect(response.headers).to.have.property('x-wp-totalpages')
      })
    })
 
    it('should filter posts by status', () => {
      cy.request({
        method: 'GET',
        url: POSTS_ENDPOINT,
        qs: {
          status: 'publish'
        }
      }).then((response) => {
        response.body.forEach(post => {
          expect(post.status).to.eq('publish')
        })
      })
    })
 
    // it('should filter posts by categories', () => {
    //   cy.request('GET', `${BASE_URL}/categories`)
    //     .then((categoriesResponse) => {
    //       if (categoriesResponse.body.length > 0) {
    //         const categoryId = categoriesResponse.body[0].id
    //         cy.request({
    //           method: 'GET',
    //           url: POSTS_ENDPOINT,
    //           qs: {
    //             categories: categoryId
    //           }
    //         }).then((postsResponse) => {
    //           postsResponse.body.forEach(post => {
    //             expect(post.categories).to.include(categoryId)
    //           })
    //         })
    //       }
    //     })
    // })
 
    it('should search posts', () => {
      cy.request({
        method: 'GET',
        url: POSTS_ENDPOINT,
        qs: {
          search: 'test'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
 
    it('should return empty array for non-existent page', () => {
      cy.request({
        method: 'GET',
        url: POSTS_ENDPOINT,
        qs: {
          page: 99999
        }
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.be.an('array').that.is.empty
      })
    })
  })
 
  context('GET /posts/{id}', () => {
    let testPostId
 
    before(() => {
      cy.request('GET', POSTS_ENDPOINT)
        .then((response) => {
          if (response.body.length > 0) {
            testPostId = response.body[0].id
          }
        })
    })
 
    it('should return specific post by ID', () => {
      if (testPostId) {
        cy.request('GET', `${POSTS_ENDPOINT}/${testPostId}`)
          .then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.eq(testPostId)
            expect(response.body.type).to.eq('post')
          })
      }
    })
 
    it('should return 404 for non-existent post', () => {
      const nonExistentId = 999999
      cy.request({
        method: 'GET',
        url: `${POSTS_ENDPOINT}/${nonExistentId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })
 
    it('should return post with embed parameter', () => {
      if (testPostId) {
        cy.request({
          method: 'GET',
          url: `${POSTS_ENDPOINT}/${testPostId}`,
          qs: {
            _embed: true
          }
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body._embedded).to.exist
        })
      }
    })
  })
 
  context('POST /posts (requires authentication)', () => {
    // Ці тести вимагають аутентифікації
    const auth = {
      username: Cypress.env('wpUsername'),
      password: Cypress.env('wpPassword')
    }
 
    beforeEach(() => {
      if (!auth.username || !auth.password) {
        cy.log('Попередження: WP_USERNAME або WP_PASSWORD не встановлені в оточенні')
      }
    })
 
    it('should create new post with authentication', () => {
      if (auth.username && auth.password) {
        const newPost = {
          title: 'Cypress Test Post',
          content: 'This is a test post created by Cypress',
          status: 'draft',
          excerpt: 'Test excerpt'
        }
 
        cy.request({
          method: 'POST',
          url: POSTS_ENDPOINT,
          auth: auth,
          body: newPost,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          expect(response.body.title.rendered).to.contain('Cypress Test Post')
          expect(response.body.status).to.eq('draft')
        })
      }
    })
  })
 
  context('Response headers and metadata', () => {
    it('should include CORS headers', () => {
      cy.request({
        method: 'GET',
        url: POSTS_ENDPOINT
      }).then((response) => {
        expect(response.headers).to.have.property('access-control-allow-origin')
        expect(response.headers['access-control-allow-origin']).to.eq('*')
      })
    })
 
    it('should include rate limiting headers', () => {
      cy.request('GET', POSTS_ENDPOINT)
        .then((response) => {
          // Деякі API включають заголовки rate limiting
          const headers = response.headers
          if (headers['x-ratelimit-limit']) {
            expect(headers['x-ratelimit-limit']).to.be.a('string')
            expect(headers['x-ratelimit-remaining']).to.be.a('string')
          }
        })
    })
  })
 
  context('Error handling', () => {
    it('should handle invalid parameters gracefully', () => {
      cy.request({
        method: 'GET',
        url: POSTS_ENDPOINT,
        qs: {
          per_page: 'invalid'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400])
      })
    })
  })
})