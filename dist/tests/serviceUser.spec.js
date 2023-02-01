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
let document_id;
describe('Backend Service User', () => {
    it('Can create a Document', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "key1": "value1",
            "key2": "value2",
            "key3": "value3",
            "key4": "value4"
        };
        const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
        const collectionName = "test collection";
        return chai_1.default.request(app_1.default)
            .post(`/api/v1/${apiKey}/${collectionName}`)
            .send(data)
            .then(res => {
            document_id = res.body.payload.document_id;
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.cluster_id).to.equal(apiKey);
            expect(res.body.payload.collection_name).to.equal(collectionName);
            expect(res.body.payload.data.key1).to.equal(data.key1);
        });
    }));
    it('Can read a Document', () => __awaiter(void 0, void 0, void 0, function* () {
        const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
        const collectionName = "test collection";
        return chai_1.default.request(app_1.default)
            .get(`/api/v1/${apiKey}/${collectionName}/${document_id}`)
            .then(res => {
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.cluster_id).to.equal(apiKey);
            expect(res.body.payload.collection_name).to.equal(collectionName);
            expect(res.body.payload.document_id).to.equal(document_id);
        });
    }));
    it('Can update a Document', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "key2": "updatedValue2",
            "key3": "updatedValue3",
            "key5": "newValue5"
        };
        const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
        const collectionName = "test collection";
        return chai_1.default.request(app_1.default)
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
        });
    }));
    it('Can delete a Document', () => __awaiter(void 0, void 0, void 0, function* () {
        const apiKey = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
        const collectionName = "test collection";
        return chai_1.default.request(app_1.default)
            .delete(`/api/v1/${apiKey}/${collectionName}/${document_id}`)
            .then(res => {
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.include(`${document_id}`);
        });
    }));
});
//# sourceMappingURL=serviceUser.spec.js.map