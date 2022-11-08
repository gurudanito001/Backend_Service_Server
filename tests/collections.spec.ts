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
        expect(res.body).to.be.an("array");
      })
  })

  it('Create a Collection', async () => {
    let data = {
      "cluster_id": "325c87ca-c74a-4af7-a71f-4af6a634d421",
      "name": "Random Name",
    }
    return chai.request(app)
    .post('/collections/create')
    .send(data)
      .then(res => {
        collection_id = res.body.collection_id
        expect(res.body).to.be.an("object");
        expect(res.body.cluster_id).to.equal(data.cluster_id);
      })
  })
  it('Get a Collection', async () => {
    return chai.request(app)
    .get(`/collections/${collection_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.collection_id).to.equal(collection_id);
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
        expect(res.body).to.be.an("object");
        expect(res.body.name).to.equal(data.name.toLowerCase());
      })
  })
  it('Delete a Collection', async () => {
    return chai.request(app)
    .delete(`/collections/${collection_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.contain(collection_id.toLowerCase());
      })
  })
})