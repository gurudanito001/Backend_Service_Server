import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
let collection_id: string;

describe('Collections', () => {
  it('Fetch all Collections', async () => {
    return chai.request(app).get('/collections')
      .then(res => {
        expect(res.body.payload).to.be.an("array");
      })
  })

  it('Create a Collection', async () => {
    let data = {
      "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
      "name": "Test Collection",
    }
    return chai.request(app)
    .post('/collections/create')
    .send(data)
      .then(res => {
        collection_id = res.body.payload.collection_id
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.cluster_id).to.equal(data.cluster_id);
      })
  })
  it('Get a Collection', async () => {
    return chai.request(app)
    .get(`/collections/${collection_id}`)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.collection_id).to.equal(collection_id);
      })
  })
  it('Update a Collection', async () => {
    let data = {
      "name": "Updated Random Name",
    }
    return chai.request(app)
    .put(`/collections/${collection_id}`)
    .send(data)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.name).to.equal(data.name.toLowerCase());
      })
  })
  it('Delete a Collection', async () => {
    return chai.request(app)
    .delete(`/collections/${collection_id}`)
      .then(res => {
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.contain(collection_id.toLowerCase());
      })
  })
})