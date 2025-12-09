describe('WordPress REST API Posts Endpoint with Basic Auth', () => {
  const BASE_URL = 'https://dev.emeli.in.ua/wp-json/wp/v2'
  const POSTS_ENDPOINT = `${BASE_URL}/posts`
  
  const AUTH_CONFIG = {
    username: 'admin',
    password: 'Engineer_123'
  }
  
  const skipIfNoAuth = () => {
    if (!AUTH_CONFIG.username || !AUTH_CONFIG.password || 
        AUTH_CONFIG.username === 'username' || AUTH_CONFIG.password === 'password') {
      cy.log('Warning: No Basic Auth credentials provided!')
      cy.log('Please set real username and password in test file')
      return false
    }
    return true
  }
  
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
      failOnStatusCode: false,
      ...options
    })
  }
  
  context('CRUD operations with authentication', () => {
    let createdPostId
    let createdPostSlug
    const uniqueId = Date.now()
    
    after(() => {
      if (createdPostId) {
        authRequest('DELETE', `${POSTS_ENDPOINT}/${createdPostId}`, {
          qs: { force: true }
        }).then((response) => {
          cy.log(`Post ${createdPostId} deleted: ${response.status}`)
        })
      }
    })
    
    it('should create a new draft post', () => {
      if (!skipIfNoAuth()) return
      
      const newPost = {
        title: `Cypress Test Post ${uniqueId}`,
        content: `<p>Test post created via Cypress with Basic Auth</p>
                 <p>Creation date: ${new Date().toISOString()}</p>`,
        excerpt: 'Test post excerpt for API testing',
        status: 'draft',
        comment_status: 'closed',
        ping_status: 'closed',
        meta: {
          test_field: 'cypress_test_value'
        }
      }
      
      authRequest('POST', POSTS_ENDPOINT, {
        body: newPost
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201])
        
        createdPostId = response.body.id
        createdPostSlug = response.body.slug
        
        expect(response.body).to.have.property('id').and.to.be.a('number')
        expect(response.body.title.rendered).to.include(`Cypress Test Post ${uniqueId}`)
        expect(response.body.status).to.eq('draft')
        expect(response.body.type).to.eq('post')
        expect(response.body.content.protected).to.be.false
        
        cy.log(`Created new post with ID: ${createdPostId}, Slug: ${createdPostSlug}`)
      })
    })
    
    it('should retrieve the created post by ID', () => {
      if (!skipIfNoAuth() || !createdPostId) return
      
      authRequest('GET', `${POSTS_ENDPOINT}/${createdPostId}`)
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.id).to.eq(createdPostId)
          expect(response.body.slug).to.eq(createdPostSlug)
          expect(response.body.status).to.eq('draft')
        })
    })
    
    it('should update the post', () => {
      if (!skipIfNoAuth() || !createdPostId) return
      
      const updateData = {
        title: `Updated Cypress Post ${uniqueId}`,
        content: `<p>This post was updated via Cypress API</p>
                 <p>Update date: ${new Date().toISOString()}</p>`,
        excerpt: 'Updated excerpt',
        status: 'publish',
        tags: [115],
        categories: [1]
      }
      
      authRequest('PUT', `${POSTS_ENDPOINT}/${createdPostId}`, {
        body: updateData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.title.rendered).to.include(`Updated Cypress Post ${uniqueId}`)
        expect(response.body.status).to.eq('publish')
        expect(response.body.categories).to.include(1)
        expect(response.body.tags).to.have.length.of.at.least(1)
        
        cy.log(`Post ${createdPostId} successfully updated`)
      })
    })
    
    it('should update specific fields with PATCH', () => {
      if (!skipIfNoAuth() || !createdPostId) return
      
      authRequest('PATCH', `${POSTS_ENDPOINT}/${createdPostId}`, {
        body: {
          excerpt: 'Excerpt updated via PATCH'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.excerpt.rendered).to.include('Excerpt updated via PATCH')
      })
    })
    
    it('should delete the post (move to trash)', () => {
      if (!skipIfNoAuth() || !createdPostId) return
      
      authRequest('DELETE', `${POSTS_ENDPOINT}/${createdPostId}`)
        .then((response) => {
          expect(response.status).to.eq(200)
          // *** doesn`t return property 'deleted' ***
          // expect(response.body).to.have.property('deleted')
          
          // if (response.body.deleted) {
          //   cy.log(`Post ${createdPostId} deleted`)
          // } else {
          //   cy.log(`Post ${createdPostId} moved to trash`)
          // }
        })
    })
    
    it('should permanently delete post with force=true', () => {
      if (!skipIfNoAuth()) return
      
      const tempPost = {
        title: `Temporary post for deletion ${uniqueId}`,
        content: 'This post will be permanently deleted',
        status: 'draft'
      }
      
      authRequest('POST', POSTS_ENDPOINT, {
        body: tempPost
      }).then((createResponse) => {
        const tempPostId = createResponse.body.id
        
        authRequest('DELETE', `${POSTS_ENDPOINT}/${tempPostId}`, {
          qs: { force: true }
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200)
          expect(deleteResponse.body.deleted).to.be.true
          // expect(deleteResponse.body.previous).to.have.property('id')
          expect(deleteResponse.body.previous.id).to.eq(tempPostId)
          
          cy.log(`Post ${tempPostId} permanently deleted`)
        })
      })
    })
    
    it('should restore post from trash', () => {
      if (!skipIfNoAuth()) return
      
      const restorePost = {
        title: `Post for restoration ${uniqueId}`,
        content: 'Test restoration from trash',
        status: 'draft'
      }
      
      authRequest('POST', POSTS_ENDPOINT, {
        body: restorePost
      }).then((createResponse) => {
        const postId = createResponse.body.id
        
        authRequest('DELETE', `${POSTS_ENDPOINT}/${postId}`)
          .then(() => {
            authRequest('PUT', `${POSTS_ENDPOINT}/${postId}`, {
              body: { status: 'draft' }
            }).then((restoreResponse) => {
              expect(restoreResponse.status).to.eq(200)
              expect(restoreResponse.body.status).to.eq('draft')
              
              authRequest('DELETE', `${POSTS_ENDPOINT}/${postId}`, {
                qs: { force: true }
              })
            })
          })
      })
    })
  })
  
  // describe('Batch operations', () => {
  //   it('should create multiple posts in batch', () => {
  //     if (!skipIfNoAuth()) return
      
  //     const batchPosts = [
  //       {
  //         title: 'Batch Post 1',
  //         content: 'First batch post',
  //         status: 'draft'
  //       },
  //       {
  //         title: 'Batch Post 2',
  //         content: 'Second batch post',
  //         status: 'draft'
  //       }
  //     ]
      
  //     authRequest('POST', POSTS_ENDPOINT + '/batch', {
  //       body: {
  //         create: batchPosts
  //       }
  //     }).then((response) => {
  //       expect(response.status).to.eq(200)
  //       expect(response.body.create).to.be.an('array')
  //       expect(response.body.create).to.have.length(2)
        
  //       response.body.create.forEach(post => {
  //         if (post.id) {
  //           authRequest('DELETE', `${POSTS_ENDPOINT}/${post.id}`, {
  //             qs: { force: true }
  //           })
  //         }
  //       })
  //     })
  //   })
    
  //   it('should update multiple posts in batch', () => {
  //     if (!skipIfNoAuth()) return
      
  //     const post1 = {
  //       title: 'Batch Update Test 1',
  //       content: 'Post for batch update 1',
  //       status: 'draft'
  //     }
      
  //     const post2 = {
  //       title: 'Batch Update Test 2',
  //       content: 'Post for batch update 2',
  //       status: 'draft'
  //     }
      
  //     authRequest('POST', POSTS_ENDPOINT + '/batch', {
  //       body: {
  //         create: [post1, post2]
  //       }
  //     }).then((createResponse) => {
  //       const posts = createResponse.body.create
        
  //       const updates = posts.map((post, index) => ({
  //         id: post.id,
  //         title: `Updated Batch Post ${index + 1}`
  //       }))
        
  //       authRequest('POST', POSTS_ENDPOINT + '/batch', {
  //         body: {
  //           update: updates
  //         }
  //       }).then((updateResponse) => {
  //         expect(updateResponse.status).to.eq(200)
  //         expect(updateResponse.body.update).to.have.length(2)
          
  //         posts.forEach(post => {
  //           if (post.id) {
  //             authRequest('DELETE', `${POSTS_ENDPOINT}/${post.id}`, {
  //               qs: { force: true }
  //             })
  //           }
  //         })
  //       })
  //     })
  //   })
  // })
  
  // describe('Authentication error handling', () => {
  //   it('should return 401 with invalid credentials', () => {
  //     cy.request({
  //       method: 'GET',
  //       url: `${POSTS_ENDPOINT}?status=draft`,
  //       auth: {
  //         username: 'wrong',
  //         password: 'credentials'
  //       },
  //       failOnStatusCode: false
  //     }).then((response) => {
  //       expect(response.status).to.be.oneOf([401, 403])
        
  //       if (response.body && response.body.code) {
  //         expect(response.body.code).to.be.oneOf([
  //           'rest_cannot_read',
  //           'rest_forbidden',
  //           'rest_not_logged_in'
  //         ])
  //       }
        
  //       cy.log(`Authentication error (expected): ${response.status}`)
  //     })
  //   })
    
  //   it('should return 403 for draft posts without auth', () => {
  //     cy.request({
  //       method: 'GET',
  //       url: `${POSTS_ENDPOINT}?status=draft`,
  //       failOnStatusCode: false
  //     }).then((response) => {
  //       expect(response.status).to.be.oneOf([401, 403, 200])
        
  //       if (response.status === 200) {
  //         expect(response.body).to.be.an('array')
  //       }
  //     })
  //   })
    
  //   it('should return 401 for POST without auth', () => {
  //     cy.request({
  //       method: 'POST',
  //       url: POSTS_ENDPOINT,
  //       body: {
  //         title: 'Test Unauthorized',
  //         content: 'This request should fail'
  //       },
  //       failOnStatusCode: false
  //     }).then((response) => {
  //       expect(response.status).to.be.oneOf([401, 403])
  //     })
  //   })
  // })
  
  // describe('Filtering draft posts with auth', () => {
  //   it('should retrieve draft posts with authentication', () => {
  //     if (!skipIfNoAuth()) return
      
  //     authRequest('GET', POSTS_ENDPOINT, {
  //       qs: {
  //         status: 'draft',
  //         per_page: 5,
  //         orderby: 'date',
  //         order: 'desc'
  //       }
  //     }).then((response) => {
  //       expect(response.status).to.eq(200)
  //       expect(response.body).to.be.an('array')
        
  //       response.body.forEach(post => {
  //         expect(post.status).to.eq('draft')
  //       })
        
  //       if (response.body.length > 0) {
  //         cy.log(`Found ${response.body.length} draft posts`)
  //       }
  //     })
  //   })
    
  //   it('should retrieve private posts with authentication', () => {
  //     if (!skipIfNoAuth()) return
      
  //     authRequest('GET', POSTS_ENDPOINT, {
  //       qs: {
  //         status: 'private',
  //         per_page: 3
  //       }
  //     }).then((response) => {
  //       expect(response.status).to.eq(200)
  //       expect(response.body).to.be.an('array')
        
  //       response.body.forEach(post => {
  //         expect(post.status).to.eq('private')
  //       })
  //     })
  //   })
  // })
  
  // describe('Media and featured image', () => {
  //   it('should create post with featured media', () => {
  //     if (!skipIfNoAuth()) return
      
  //     const postWithoutMedia = {
  //       title: `Post for media test ${Date.now()}`,
  //       content: 'Test post',
  //       status: 'draft'
  //     }
      
  //     authRequest('POST', POSTS_ENDPOINT, {
  //       body: postWithoutMedia
  //     }).then((response) => {
  //       const postId = response.body.id
        
  //       authRequest('GET', `${BASE_URL}/media?per_page=1`)
  //         .then((mediaResponse) => {
  //           if (mediaResponse.body.length > 0) {
  //             const mediaId = mediaResponse.body[0].id
              
  //             authRequest('PUT', `${POSTS_ENDPOINT}/${postId}`, {
  //               body: {
  //                 featured_media: mediaId
  //               }
  //             }).then((updateResponse) => {
  //               expect(updateResponse.status).to.eq(200)
  //               expect(updateResponse.body.featured_media).to.eq(mediaId)
                
  //               authRequest('DELETE', `${POSTS_ENDPOINT}/${postId}`, {
  //                 qs: { force: true }
  //               })
  //             })
  //           } else {
  //             authRequest('DELETE', `${POSTS_ENDPOINT}/${postId}`, {
  //               qs: { force: true }
  //             })
  //           }
  //         })
  //     })
  //   })
  // })
  
  // describe('Custom fields and meta', () => {
  //   it('should create post with custom meta fields', () => {
  //     if (!skipIfNoAuth()) return
      
  //     const postWithMeta = {
  //       title: `Post with meta fields ${Date.now()}`,
  //       content: 'Test custom meta fields',
  //       status: 'draft',
  //       meta: {
  //         test_key: 'test_value',
  //         custom_field: '12345',
  //         is_test: true
  //       }
  //     }
      
  //     authRequest('POST', POSTS_ENDPOINT, {
  //       body: postWithMeta
  //     }).then((response) => {
  //       expect(response.status).to.be.oneOf([200, 201])
        
  //       const postId = response.body.id
        
  //       authRequest('GET', `${POSTS_ENDPOINT}/${postId}`)
  //         .then((getResponse) => {
  //           expect(getResponse.body.meta).to.be.an('object')
            
  //           authRequest('DELETE', `${POSTS_ENDPOINT}/${postId}`, {
  //             qs: { force: true }
  //           })
  //         })
  //     })
  //   })
  // })
  
  // describe('Post revisions', () => {
  //   it('should retrieve post revisions with auth', () => {
  //     if (!skipIfNoAuth()) return
      
  //     const originalPost = {
  //       title: 'Post for revisions',
  //       content: 'Initial content',
  //       status: 'draft'
  //     }
      
  //     authRequest('POST', POSTS_ENDPOINT, {
  //       body: originalPost
  //     }).then((createResponse) => {
  //       const postId = createResponse.body.id
        
  //       authRequest('PUT', `${POSTS_ENDPOINT}/${postId}`, {
  //         body: { content: 'First update' }
  //       }).then(() => {
  //         authRequest('PUT', `${POSTS_ENDPOINT}/${postId}`, {
  //           body: { content: 'Second update' }
  //         }).then(() => {
  //           authRequest('GET', `${POSTS_ENDPOINT}/${postId}/revisions`)
  //             .then((revisionsResponse) => {
  //               expect(revisionsResponse.status).to.eq(200)
  //               expect(revisionsResponse.body).to.be.an('array')
                
  //               cy.log(`Found ${revisionsResponse.body.length} revisions`)
                
  //               authRequest('DELETE', `${POSTS_ENDPOINT}/${postId}`, {
  //                 qs: { force: true }
  //               })
  //             })
  //         })
  //       })
  //     })
  //   })
  // })
})

