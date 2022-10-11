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
chai_1.default.use(chaiHttp);
const expect = chai_1.default.expect;
describe('Fetching Database Clusters', () => {
    it('should return an array', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default).get('/clusters')
            .then(res => {
            expect(res.body).to.be.an("array");
        });
    }));
});
describe('Posting a Database Clusters', () => {
    it('should throw error when email already exists', (done) => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .post('/clusters/create')
            .send({
            "name": "Daniel Nwokocha",
            "email": "email@gmail.com",
            "password": "Programmer95",
            "description": "Just another Cluster",
            "multi_tenant": false
        })
            .catch((err) => {
            err.response.should.have.status(404);
            done();
        });
    }));
});
//# sourceMappingURL=cluters.spec.js.map