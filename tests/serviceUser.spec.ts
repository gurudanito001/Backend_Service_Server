import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
let document_id: string;

describe('Backend Service User', () => {

  it('Can create a Document', async () => {
    let data = {
      "key1": "value1",
      "key2": "value2",
      "key3": "value3",
      "key4": "value4"
    }
    const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
    const collectionName = "test collection"
    return chai.request(app)
    .post(`/api/v1/${apiKey}/${collectionName}`)
    .send(data)
      .then(res => {
        document_id = res.body.payload.document_id;
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.cluster_id).to.equal(apiKey);
        expect(res.body.payload.collection_name).to.equal(collectionName);
        expect(res.body.payload.data.key1).to.equal(data.key1);
      })
  })

  it('Can read a Document', async () => {

    const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
    const collectionName = "test collection"
    return chai.request(app)
    .get(`/api/v1/${apiKey}/${collectionName}/${document_id}`)
      .then(res => {
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.cluster_id).to.equal(apiKey);
        expect(res.body.payload.collection_name).to.equal(collectionName);
        expect(res.body.payload.document_id).to.equal(document_id);
      })
  })

  it('Can update a Document', async () => {
    let data = {
      "key2": "updatedValue2",
      "key3": "updatedValue3",
      "key5": "newValue5"
    }

    const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
    const collectionName = "test collection"
    
    return chai.request(app)
    .post(`/api/v1/${apiKey}/${collectionName}/${document_id}`)
    .send(data)
      .then(res => {
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.cluster_id).to.equal(apiKey);
        expect(res.body.payload.collection_name).to.equal(collectionName);
        expect(res.body.payload.document_id).to.equal(document_id);
        expect(res.body.payload.data.key1).to.equal("value1");
        expect(res.body.payload.data.key2).to.equal(data.key2);
        expect(res.body.payload.data.key3).to.equal(data.key3);
        expect(res.body.payload.data.key4).to.equal("value4");
        expect(res.body.payload.data.key5).to.equal(data.key5);
      })
  })

  it('Can delete a Document', async () => {
    const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
    const collectionName = "test collection"

    return chai.request(app)
    .delete(`/api/v1/${apiKey}/${collectionName}/${document_id}`)
      .then(res => {
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.include(`${document_id}`);
      })
  })
})