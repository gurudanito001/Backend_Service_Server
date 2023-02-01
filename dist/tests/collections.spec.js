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
let collection_id;
describe('Collections', () => {
    it('Fetch all Collections', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default).get('/collections')
            .then(res => {
            expect(res.body.payload).to.be.an("array");
        });
    }));
    it('Create a Collection', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
            "name": "Test Collection",
        };
        return chai_1.default.request(app_1.default)
            .post('/collections/create')
            .send(data)
            .then(res => {
            collection_id = res.body.payload.collection_id;
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.cluster_id).to.equal(data.cluster_id);
        });
    }));
    it('Get a Collection', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .get(`/collections/${collection_id}`)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.collection_id).to.equal(collection_id);
        });
    }));
    it('Update a Collection', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "name": "Updated Random Name",
        };
        return chai_1.default.request(app_1.default)
            .put(`/collections/${collection_id}`)
            .send(data)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.name).to.equal(data.name.toLowerCase());
        });
    }));
    it('Delete a Collection', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .delete(`/collections/${collection_id}`)
            .then(res => {
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.contain(collection_id.toLowerCase());
        });
    }));
});
//# sourceMappingURL=collections.spec.js.map