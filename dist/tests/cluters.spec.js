"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const chai_1 = __importDefault(require("chai"));
const chaiHttp = require("chai-http");
require("mocha");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../config"));
dotenv_1.default.config();
chai_1.default.use(chaiHttp);
const expect = chai_1.default.expect;
let cluster_id;
let token, loginDetails;
describe('Clusters', () => {
    it('Fetch all Clusters', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default).get('/clusters')
            .then(res => {
            expect(res.body.payload).to.be.an("array");
        });
    }));
    it('Create a Cluster', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "name": "Random Name",
            "email": "randomemail@gmail.com",
            "password": "randompassword",
            "description": "Random description",
            "multi_tenant": false,
            "test_string": config_1.default.TEST_STRING.toString()
        };
        return chai_1.default.request(app_1.default)
            .post('/clusters/register')
            .send(data)
            .then(res => {
            cluster_id = res.body.payload.cluster_id;
            token = res.body.token;
            loginDetails = { email: data.email, password: data.password };
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.email).to.equal(data.email);
        });
    }));
    it('Confirms cluster email with token', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .get(`/clusters/confirmEmail/${token}`)
            .then(res => {
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.equal("Email Confirmed Successfully");
        });
    }));
    it('Can Login', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .post('/clusters/login')
            .send(loginDetails)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.email).to.equal(loginDetails.email);
            expect(res.body.message[0]).to.equal("Login Successful");
        });
    }));
    it('Get a Cluster', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .get(`/clusters/${cluster_id}`)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.cluster_id).to.equal(cluster_id);
        });
    }));
    it('Deactivate a Cluster', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .post(`/clusters/freeze/${cluster_id}`)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.isactive).to.equal(false);
        });
    }));
    it('Reactivate a Cluster', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .post(`/clusters/unfreeze/${cluster_id}`)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.isactive).to.equal(true);
        });
    }));
    it('Update a Cluster', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "name": "Updated Random Name",
            "email": "randomemail@gmail.com",
            "password": "updatedrandompassword",
            "description": "Updated Random description",
            "multi_tenant": false
        };
        return chai_1.default.request(app_1.default)
            .put(`/clusters/${cluster_id}`)
            .send(data)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.name).to.equal(data.name);
        });
    }));
    it('Delete a Cluster', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .delete(`/clusters/${cluster_id}`)
            .then(res => {
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.contain(cluster_id);
        });
    }));
});
//# sourceMappingURL=cluters.spec.js.map