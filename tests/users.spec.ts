import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
let user_id: string;
let cluster_id = "72bbebaf-4d9f-4286-8dba-3ecce1133561";

describe('Users', () => {
  it('Fetch all Users', async () => {
    return chai.request(app).get('/users')
      .then(res => {
        expect(res.body.payload).to.be.an("array");
      })
  })
  
  it('Deletes User Structure', async () => {
    return chai.request(app)
    .delete(`/userStructures/${cluster_id}`)
      .then(res => {
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.contain(cluster_id);
      })
  })

  it('Create a user', async () => {
    let data = {
      "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
      "data": {
        "email": "value1@gmail.com",
        "password": "passwordvalue2",
        "key3": "value3",
        "key4": "value4",
        "test_string": "leemawoooo" //adding this to skip sending email.
      }
    }
    return chai.request(app)
    .post('/users/create')
    .send(data)
      .then(res => {
        user_id = res.body.payload.user.user_id
        cluster_id = res.body.payload.user.cluster_id
        expect(res.body.payload.user).to.be.an("object");
        expect(res.body.payload.structure).to.be.an("object");
        expect(res.body.payload.user.cluster_id).to.equal(data.cluster_id);
        expect(res.body.payload.user.data.email).to.equal(data.data.email);
      })
  })
  it('Get a User', async () => {
    return chai.request(app)
    .get(`/users/${user_id}`)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.user_id).to.equal(user_id);
      })
  })
  it('Update a User', async () => {
    let data = {
      "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
      "data": {
        "email": "updatedvalue1@gmail.com",
        "password": "passwordupdatedvalue2",
        "key3": "updatedvalue3",
        "key4": "updatedvalue4"
      }
    }
    return chai.request(app)
    .put(`/users/${user_id}`)
    .send(data)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.user_id).to.equal(user_id);
        expect(res.body.payload.data.email).to.equal(data.data.email);
      })
  })
  it('Delete a User', async () => {
    return chai.request(app)
    .delete(`/users/${user_id}`)
      .then(res => {
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.contain(user_id);
      })
  })
  it('Deletes User Structure', async () => {
    return chai.request(app)
    .delete(`/userStructures/${cluster_id}`)
      .then(res => {
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.contain(cluster_id);
      })
  })
})