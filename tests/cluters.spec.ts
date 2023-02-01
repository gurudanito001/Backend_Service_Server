import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import dotenv from 'dotenv';
import config from '../config';
import { LoginCredentials } from 'interfaces';

dotenv.config()

chai.use(chaiHttp);
const expect = chai.expect;
let cluster_id: string;
let token: string, loginDetails: LoginCredentials;

describe('Clusters', () => {
  it('Fetch all Clusters', async () => {
    return chai.request(app).get('/clusters')
      .then(res => {
        expect(res.body.payload).to.be.an("array");
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
    .post('/clusters/register')
    .send(data)
      .then(res => {
        cluster_id = res.body.payload.cluster_id
        token = res.body.token;
        loginDetails = {email: data.email, password: data.password}
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.email).to.equal(data.email);
      })
  })

  it('Confirms cluster email with token', async () => {
    
    return chai.request(app)
    .get(`/clusters/confirmEmail/${token}`)
      .then(res => {
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.equal("Email Confirmed Successfully");
      })
  })

  it('Can Login', async () => {
    
    return chai.request(app)
    .post('/clusters/login')
    .send(loginDetails)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.email).to.equal(loginDetails.email);
        expect(res.body.message[0]).to.equal("Login Successful");
      })
  })

  it('Get a Cluster', async () => {
    return chai.request(app)
    .get(`/clusters/${cluster_id}`)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.cluster_id).to.equal(cluster_id);
      })
  })
  it('Deactivate a Cluster', async () => {
    return chai.request(app)
    .post(`/clusters/freeze/${cluster_id}`)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.isactive).to.equal(false);
      })
  })
  it('Reactivate a Cluster', async () => {
    return chai.request(app)
    .post(`/clusters/unfreeze/${cluster_id}`)
      .then(res => {
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.isactive).to.equal(true);
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
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload.name).to.equal(data.name);
      })
  })
  it('Delete a Cluster', async () => {
    return chai.request(app)
    .delete(`/clusters/${cluster_id}`)
      .then(res => {
        expect(res.body.payload).to.equal(null);
        expect(res.body.message[0]).to.contain(cluster_id);
      })
  })
})