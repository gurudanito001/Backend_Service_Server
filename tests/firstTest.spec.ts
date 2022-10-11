import app from '../app';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Hello API Request', () => {
  it('should return response on call', async () => {
    return chai.request(app).get('/')
      .then(res => {
        chai.expect(res.text).to.eql("Express + TypeScript Server");
      })
  })
})