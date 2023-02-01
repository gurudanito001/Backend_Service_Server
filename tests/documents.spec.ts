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
        expect(res.body.payload).to.be.an("array");
      })
  })

  it('Create a Document', async () => {
    let data = {
      "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
      "collection_id": "bb38485a-4003-411a-9d2a-29d2ba0616fb",
      "collection_name": "test collection",
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
        document_id = res.body.payload.document_id
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.cluster_id).to.equal(data.cluster_id);
        expect(res.body.payload.data.key1).to.equal(data.data.key1);
      })
  })
  it('Get a Document', async () => {
    return chai.request(app)
    .get(`/documents/${document_id}`)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.document_id).to.equal(document_id);
      })
  })
  it('Update a Document', async () => {
    let data = {
      "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
      "collection_id": "bb38485a-4003-411a-9d2a-29d2ba0616fb",
      "collection_name": "test collection",
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
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.document_id).to.equal(document_id);
        expect(res.body.payload.data.key1).to.equal(data.data.key1);
      })
  })
  it('Delete a Document', async () => {
    return chai.request(app)
    .delete(`/documents/${document_id}`)
      .then(res => {
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.contain(document_id);
      })
  })
})