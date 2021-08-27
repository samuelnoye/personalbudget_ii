const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
const app = require('../server');

describe('/api', () => {

    describe('GET /api/enveloppes', () => {    
        it('returns an array', () => {
          return request(app)
          .get('/api/enveloppes')
          .expect(200)
          .then((response) => {
            expect(response.body).to.be.an.instanceOf(Array);
                });
        });
        it('returns an array of all enveloppes', () => {
          return request(app)
            .get('/api/enveloppes')
            .expect(200)
            .then((response) => {
              response.body.forEach((enveloppe) => {
                expect(enveloppe).to.have.ownProperty('id');
                expect(enveloppe).to.have.ownProperty('title');
                expect(enveloppe).to.have.ownProperty('budget');
              });
            });
        });
    });



    describe('POST /api/enveloppes', () => {
      it('should add an enveloppe if all supplied information is correct', () => {
        let initialEnveloppeArray;
        let newEnveloppe = {
          title: 'Test',
          budget: 520
        }
        return request(app)
          .get('/api/enveloppes')
          .then((response) => {
            initialEnveloppeArray = response.body;
          })
          .then(() => {
            return request(app)
              .post('/api/enveloppes')
              .send(newEnveloppe)
              .expect(201);
          })
          .then((response) => response.body)
          .then((createdEnveloppe) => {
            newEnveloppe.id = createdEnveloppe.id;
            expect(newEnveloppe).to.be.deep.equal(createdEnveloppe);
          });
      });
    });



    describe('GET /api/enveloppes/:enveloppeId', () => {
      it('returns a specific enveloppe', () => {
        return request(app)
        .get('/api/enveloppes/1')
        .expect(200)
        .then((response) => {
          const envelope = response.body;
          expect(envelope).to.be.an.instanceOf(Object);
          expect(envelope).to.not.be.an.instanceOf(Array);
        });
      });
      it('returns a full enveloppe object', () => {
        return request(app)
        .get(`/api/enveloppes/1`)
        .expect(200)
        .then((response) => {
          let enveloppe = response.body;
          expect(enveloppe).to.have.ownProperty('id');
          expect(enveloppe).to.have.ownProperty('title');
          expect(enveloppe).to.have.ownProperty('budget');
        });
      });
      it('returns the correct enveloppe', () => {
        return request(app)
            .get('/api/enveloppes/1')
            .expect(200)
            .then((response) => {
                let enveloppe = response.body;
                expect(enveloppe.id).to.be.an.equal(1);
            });
        });    
      it('returns an error if the enveloppe doesn\'t exist', () => {
        return request(app)
        .get('/api/enveloppes/52845')
        .expect(404)
      });
    })  

    describe('POST /api/enveloppes/:enveloppeId', () => {
      it('adds 500 to the budget of the enveloppe n1 to make a total budget of 900', () => {
        let initialEnveloppe;
        let updatedEnveloppeBudget;
        return request(app)
          .get('/api/enveloppes/1')
          .then((response) => {
            initialEnveloppe = response.body
          })
          .then(() => {
            updatedEnveloppeBudget = Object.assign({}, initialEnveloppe, {budget: 500});
            return request(app)
              .post('/api/enveloppes/1')
              .send(updatedEnveloppeBudget);
          })
          .then((response) => {
            expect(response.body.budget).to.be.deep.equal(900);
          });
      });
      it('removes 200 to the budget of the enveloppe n1 to make a total budget of 700', () => {
        let initialEnveloppe;
        let updatedEnveloppeBudget;
        return request(app)
          .get('/api/enveloppes/1')
          .then((response) => {
            initialEnveloppe = response.body
          })
          .then(() => {
            updatedEnveloppeBudget = Object.assign({}, initialEnveloppe, {budget: -200});
            return request(app)
              .post('/api/enveloppes/1')
              .send(updatedEnveloppeBudget);
          })
          .then((response) => {
            expect(response.body.budget).to.be.deep.equal(700);
          });
      });
    });


    describe('DELETE /api/enveloppes/:enveloppeId', () => {
      it('deletes the correct enveloppe', async () => {
        let initialEnveloppeArray;
        return request(app)
          .get('/api/enveloppes')
          .then((response) => {
            let initialEnveloppeArray = response.body;
          })
          .then(() => {
            return request(app)
              .delete('/api/enveloppes/1')
              .expect(204);
          })
          .then(() => {
            return request(app)
              .get('/api/enveloppes');
          })
          .then((response) => response.body)
          .then((afterDeleteEnveloppesArray) => {
            expect(afterDeleteEnveloppesArray).to.not.be.deep.equal(initialEnveloppeArray);
            let shouldBeDeletedEnveloppe = afterDeleteEnveloppesArray.find(el => el.id === '1');
            expect(shouldBeDeletedEnveloppe).to.be.undefined;
          });
      });
      it('throws a error if the id doesn\'t exist', async () => {
        await request(app)
          .delete('/api/envelopes/458')
          .send()
          .expect(404);
      });
    });


    describe('POST api/enveloppes/transfer/:from/:to', () => {
      it('transfers the good amount from the good enveloppe to the good one', async () => {
        const fromEnveloppe = await request(app)
          .get('/api/enveloppes/1')
          .expect(200)
          .then((response) => {
            return response.body;
          });
        const toEnveloppe = await request(app)
          .get('/api/enveloppes/2')
          .expect(200)
          .then((response) => {
            return response.body;
          });  

        await request(app)
          .post('/api/enveloppes/transfer/1/2')
          .send({amount: 100})
          .expect(200);
        
        const newFromEnveloppe = await request(app)
          .get('/api/enveloppes/1')
          .expect(200)
          .then((response) => {
            return response.body;
            });

        const newtoEnveloppe = await request(app)
        .get('/api/enveloppes/2')
        .expect(200)
        .then((response) => {
          return response.body;
            });
        expect(fromEnveloppe.budget-100).to.be.equal(600);
        expect(toEnveloppe.budget+100).to.be.equal(220);
      });
    });

});

