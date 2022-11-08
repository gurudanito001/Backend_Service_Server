import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
let document_id: string;

describe('Documents', () => {
  it('Fetch all Documents', async () => {
    return chai.request(app).get('/documents')
      .then(res => {
        expect(res.body).to.be.an("array");
      })
  })

  it('Create a Document', async () => {
    let data = {
      "cluster_id": "325c87ca-c74a-4af7-a71f-4af6a634d421",
      "collection_id": "13ecd026-a7f6-4532-839b-52dfcd3c7f31",
      "collection_name": "collection1",
      "data": {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4"
      }
    }
    return chai.request(app)
    .post('/documents/create')
    .send(data)
      .then(res => {
        document_id = res.body.document_id
        expect(res.body).to.be.an("object");
        expect(res.body.cluster_id).to.equal(data.cluster_id);
        expect(res.body.data.key1).to.equal(data.data.key1);
      })
  })
  it('Get a Document', async () => {
    return chai.request(app)
    .get(`/documents/${document_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.document_id).to.equal(document_id);
      })
  })
  it('Update a Document', async () => {
    let data = {
      "cluster_id": "325c87ca-c74a-4af7-a71f-4af6a634d421",
      "collection_id": "13ecd026-a7f6-4532-839b-52dfcd3c7f31",
      "collection_name": "collection1",
      "data": {
        "key1": "updatedvalue1",
        "key2": "updatedvalue2",
        "key3": "updatedvalue3",
        "key4": "updatedvalue4"
      }
      
    }
    return chai.request(app)
    .put(`/documents/${document_id}`)
    .send(data)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.document_id).to.equal(document_id);
        expect(res.body.data.key1).to.equal(data.data.key1);
      })
  })
  it('Delete a Document', async () => {
    return chai.request(app)
    .delete(`/documents/${document_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.contain(document_id);
      })
  })
})