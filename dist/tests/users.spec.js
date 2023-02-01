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
let user_id;
let cluster_id = "72bbebaf-4d9f-4286-8dba-3ecce1133561";
describe('Users', () => {
    it('Fetch all Users', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default).get('/users')
            .then(res => {
            expect(res.body.payload).to.be.an("array");
        });
    }));
    it('Deletes User Structure', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .delete(`/userStructures/${cluster_id}`)
            .then(res => {
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.contain(cluster_id);
        });
    }));
    it('Create a user', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
            "data": {
                "email": "value1@gmail.com",
                "password": "passwordvalue2",
                "key3": "value3",
                "key4": "value4",
                "test_string": "leemawoooo" //adding this to skip sending email.
            }
        };
        return chai_1.default.request(app_1.default)
            .post('/users/create')
            .send(data)
            .then(res => {
            user_id = res.body.payload.user.user_id;
            cluster_id = res.body.payload.user.cluster_id;
            expect(res.body.payload.user).to.be.an("object");
            expect(res.body.payload.structure).to.be.an("object");
            expect(res.body.payload.user.cluster_id).to.equal(data.cluster_id);
            expect(res.body.payload.user.data.email).to.equal(data.data.email);
        });
    }));
    it('Get a User', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .get(`/users/${user_id}`)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.user_id).to.equal(user_id);
        });
    }));
    it('Update a User', () => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            "cluster_id": "72bbebaf-4d9f-4286-8dba-3ecce1133561",
            "data": {
                "email": "updatedvalue1@gmail.com",
                "password": "passwordupdatedvalue2",
                "key3": "updatedvalue3",
                "key4": "updatedvalue4"
            }
        };
        return chai_1.default.request(app_1.default)
            .put(`/users/${user_id}`)
            .send(data)
            .then(res => {
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload.user_id).to.equal(user_id);
            expect(res.body.payload.data.email).to.equal(data.data.email);
        });
    }));
    it('Delete a User', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .delete(`/users/${user_id}`)
            .then(res => {
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.contain(user_id);
        });
    }));
    it('Deletes User Structure', () => __awaiter(void 0, void 0, void 0, function* () {
        return chai_1.default.request(app_1.default)
            .delete(`/userStructures/${cluster_id}`)
            .then(res => {
            expect(res.body.payload).to.equal(null);
            expect(res.body.message[0]).to.contain(cluster_id);
        });
    }));
});
//# sourceMappingURL=users.spec.js.map