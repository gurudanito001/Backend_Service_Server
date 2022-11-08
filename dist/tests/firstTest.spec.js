"use strict";
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
describe('Hello API Request', () => {
    it('should return response on call', () => {
        return chai_1.default.request(app_1.default).get('/hello')
            .then(res => {
            chai_1.default.expect(res.text).to.eql("hello");
        });
    });
});
//# sourceMappingURL=firstTest.spec.js.map