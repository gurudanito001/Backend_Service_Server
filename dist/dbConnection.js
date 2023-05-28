"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const Pool = require('pg').Pool;
/* const pool = new Pool({
  user: config.LOCAL_DB_USER,
  host: config.LOCAL_DB_HOST,
  database: config.LOCAL_DATABASE,
  password: config.LOCAL_PASSWORD,
  port: config.LOCAL_DB_PORT
}) */
const pool = new Pool({
    connectionString: config_1.default.DATABASE_URL + "?sslmode=require",
});
exports.default = pool;
//# sourceMappingURL=dbConnection.js.map