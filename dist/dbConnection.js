"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const Pool = require('pg').Pool;
const pool = new Pool({
    user: config_1.default.DB_USER,
    host: config_1.default.DB_HOST,
    database: config_1.default.DATABASE,
    password: config_1.default.PASSWORD,
    port: config_1.default.DB_PORT
});
exports.default = pool;
//# sourceMappingURL=dbConnection.js.map