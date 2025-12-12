describe('WordPress REST API Posts Endpoint with Basic Auth', () => {
  const BASE_URL = 'https://dev.emeli.in.ua/wp-json/wp/v2';
  const POSTS_ENDPOINT = `${BASE_URL}/posts`;
 
  const AUTH_CONFIG = {
    username: 'admin',
    password: 'Engineer_123'
  };
 
  const skipIfNoAuth = () => {
    if (!AUTH_CONFIG.username || !AUTH_CONFIG.password) {
      cy.log('No Basic Auth credentials!');
      return false;
    }
    return true;
  };
 
  const authRequest = (method, url, options = {}) => {
    return cy.request({
      method,
      url,
      auth: AUTH_CONFIG,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body,
      qs: options.qs,
      failOnStatusCode: false
    });
  };
 
  context('CRUD operations with authentication', () => {
    let createdPostId;
    let createdPostSlug;
    const uniqueId = Date.now();
 
    after(() => {
      if (createdPostId) {
        authRequest('DELETE', `${POSTS_ENDPOINT}/${createdPostId}`, {
          qs: { force: true }
        });
      }
    });
 
    it('should create a new draft post', () => {
      if (!skipIfNoAuth()) return;
 
      const newPost = {
        title: `Cypress Test Post ${uniqueId}`,
        content: `Created at: ${new Date().toISOString()}`,
        excerpt: 'Test excerpt',
        status: 'draft'
      };
 
      authRequest('POST', POSTS_ENDPOINT, { body: newPost }).then((response) => {
        // ✔️ Надійна перевірка статусу
        expect([200, 201]).to.include(response.status);
 
        createdPostId = response.body.id;
        createdPostSlug = response.body.slug;
 
        // ✔️ Перевірка обов'язкових ключів
        const requiredKeys = [
          'id', 'date', 'slug', 'status',
          'title', 'content', 'excerpt', 
          'type', 'author', 'link'
        ];
        requiredKeys.forEach(key => {
          expect(response.body).to.have.property(key);
        });
 
        // ✔️ Перевірка значень
        expect(response.body.title.rendered).to.include(`Cypress Test Post`);
        expect(response.body.status).to.equal('draft');
      });
    });
 
    it('should retrieve the created post by ID', () => {
      if (!skipIfNoAuth() || !createdPostId) return;
 
      authRequest('GET', `${POSTS_ENDPOINT}/${createdPostId}`)
      .then((response) => {
        expect(response.status).to.equal(200);
        
       // ✔️ Перевірка обов'язкових ключів
        const requiredKeys = [
          'id', 'date', 'date_gmt', 'slug', 'status',
          'title', 'content', 'excerpt', 
          'type', 'author', 'link', 'modified'
        ];
        requiredKeys.forEach(key => {
          expect(response.body).to.have.property(key);
        });
        expect(response.body.id).to.equal(createdPostId);
      });
    });
 
    it('should update the post (PUT)', () => {
      if (!skipIfNoAuth() || !createdPostId) return;
 
      const updateData = {
        title: `Updated Cypress Post ${uniqueId}`,
        content: `Updated at: ${new Date().toISOString()}`,
        excerpt: 'Updated excerpt',
        status: 'publish',
        tags: [115],
        categories: [1]
      };
 
      authRequest('PUT', `${POSTS_ENDPOINT}/${createdPostId}`, { body: updateData })
        .then((response) => {
          expect(response.status).to.equal(200);
       // ✔️ Перевірка обов'язкових ключів
        const requiredKeys = [
          'id', 'date', 'date_gmt', 'slug', 'status',
          'title', 'content', 'excerpt', 
          'type', 'author', 'link', 'modified'
        ];
        requiredKeys.forEach(key => {
          expect(response.body).to.have.property(key);
        });
          expect(response.body.title.rendered)
            .to.include(`Updated Cypress Post`);
          expect(response.body.status).to.equal('publish');
        });
    });
 
    it('should partially update post (PATCH)', () => {
      if (!skipIfNoAuth() || !createdPostId) return;
 
      const patchData = {
        excerpt: 'PATCH updated excerpt',
        comment_status: 'open'
      };
 
      authRequest('PATCH', `${POSTS_ENDPOINT}/${createdPostId}`, { body: patchData })
        .then((response) => {
          expect(response.status).to.equal(200);

                 // ✔️ Перевірка обов'язкових ключів
        const requiredKeys = [
          'id', 'date', 'date_gmt', 'slug', 'status',
          'title', 'content', 'excerpt', 
          'type', 'author', 'link', 'modified'
        ];
        requiredKeys.forEach(key => {
          expect(response.body).to.have.property(key);
        });
          expect(response.body.excerpt.rendered).to.include('PATCH updated excerpt');
          expect(response.body.comment_status).to.equal('open');
        });
    });
 
    it('should delete the post (move to trash)', () => {
      if (!skipIfNoAuth() || !createdPostId) return;
 
      authRequest('DELETE', `${POSTS_ENDPOINT}/${createdPostId}`)
      .then((response) => {
        expect(response.status).to.equal(200);
                         // ✔️ Перевірка обов'язкових ключів
        const requiredKeys = [
          'id', 'date', 'date_gmt', 'slug', 'status',
          'title', 'content', 'excerpt', 
          'type', 'author', 'link', 'modified'
        ];
        requiredKeys.forEach(key => {
          expect(response.body).to.have.property(key);
        });
        expect(response.body.slug).to.include('trashed')

        // expect(response.body.deleted).to.be.true;
      });
    });
 
    it('should permanently delete a post using force=true', () => {
      if (!skipIfNoAuth()) return;
 
      const tempPost = {
        title: `Temp delete ${uniqueId}`,
        content: 'Will be deleted permanently',
        status: 'draft'
      };
 
      authRequest('POST', POSTS_ENDPOINT, { body: tempPost }).then((createRes) => {
        const tempId = createRes.body.id;
 
        authRequest('DELETE', `${POSTS_ENDPOINT}/${tempId}`, {
          qs: { force: true }
        }).then((deleteRes) => {
          expect(deleteRes.status).to.equal(200);
          expect(deleteRes.body.deleted).to.be.true;
        });
      });
    });
 
    it('should create and retrieve scheduled post', () => {
      if (!skipIfNoAuth()) return;
 
      const futureDate = new Date(~~(Date.now()/1000)*1000 + 86400000).toISOString();
      //cy.log(futureDate)
 
      const futurePost = {
        title: 'Scheduled post',
        content: 'This is scheduled',
        status: 'future',
        date: futureDate
      };
 
      authRequest('POST', POSTS_ENDPOINT, { body: futurePost })
      .then((response) => {
        const postId = response.body.id;
        //cy.log(postId)
        expect([200, 201]).to.include(response.status);
        
        authRequest('GET', `${POSTS_ENDPOINT}/${postId}`)
        .then((getResponse) => {
          expect(getResponse.status).to.equal(200);
                  const requiredKeys = [
          'id', 'date', 'date_gmt', 'slug', 'status',
          'title', 'content', 'excerpt', 
          'type', 'author', 'link', 'modified'
          ];
          requiredKeys.forEach(key => {
            expect(response.body).to.have.property(key);
          });
          expect(getResponse.body.status).to.equal('future');
          expect(new Date(getResponse.body.date).toISOString()).to.equal(futureDate);
 
          // cleanup
          authRequest('DELETE', `${POSTS_ENDPOINT}/${postId}`, {
            qs: { force: true }
          });
        });
      });
    });
  });
});

 