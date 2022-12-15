import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import dotenv from 'dotenv';
import config from '../config';

dotenv.config()

chai.use(chaiHttp);
const expect = chai.expect;
let cluster_id: string;

describe('Clusters', () => {
  it('Fetch all Clusters', async () => {
    return chai.request(app).get('/clusters')
      .then(res => {
        expect(res.body).to.be.an("array");
      })
  })

  it('Create a Cluster', async () => {
    let data = {
      "name": "Random Name",
      "email": "randomemail@gmail.com",
      "password": "randompassword",
      "description": "Random description",
      "multi_tenant": false,
      "test_string": config.TEST_STRING.toString()
    }
    return chai.request(app)
    .post('/clusters/create')
    .send(data)
      .then(res => {
        cluster_id = res.body.cluster_id
        expect(res.body).to.be.an("object");
        expect(res.body.email).to.equal(data.email);
      })
  })
  it('Get a Cluster', async () => {
    return chai.request(app)
    .get(`/clusters/${cluster_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.cluster_id).to.equal(cluster_id);
      })
  })
  it('Deactivate a Cluster', async () => {
    return chai.request(app)
    .post(`/clusters/freeze/${cluster_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.isactive).to.equal(false);
      })
  })
  it('Reactivate a Cluster', async () => {
    return chai.request(app)
    .post(`/clusters/unfreeze/${cluster_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.isactive).to.equal(true);
      })
  })
  it('Update a Cluster', async () => {
    let data = {
      "name": "Updated Random Name",
      "email": "randomemail@gmail.com",
      "password": "updatedrandompassword",
      "description": "Updated Random description",
      "multi_tenant": false
    }
    return chai.request(app)
    .put(`/clusters/${cluster_id}`)
    .send(data)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.name).to.equal(data.name);
      })
  })
  it('Delete a Cluster', async () => {
    return chai.request(app)
    .delete(`/clusters/${cluster_id}`)
      .then(res => {
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.contain(cluster_id);
      })
  })
})