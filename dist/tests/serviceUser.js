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
    /* it('Create a Document', async () => {
      return chai.request(app).get('/documents')
        .then(res => {
          expect(res.body).to.be.an("array");
        })
    }) */
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
            document_id = res.body.document_id;
            expect(res.body).to.be.an("object");
            expect(res.body.cluster_id).to.equal(apiKey);
            expect(res.body.collection_name).to.equal(collectionName);
            expect(res.body.data.key1).to.equal(data.key1);
        });
    }));
    /* it('Get a Document', async () => {
      return chai.request(app)
      .get(`/documents/${document_id}`)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.document_id).to.equal(document_id);
        })
    })
    it('Update a Document', async () => {
      let data = {
        "cluster_id": "325c87ca-c74a-4af7-a71f-4af6a634d421",
        "collection_id": "13ecd026-a7f6-4532-839b-52dfcd3c7f31",
        "collection_name": "collection1",
        "data": {
          "key1": "updatedvalue1",
          "key2": "updatedvalue2",
          "key3": "updatedvalue3",
          "key4": "updatedvalue4"
        }
        
      }
      return chai.request(app)
      .put(`/documents/${document_id}`)
      .send(data)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.document_id).to.equal(document_id);
          expect(res.body.data.key1).to.equal(data.data.key1);
        })
    })
    it('Delete a Document', async () => {
      return chai.request(app)
      .delete(`/documents/${document_id}`)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.contain(document_id);
        })
    }) */
});
//# sourceMappingURL=serviceUser.js.map