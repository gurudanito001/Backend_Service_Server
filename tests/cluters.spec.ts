import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Fetching Database Clusters', () => {
  it('should return an array', async () => {
    return chai.request(app).get('/clusters')
      .then(res => {
        expect(res.body).to.be.an("array");
      })
  })
})

describe('Posting a Database Clusters', () => {
  it('should throw error when email already exists', async (done) => {
    return chai.request(app)
    .post('/clusters/create')
    .send({
      "name": "Daniel Nwokocha",
      "email": "email@gmail.com",
      "password": "Programmer95",
      "description": "Just another Cluster",
      "multi_tenant": false
    })
    .catch((err) => {
      err.response.should.have.status(404);
      done()
    });
    
  })
})