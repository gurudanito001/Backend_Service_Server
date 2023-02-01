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
describe('Documents', () => {
    it('Fetch all Documents', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default).get('/documents')
            .then(res => {
            expect(res.body.payload).to.be.an("array");
        });
    }));
    it('Create a Document', () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        return chai_1.default.request(app_1.default)
            .post('/documents/create')
            .send(data)
            .then(res => {
            document_id = res.body.payload.document_id;
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.cluster_id).to.equal(data.cluster_id);
            expect(res.body.payload.data.key1).to.equal(data.data.key1);
        });
    }));
    it('Get a Document', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .get(`/documents/${document_id}`)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.document_id).to.equal(document_id);
        });
    }));
    it('Update a Document', () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        return chai_1.default.request(app_1.default)
            .put(`/documents/${document_id}`)
            .send(data)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.document_id).to.equal(document_id);
            expect(res.body.payload.data.key1).to.equal(data.data.key1);
        });
    }));
    it('Delete a Document', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .delete(`/documents/${document_id}`)
            .then(res => {
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.contain(document_id);
        });
    }));
});
//# sourceMappingURL=documents.spec.js.map